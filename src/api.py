from fastapi import FastAPI, UploadFile, File, HTTPException, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.types import ASGIApp, Message, Receive, Scope, Send
from contextlib import asynccontextmanager
import os
import logging
import logging.handlers
import traceback
import sys
import time
import asyncio
from datetime import datetime
import feedparser
import re

from document_loader import load_document_with_meta
from chunking import chunk_text
from embedding_store import build_faiss_index, search as embed_search
from rag_pipeline import rag_query
from llm_interface import query_llm

from config import settings
from session_manager import SessionManager, SessionNotFoundError
from models import (
    QueryRequest,
    SummarizeRequest,
    ExtractClausesRequest,
    CompareRequest,
    AnalyzeRequest,
    UploadResponse,
    QueryResponse,
    SummarizeResponse,
    CompareResponse,
    AnalyzeResponse,
    ExtractClausesResponse,
    ExtractedClause,
    RetrievedChunk,
    ErrorResponse,
    HealthCheckResponse,
)
from utils import (
    save_upload_file_temp,
    cleanup_temp_file,
    validate_upload_file,  # Changed from validate_file_type
    validate_file_size,
    validate_file_content,  # Added
    create_error_response,
    create_success_response,
    setup_logger,
    generate_request_id,
)

# Configure logging
if not os.path.exists('logs'):
    os.makedirs('logs')

logger = setup_logger(__name__, log_level=settings.LOG_LEVEL, log_file=settings.LOG_FILE)
logger.info(f"Initializing FastAPI backend (v0.1.0) with DEBUG={settings.DEBUG}")

# Global state
sessions = SessionManager()
app_start_time = None


# Background task for session cleanup
async def cleanup_sessions_task():
    """Run session cleanup every hour."""
    while True:
        try:
            await asyncio.sleep(settings.SESSION_CLEANUP_INTERVAL_MINUTES * 60)
            count = sessions.cleanup_expired_sessions(settings.SESSION_MAX_AGE_HOURS)
            logger.info(f"Background cleanup: removed {count} expired sessions")
        except Exception as e:
            logger.exception("Error in cleanup task")


# Startup/shutdown lifespan
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Handle startup and shutdown events."""
    global app_start_time
    
    # Startup
    app_start_time = datetime.utcnow()
    logger.info("========== FastAPI Server Starting ==========")
    
    # Verify GEMINI_API_KEY
    if not os.getenv("GEMINI_API_KEY"):
        logger.warning("GEMINI_API_KEY environment variable not set - LLM queries will fail")
    
    # Start background cleanup task
    cleanup_task = asyncio.create_task(cleanup_sessions_task())
    logger.info(f"Session cleanup task started (interval: {settings.SESSION_CLEANUP_INTERVAL_MINUTES} minutes)")
    
    yield
    
    # Shutdown
    logger.info("========== FastAPI Server Shutting Down ==========")
    cleanup_task.cancel()
    try:
        await cleanup_task
    except asyncio.CancelledError:
        pass
    # Final cleanup
    final_count = sessions.cleanup_expired_sessions(0)  # cleanup all
    logger.info(f"Final cleanup: removed {final_count} sessions on shutdown")


# Exception handlers
async def session_not_found_handler(request: Request, exc: SessionNotFoundError) -> JSONResponse:
    """Handle session not found errors."""
    return JSONResponse(
        status_code=status.HTTP_404_NOT_FOUND,
        content=ErrorResponse(
            error="Session not found",
            detail=str(exc),
            success=False,
        ).dict(),
    )


async def validation_error_handler(request: Request, exc: RequestValidationError) -> JSONResponse:
    """Handle validation errors with detailed feedback."""
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content=ErrorResponse(
            error="Validation error",
            detail=str(exc.errors()),
            success=False,
        ).dict(),
    )


async def generic_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """Handle uncaught exceptions."""
    logger.exception(f"Unhandled exception: {exc}")
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content=ErrorResponse(
            error="Internal server error",
            detail="An unexpected error occurred" if not settings.DEBUG else str(exc),
            success=False,
        ).dict(),
    )


# Create FastAPI app with lifespan
app = FastAPI(
    title="RAG Contract Assistant API",
    description="REST API for document processing, retrieval-augmented generation (RAG), and contract analysis",
    version="0.1.0",
    contact={
        "name": "Development Team",
        "url": "https://github.com",
    },
    docs_url="/api/docs" if settings.ENABLE_API_DOCS else None,
    redoc_url="/api/redoc" if settings.ENABLE_API_DOCS else None,
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Logging middleware
@app.middleware("http")
async def logging_middleware(request: Request, call_next):
    """Log all requests and responses."""
    request_id = generate_request_id()
    start = time.time()
    
    # Log request
    logger.info(
        f"[{request_id}] {request.method} {request.url.path} - "
        f"client={request.client.host if request.client else 'unknown'}"
    )
    
    try:
        response = await call_next(request)
    except Exception as e:
        logger.error(f"[{request_id}] Request processing error: {e}")
        raise
    
    duration = time.time() - start
    logger.info(
        f"[{request_id}] Response: {response.status_code} ({duration:.3f}s)"
    )
    
    return response


# Register exception handlers
app.add_exception_handler(SessionNotFoundError, session_not_found_handler)
app.add_exception_handler(RequestValidationError, validation_error_handler)
app.add_exception_handler(Exception, generic_exception_handler)


@app.post(
    f"{settings.API_PREFIX}/upload",
    response_model=UploadResponse,
    tags=["Documents"],
    summary="Upload and process a document",
    description="Upload a PDF, DOCX, TXT, or image file for processing and indexing. Returns a session_id for subsequent queries.",
)
def upload_file(file: UploadFile = File(...)):
    # Comprehensive file validation using validate_upload_file
    is_valid, error_msg = validate_upload_file(
        file, 
        settings.MAX_FILE_SIZE_MB, 
        settings.ALLOWED_FILE_TYPES
    )
    if not is_valid:
        raise HTTPException(status_code=400, detail=error_msg)

    # Save temp file
    temp_path = save_upload_file_temp(file)
    try:
        # Additional validation: file size and content
        if not validate_file_size(temp_path, settings.MAX_FILE_SIZE_MB):
            cleanup_temp_file(temp_path)
            raise HTTPException(status_code=400, detail=f"File too large. Max {settings.MAX_FILE_SIZE_MB} MB allowed")
        
        # Validate file content (check for corruption)
        content_valid, content_error = validate_file_content(temp_path)
        if not content_valid:
            cleanup_temp_file(temp_path)
            raise HTTPException(status_code=400, detail=content_error)

        # Extract text and metadata
        try:
            meta = load_document_with_meta(temp_path)
            text = meta.get("text", "")
            pages = meta.get("pages", 0)
            file_type = meta.get("file_type", None)
        except Exception as e:
            logger.exception("Document extraction failed")
            raise HTTPException(status_code=500, detail=f"Document extraction failed: {e}")

        # Validate that text was extracted
        if not text or len(text.strip()) == 0:
            raise HTTPException(status_code=400, detail="No text could be extracted from the document. Please ensure the file contains readable text.")

        # Chunk
        chunks = chunk_text(text, max_length=settings.CHUNK_SIZE, overlap=settings.CHUNK_OVERLAP)
        
        # Validate that chunks were created
        if not chunks:
            raise HTTPException(status_code=400, detail="Failed to create text chunks from document. Document may be too short or corrupted.")

        # Build index
        index, chunk_map = build_faiss_index(chunks)

        # Store in session manager
        session_id = sessions.create_session(index, chunk_map, text, file.filename)

        return UploadResponse(
            session_id=session_id,
            filename=file.filename,
            chunk_count=len(chunks),
            file_type=file_type,
            pages_processed=pages,
            text_length=len(text) if text else 0,
            message="Document uploaded and indexed successfully",
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.exception("Upload failed")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cleanup_temp_file(temp_path)


@app.post(
    f"{settings.API_PREFIX}/query",
    response_model=QueryResponse,
    tags=["Documents"],
    summary="Query a document",
    description="Ask questions about a previously uploaded document. Returns answer and relevant retrieved chunks.",
)
def query_document(req: QueryRequest):
    try:
        session = sessions.get_session(req.session_id)
    except SessionNotFoundError:
        raise HTTPException(status_code=404, detail="Session not found")

    try:
        answer = rag_query(req.query, session["index"], session["chunk_map"], top_k=settings.TOP_K_RESULTS)

        # Also return retrieved chunks for transparency
        results = embed_search(req.query, session["index"], session["chunk_map"], top_k=settings.TOP_K_RESULTS)
        retrieved = [RetrievedChunk(text=chunk, distance=dist) for chunk, dist in results]

        return QueryResponse(answer=answer, retrieved_chunks=retrieved)
    except Exception as e:
        logger.exception("Query failed")
        raise HTTPException(status_code=500, detail=str(e))


@app.post(
    f"{settings.API_PREFIX}/summarize",
    response_model=SummarizeResponse,
    tags=["Analysis"],
    summary="Summarize a document",
    description="Generate a concise summary of the uploaded document.",
)
def summarize(req: SummarizeRequest):
    try:
        session = sessions.get_session(req.session_id)
    except SessionNotFoundError:
        raise HTTPException(status_code=404, detail="Session not found")

    try:
        prompt = f"Summarize the following contract concisely:\n\n{session['file_text']}"
        summary = query_llm(prompt)
        return SummarizeResponse(summary=summary)
    except Exception as e:
        logger.exception("Summarization failed")
        raise HTTPException(status_code=500, detail=str(e))


@app.post(
    f"{settings.API_PREFIX}/compare",
    response_model=CompareResponse,
    tags=["Analysis"],
    summary="Compare clause to template",
    description="Compare a specific clause from the document against standard templates and highlight differences.",
)
def compare(req: CompareRequest):
    try:
        session = sessions.get_session(req.session_id)
    except SessionNotFoundError:
        raise HTTPException(status_code=404, detail="Session not found")

    try:
        comparison_prompt = f"""
Compare the following contract clause to a standard employment clause template and highlight any differences or missing points:

Clause:
{req.clause}
"""
        comparison = query_llm(comparison_prompt)
        return CompareResponse(comparison=comparison)
    except Exception as e:
        logger.exception("Comparison failed")
        raise HTTPException(status_code=500, detail=str(e))


@app.post(
    f"{settings.API_PREFIX}/analyze",
    response_model=AnalyzeResponse,
    tags=["Analysis"],
    summary="Analyze document for risks",
    description="Perform risk, compliance, or legal analysis on the uploaded document.",
)
def analyze(req: AnalyzeRequest):
    try:
        session = sessions.get_session(req.session_id)
    except SessionNotFoundError:
        raise HTTPException(status_code=404, detail="Session not found")

    try:
        prompt = f"Analyze the following contract for potential {req.analysis_type} issues, liabilities, and areas of concern:\n\n{session['file_text']}"
        analysis = query_llm(prompt)
        return AnalyzeResponse(analysis=analysis, analysis_type=req.analysis_type)
    except Exception as e:
        logger.exception("Analysis failed")
        raise HTTPException(status_code=500, detail=str(e))


@app.post(
    f"{settings.API_PREFIX}/extract-clauses",
    response_model=ExtractClausesResponse,
    tags=["Analysis"],
    summary="Extract and structure clauses from document",
    description="Extract all clauses from the document and return them as structured JSON with type, risk level, and implications.",
)
def extract_clauses(req: ExtractClausesRequest):
    """Extract structured clauses from a document."""
    try:
        session = sessions.get_session(req.session_id)
    except SessionNotFoundError:
        raise HTTPException(status_code=404, detail="Session not found")

    try:
        # Use a detailed prompt to get structured clause extraction
        prompt = f"""Analyze this legal document and extract ALL clauses. For each clause, provide:
1. The full clause text
2. Clause type/category (e.g., "Data Use - Payment & Delivery", "Liability Limitation", "Termination")
3. Risk level (must be one of: safe, moderate, high)
4. Brief implications (2-3 sentences explaining the impact)
5. General category if applicable (e.g., Data Use, Liability, Payment, Legal, Termination)

Format EVERY response as a valid JSON array with objects having these exact fields:
- clause_text (string): full clause text
- clause_type (string): specific type/description
- risk_level (string): one of safe/moderate/high
- implications (string): brief explanation
- category (string or null): general category

RESPOND ONLY WITH THE JSON ARRAY. No additional text.

Document text:
{session['file_text']}
"""
        llm_response = query_llm(prompt)
        
        # Try to parse the LLM response as JSON
        import json
        try:
            # Clean up the response if it contains markdown code blocks
            cleaned = llm_response.strip()
            if cleaned.startswith('```'):
                # Remove markdown code block markers
                cleaned = cleaned.split('```')[1]
                if cleaned.startswith('json'):
                    cleaned = cleaned[4:]
                cleaned = cleaned.strip()
            
            parsed_clauses = json.loads(cleaned)
            if not isinstance(parsed_clauses, list):
                parsed_clauses = [parsed_clauses] if isinstance(parsed_clauses, dict) else []
        except json.JSONDecodeError:
            logger.warning("Failed to parse LLM response as JSON, returning empty clauses list")
            parsed_clauses = []
        
        # Convert parsed data to ExtractedClause objects with validation
        extracted_clauses = []
        for item in parsed_clauses:
            try:
                clause = ExtractedClause(
                    clause_text=item.get('clause_text', item.get('text', '')),
                    clause_type=item.get('clause_type', item.get('type', 'Unspecified')),
                    risk_level=item.get('risk_level', item.get('risk', 'moderate')),
                    implications=item.get('implications', item.get('explanation', None)),
                    category=item.get('category', None)
                )
                extracted_clauses.append(clause)
            except Exception as e:
                logger.warning(f"Failed to parse clause item: {e}")
                continue
        
        return ExtractClausesResponse(
            clauses=extracted_clauses,
            total_clauses=len(extracted_clauses),
        )
    except Exception as e:
        logger.exception("Clause extraction failed")
        raise HTTPException(status_code=500, detail=str(e))


def fetch_news_from_rss(topic: str):
    """Fetch a small set of articles from Google News RSS for a topic.

    Returns a list of simple dicts with keys: id,title,description,url,publishedDate,source,image,topic
    """
    try:
        rss_url = f"https://news.google.com/rss/search?q={topic.replace(' ', '+')}&hl=en-US&gl=US&ceid=US:en"
        logger.info(f"Fetching news RSS: {rss_url}")
        feed = feedparser.parse(rss_url)
        if not feed or 'entries' not in feed:
            logger.warning("Failed to parse news RSS feed")
            return []

        articles = []
        seen = set()
        for idx, entry in enumerate(feed.entries[:10]):
            try:
                title = (entry.get('title') or '').strip()
                if not title or title in seen:
                    continue
                seen.add(title)

                url = entry.get('link', '')
                description = entry.get('summary', '')
                if '<' in description and '>' in description:
                    description = re.sub(r'<[^>]+>', '', description).strip()

                published = entry.get('published', '')
                source = entry.get('source', {}).get('title', '') if entry.get('source') else 'Google News'

                # Attempt to extract image from common RSS fields
                image = ''
                if hasattr(entry, 'media_thumbnail') and entry.media_thumbnail:
                    try:
                        image = entry.media_thumbnail[0].get('url', '')
                    except Exception:
                        image = ''
                if not image and hasattr(entry, 'links') and entry.links:
                    for l in entry.links:
                        if l.get('rel') == 'image' or (l.get('type') or '').startswith('image/'):
                            image = l.get('href', '')
                            break

                articles.append({
                    'id': f"{topic.lower()}-{len(articles)}",
                    'title': title,
                    'description': (description or title)[:250],
                    'url': url,
                    'publishedDate': published,
                    'source': source,
                    'image': image,
                    'topic': topic.lower(),
                })
            except Exception:
                logger.exception("Error parsing RSS entry")
                continue

        return articles
    except Exception:
        logger.exception("Failed to fetch news RSS")
        return []


@app.get(f"{settings.API_PREFIX}/news/{{topic}}", tags=["News"], summary="Proxy Google News RSS for a topic")
def get_news_proxy(topic: str):
    """GET /api/news/{topic} - return news articles for the given topic from Google News RSS."""
    topic_clean = (topic or '').strip()
    if not topic_clean:
        raise HTTPException(status_code=400, detail="Topic is required")

    articles = fetch_news_from_rss(topic_clean)
    if not articles:
        raise HTTPException(status_code=404, detail=f"No news found for '{topic_clean}'")

    return articles


@app.get(
    f"{settings.API_PREFIX}/health",
    response_model=HealthCheckResponse,
    tags=["System"],
    summary="Health check endpoint",
    description="Returns system health status, active session count, and uptime.",
)
def health_check() -> HealthCheckResponse:
    """Perform comprehensive health check."""
    active_sessions = len(sessions.get_all_sessions())
    uptime = (
        (datetime.utcnow() - app_start_time).total_seconds()
        if app_start_time
        else 0
    )
    
    # Check if GEMINI_API_KEY is configured
    status_str = "healthy" if os.getenv("GEMINI_API_KEY") else "degraded"
    
    return HealthCheckResponse(
        status=status_str,
        timestamp=datetime.utcnow(),
        version="0.1.0",
        active_sessions=active_sessions,
        uptime_seconds=uptime,
    )


@app.get(
    f"{settings.API_PREFIX}/health/detailed",
    tags=["System"],
    summary="Detailed health metrics",
    description="Returns comprehensive system metrics including session details and memory usage.",
)
def health_check_detailed():
    """Return detailed health metrics for monitoring."""
    uptime = (
        (datetime.utcnow() - app_start_time).total_seconds()
        if app_start_time
        else 0
    )
    
    all_sessions = sessions.get_all_sessions()
    session_details = {
        "total_active": len(all_sessions),
        "oldest_session_age_seconds": sessions.get_oldest_session_age(),
    }
    
    return {
        "status": "healthy" if os.getenv("GEMINI_API_KEY") else "degraded",
        "timestamp": datetime.utcnow().isoformat(),
        "version": "0.1.0",
        "uptime_seconds": uptime,
        "sessions": session_details,
        "api_prefix": settings.API_PREFIX,
        "max_file_size_mb": settings.MAX_FILE_SIZE_MB,
    }


# Debug helper: echo multipart/form-data contents for troubleshooting
@app.post(f"{settings.API_PREFIX}/debug-upload", tags=["Debug"], summary="Debug upload endpoint")
async def debug_upload(request: Request):
    """Temporary debug endpoint that echoes received form fields and files.

    Use this to verify that the client is sending a proper multipart/form-data
    request and that files arrive under the expected `file` field.
    """
    try:
        form = await request.form()
        fields = []
        files = []
        for key, value in form.items():
            # UploadFile instances expose `filename` and async `read()`
            if hasattr(value, "filename"):
                filename = getattr(value, "filename", None)
                # read small preview (don't load huge files into memory)
                try:
                    content = await value.read()
                    size = len(content) if content is not None else None
                except Exception:
                    size = None
                files.append({"field": key, "filename": filename, "size": size})
            else:
                fields.append({"field": key, "value": str(value)})

        logger.info(f"Debug upload received fields={fields} files={files}")
        return {"fields": fields, "files": files}
    except Exception as e:
        logger.exception("Debug upload handler failed")
        raise HTTPException(status_code=500, detail=str(e))