import logging
import os
import signal
from pathlib import Path

from config import settings
from utils import setup_logger

# Configure root logger before importing app
logger = setup_logger(
    "uvicorn",
    log_level=settings.LOG_LEVEL,
    log_file=settings.LOG_FILE,
)


def log_startup_info():
    """Log startup configuration info."""
    logger.info("=" * 60)
    logger.info(f"Starting RAG Contract Assistant API (v0.1.0)")
    logger.info(f"DEBUG: {settings.DEBUG}")
    logger.info(f"API Prefix: {settings.API_PREFIX}")
    logger.info(f"CORS Origins: {', '.join(settings.CORS_ORIGINS)}")
    logger.info(f"Max File Size: {settings.MAX_FILE_SIZE_MB} MB")
    logger.info(f"Session Cleanup Interval: {settings.SESSION_CLEANUP_INTERVAL_MINUTES} minutes")
    logger.info(f"Session Max Age: {settings.SESSION_MAX_AGE_HOURS} hours")
    logger.info(f"Log Level: {settings.LOG_LEVEL}")
    logger.info(f"API Docs Enabled: {settings.ENABLE_API_DOCS}")
    logger.info("=" * 60)


def validate_startup():
    """Validate configuration before startup."""
    # Check GEMINI_API_KEY
    try:
        if not os.getenv("GEMINI_API_KEY"):
            logger.error("CRITICAL: GEMINI_API_KEY environment variable is not set")
            return False
    except Exception as e:
        logger.error(f"Error validating GEMINI_API_KEY: {e}")
        return False
    
    # Ensure logs directory exists
    try:
        log_dir = os.path.dirname(settings.LOG_FILE)
        if log_dir:
            Path(log_dir).mkdir(parents=True, exist_ok=True)
            logger.info(f"Log directory ensured: {log_dir}")
    except Exception as e:
        logger.warning(f"Could not create logs directory: {e}")
    
    return True


def setup_signal_handlers():
    """Setup graceful shutdown handlers."""
    def signal_handler(signum, frame):
        logger.info(f"Received signal {signum}, shutting down gracefully...")
        raise KeyboardInterrupt()
    
    try:
        signal.signal(signal.SIGTERM, signal_handler)
        signal.signal(signal.SIGINT, signal_handler)
        logger.debug("Signal handlers configured")
    except Exception as e:
        logger.warning(f"Could not configure signal handlers: {e}")


if __name__ == "__main__":
    import uvicorn
    
    log_startup_info()
    
    if not validate_startup():
        logger.error("Startup validation failed")
        exit(1)
    
    setup_signal_handlers()
    
    # Import app after configuration
    from api import app
    
    logger.info("Starting uvicorn server...")
    
    # Run with: python src/main.py
    uvicorn.run(
        "api:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG,
        log_level=settings.LOG_LEVEL.lower(),
        access_log=True,
        workers=1,
    )
