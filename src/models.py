from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from datetime import datetime
from enum import Enum


class AnalysisType(str, Enum):
    """Allowed analysis types."""
    risk = "risk"
    compliance = "compliance"
    legal = "legal"


class QueryRequest(BaseModel):
    session_id: str = Field(..., description="Session identifier returned from upload")
    query: str = Field(..., min_length=1, max_length=1000, description="User's question about the document")

    class Config:
        schema_extra = {
            "example": {
                "session_id": "abc123def456",
                "query": "What are the termination clauses?"
            }
        }


class SummarizeRequest(BaseModel):
    session_id: str = Field(..., description="Session identifier returned from upload")

    class Config:
        schema_extra = {
            "example": {
                "session_id": "abc123def456"
            }
        }


class ExtractClausesRequest(BaseModel):
    session_id: str = Field(..., description="Session identifier returned from upload")

    class Config:
        schema_extra = {
            "example": {
                "session_id": "abc123def456"
            }
        }


class CompareRequest(BaseModel):
    session_id: str = Field(..., description="Session identifier returned from upload")
    clause: str = Field(..., min_length=1, max_length=5000, description="Clause text to compare against templates")

    class Config:
        schema_extra = {
            "example": {
                "session_id": "abc123def456",
                "clause": "The employee may be terminated at-will with 30 days notice."
            }
        }


class AnalyzeRequest(BaseModel):
    session_id: str = Field(..., description="Session identifier returned from upload")
    analysis_type: Optional[AnalysisType] = Field("risk", description="Type of analysis to perform")

    class Config:
        schema_extra = {
            "example": {
                "session_id": "abc123def456",
                "analysis_type": "risk"
            }
        }


class RetrievedChunk(BaseModel):
    text: str = Field(..., description="Text of the retrieved chunk")
    distance: float = Field(..., description="Similarity distance from the query")


class UploadResponse(BaseModel):
    session_id: str = Field(..., description="Unique session identifier for subsequent requests")
    filename: str = Field(..., description="Original uploaded filename")
    chunk_count: int = Field(..., description="Number of text chunks created")
    file_type: Optional[str] = Field(None, description="Detected file type (pdf, image, txt, docx)")
    pages_processed: Optional[int] = Field(None, description="Number of pages or image count processed")
    text_length: Optional[int] = Field(None, description="Length of extracted text in characters")
    message: str = Field(..., description="Status message")
    success: bool = Field(True, description="Success indicator")

    class Config:
        schema_extra = {
            "example": {
                "session_id": "abc123def456",
                "filename": "contract.pdf",
                "chunk_count": 42,
                "message": "Document uploaded and indexed successfully",
                "success": True
            }
        }


class QueryResponse(BaseModel):
    answer: str = Field(..., description="LLM-generated answer to the query")
    retrieved_chunks: Optional[List[RetrievedChunk]] = Field(None, description="Source chunks used for the answer")
    success: bool = Field(True, description="Success indicator")

    class Config:
        schema_extra = {
            "example": {
                "answer": "According to the contract, the termination clause states...",
                "retrieved_chunks": [
                    {"text": "The contract may be terminated...", "distance": 0.234},
                    {"text": "Upon termination, notice period...", "distance": 0.456}
                ],
                "success": True
            }
        }


class SummarizeResponse(BaseModel):
    summary: str = Field(..., description="Concise summary of the document")
    success: bool = Field(True, description="Success indicator")

    class Config:
        schema_extra = {
            "example": {
                "summary": "This is an employment contract between Company A and Employee B...",
                "success": True
            }
        }


class CompareResponse(BaseModel):
    comparison: str = Field(..., description="Comparison analysis result")
    success: bool = Field(True, description="Success indicator")

    class Config:
        schema_extra = {
            "example": {
                "comparison": "This clause differs from standard in the following ways...",
                "success": True
            }
        }


class AnalyzeResponse(BaseModel):
    analysis: str = Field(..., description="Analysis result")
    analysis_type: str = Field(..., description="Type of analysis performed")
    success: bool = Field(True, description="Success indicator")

    class Config:
        schema_extra = {
            "example": {
                "analysis": "Risk assessment: Found 3 high-risk clauses...",
                "analysis_type": "risk",
                "success": True
            }
        }


class ExtractedClause(BaseModel):
    clause_text: str = Field(..., description="Full text of the clause")
    clause_type: str = Field(..., description="Type or category of the clause")
    risk_level: str = Field(..., description="Risk level: safe, moderate, or high")
    implications: Optional[str] = Field(None, description="Implications and explanation of the clause")
    category: Optional[str] = Field(None, description="General category (e.g., Data Use, Legal, Payment)")

    class Config:
        schema_extra = {
            "example": {
                "clause_text": "We will use that information to process your payment...",
                "clause_type": "Data Use - Payment & Delivery",
                "risk_level": "moderate",
                "implications": "The company uses personal information for essential business operations...",
                "category": "Data Use"
            }
        }


class ExtractClausesResponse(BaseModel):
    clauses: List[ExtractedClause] = Field(..., description="List of extracted clauses")
    total_clauses: int = Field(..., description="Total number of clauses extracted")
    success: bool = Field(True, description="Success indicator")

    class Config:
        schema_extra = {
            "example": {
                "clauses": [
                    {
                        "clause_text": "We will use that information to process your payment...",
                        "clause_type": "Data Use - Payment & Delivery",
                        "risk_level": "moderate",
                        "implications": "The company uses personal information...",
                        "category": "Data Use"
                    }
                ],
                "total_clauses": 1,
                "success": True
            }
        }


class ErrorResponse(BaseModel):
    error: str = Field(..., description="Error type/message")
    detail: Optional[str] = Field(None, description="Detailed error information")
    success: bool = Field(False, description="Always False for errors")

    class Config:
        schema_extra = {
            "example": {
                "error": "Session not found",
                "detail": "Session abc123 has expired or does not exist",
                "success": False
            }
        }


class HealthCheckResponse(BaseModel):
    status: str = Field(..., description="System status: 'healthy' or 'degraded'")
    timestamp: datetime = Field(..., description="Current UTC timestamp")
    version: str = Field(..., description="API version")
    active_sessions: int = Field(..., description="Number of active sessions")
    uptime_seconds: float = Field(..., description="Server uptime in seconds")

    class Config:
        schema_extra = {
            "example": {
                "status": "healthy",
                "timestamp": "2025-01-15T10:30:45.123456",
                "version": "0.1.0",
                "active_sessions": 3,
                "uptime_seconds": 3600.5
            }
        }
