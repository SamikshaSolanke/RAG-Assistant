from pydantic_settings import BaseSettings
from pydantic import validator
from typing import List
from dotenv import load_dotenv

load_dotenv()


class Settings(BaseSettings):
    """Application configuration loaded from environment variables."""

    # Required settings
    GEMINI_API_KEY: str

    # File upload settings
    MAX_FILE_SIZE_MB: int = 20
    ALLOWED_FILE_TYPES: List[str] = ["pdf", "png", "jpg", "jpeg", "docx", "txt", "tiff", "bmp"]

    # RAG / Chunking settings
    CHUNK_SIZE: int = 500
    CHUNK_OVERLAP: int = 50
    TOP_K_RESULTS: int = 3

    # Session management
    SESSION_MAX_AGE_HOURS: int = 24
    SESSION_CLEANUP_INTERVAL_MINUTES: int = 60

    # Embedding and LLM models
    EMBEDDING_MODEL: str = "text-embedding-004"   # Best Gemini embedding model

    # ⭐ Latest working Gemini 2.5 Flash model
    LLM_MODEL: str = "gemini-2.5-flash"

    # API configuration
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://localhost:8080"
    ]
    FRONTEND_URL: str = "http://localhost:5173"
    API_PREFIX: str = "/api"
    DEBUG: bool = False
    ENABLE_API_DOCS: bool = True

    # Logging configuration
    LOG_LEVEL: str = "INFO"
    LOG_FILE: str = "logs/api.log"

    class Config:
        env_file = ".env"

    @validator("GEMINI_API_KEY")
    def validate_api_key(cls, v):
        if not v or v.strip() == "":
            raise ValueError("GEMINI_API_KEY must be set to a non-empty value")
        return v

    @validator("MAX_FILE_SIZE_MB")
    def validate_max_file_size(cls, v):
        if v < 1 or v > 100:
            raise ValueError("MAX_FILE_SIZE_MB must be between 1 and 100")
        return v

    @validator("CORS_ORIGINS", pre=True)
    def parse_cors_origins(cls, v):
        if isinstance(v, str):
            return [origin.strip() for origin in v.split(",")]
        return v

    @validator("LOG_LEVEL")
    def validate_log_level(cls, v):
        valid_levels = ["DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL"]
        if v.upper() not in valid_levels:
            raise ValueError(f"LOG_LEVEL must be one of {valid_levels}")
        return v.upper()


settings = Settings()
