import os
import tempfile
import shutil
import logging
import logging.handlers
import uuid
from datetime import datetime, timedelta
from typing import List, Optional, Tuple
from fastapi import UploadFile

logger = logging.getLogger(__name__)


def get_file_extension(filename: str) -> str:
    return os.path.splitext(filename)[1].lstrip('.').lower()


def validate_file_type(filename: str, allowed_extensions: List[str]) -> bool:
    ext = get_file_extension(filename)
    return ext in [e.lower() for e in allowed_extensions]


def validate_upload_file(
    file: UploadFile,
    max_size_mb: int,
    allowed_types: List[str],
) -> Tuple[bool, Optional[str]]:
    """Comprehensive file validation.
    
    Returns:
        (is_valid, error_message)
    """
    # Check filename
    if not file.filename or len(file.filename) == 0:
        return False, "Filename cannot be empty"
    
    # Prevent path traversal
    if "/" in file.filename or "\\" in file.filename:
        return False, "Filename contains invalid path characters"
    
    # Check file type
    if not validate_file_type(file.filename, allowed_types):
        ext = get_file_extension(file.filename)
        return False, f"File type '{ext}' not allowed. Allowed types: {', '.join(allowed_types)}"
    
    return True, None


def validate_file_content(file_path: str) -> Tuple[bool, Optional[str]]:
    """Validate file content (readable, not corrupted).
    
    Returns:
        (is_valid, error_message)
    """
    try:
        ext = get_file_extension(file_path)
        size = os.path.getsize(file_path)
        
        if size == 0:
            return False, "File is empty"
        
        if ext == "pdf":
            with open(file_path, 'rb') as f:
                header = f.read(4)
                if header != b'%PDF':
                    return False, "Invalid PDF file (missing header)"
        
        elif ext == "docx":
            try:
                with open(file_path, 'rb') as f:
                    header = f.read(4)
                    if header != b'PK\x03\x04':  # ZIP header
                        return False, "Invalid DOCX file (not a valid ZIP)"
            except Exception:
                return False, "Cannot read DOCX file"
        
        elif ext == "txt":
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    f.read(100)  # Try reading first 100 chars
            except UnicodeDecodeError:
                return False, "TXT file has invalid encoding (must be UTF-8)"
            except Exception:
                return False, "Cannot read TXT file"
        
        elif ext in ("png", "jpg", "jpeg", "tiff", "bmp"):
            try:
                from PIL import Image
                with Image.open(file_path) as img:
                    img.verify()
            except ImportError:
                return True, None  # PIL not installed, skip image validation
            except Exception:
                return False, "Invalid or corrupted image file"
        
        return True, None
    except Exception as e:
        return False, f"File validation error: {str(e)}"


def save_upload_file_temp(upload_file: UploadFile) -> str:
    """Save an UploadFile to a temporary file and return the path."""
    suffix = os.path.splitext(upload_file.filename)[1]
    fd, temp_path = tempfile.mkstemp(suffix=suffix, prefix="upload_")
    os.close(fd)
    try:
        with open(temp_path, 'wb') as f:
            shutil.copyfileobj(upload_file.file, f)
    except Exception:
        try:
            os.remove(temp_path)
        except Exception:
            pass
        raise
    return temp_path


def validate_file_size(file_path: str, max_size_mb: int = 10) -> bool:
    try:
        size = os.path.getsize(file_path)
        return size <= max_size_mb * 1024 * 1024
    except Exception:
        return False


def validate_mime_type(upload_file: UploadFile, allowed_mimes: List[str]) -> Tuple[bool, Optional[str]]:
    """Validate content_type (MIME) of an UploadFile.

    Returns (is_valid, error_message)
    """
    try:
        content_type = (upload_file.content_type or "").lower()
        if not content_type:
            return False, "Missing content type"

        # allow simple startswith matching (image/*, application/pdf, text/plain, etc.)
        for m in allowed_mimes:
            if m.endswith("/*"):
                if content_type.startswith(m.split('/')[0] + '/'):
                    return True, None
            else:
                if content_type == m:
                    return True, None

        return False, f"Unsupported MIME type: {content_type}"
    except Exception as e:
        return False, f"MIME validation error: {e}"


def cleanup_temp_file(file_path: str):
    try:
        if os.path.exists(file_path):
            os.remove(file_path)
    except Exception:
        logger.exception("Failed to cleanup temp file: %s", file_path)


def create_success_response(data: dict) -> dict:
    resp = {"success": True}
    resp.update(data)
    return resp


def create_error_response(error: str, detail: Optional[str] = None) -> dict:
    return {"success": False, "error": error, "detail": detail}


def generate_session_id() -> str:
    return uuid.uuid4().hex


def generate_request_id() -> str:
    """Generate unique request ID for tracing."""
    return uuid.uuid4().hex[:12]


def is_session_expired(created_at: datetime, max_age_hours: int = 24) -> bool:
    return (datetime.utcnow() - created_at) > timedelta(hours=max_age_hours)

def setup_logger(
    name: str,
    log_level: str = "INFO",
    log_file: Optional[str] = None,
) -> logging.Logger:
    """Configure and return logger instance with file rotation."""
    logger = logging.getLogger(name)
    
    # Avoid duplicate handlers
    if logger.handlers:
        return logger
    
    # Convert string level to logging level
    level = getattr(logging, log_level.upper(), logging.INFO)
    logger.setLevel(level)
    
    # Console handler
    console_handler = logging.StreamHandler()
    console_handler.setLevel(level)
    
    # Formatter
    formatter = logging.Formatter(
        '[%(asctime)s] %(levelname)s [%(name)s:%(lineno)d] %(message)s',
        datefmt='%Y-%m-%d %H:%M:%S'  # FIXED: Changed from '%Y-%m-d' to '%Y-%m-%d'
    )
    console_handler.setFormatter(formatter)
    logger.addHandler(console_handler)
    
    # File handler with rotation
    if log_file:
        try:
            log_dir = os.path.dirname(log_file)
            if log_dir and not os.path.exists(log_dir):
                os.makedirs(log_dir)
            
            file_handler = logging.handlers.RotatingFileHandler(
                log_file,
                maxBytes=10 * 1024 * 1024,  # 10 MB
                backupCount=5,
            )
            file_handler.setLevel(level)
            file_handler.setFormatter(formatter)
            logger.addHandler(file_handler)
        except Exception as e:
            logger.warning(f"Could not set up file logging: {e}")
    
    return logger


def get_session_stats(sessions) -> dict:
    """Get session statistics for monitoring."""
    all_sessions = sessions.get_all_sessions()
    return {
        "total_active": len(all_sessions),
        "oldest_session_age_seconds": sessions.get_oldest_session_age(),
    }