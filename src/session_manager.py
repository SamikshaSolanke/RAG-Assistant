import threading
from datetime import datetime, timedelta
from typing import Dict, Any, Optional, Tuple
import logging

from utils import is_session_expired

logger = logging.getLogger(__name__)


class SessionNotFoundError(Exception):
    """Raised when a session is not found."""
    pass


class SessionExpiredError(Exception):
    """Raised when a session has expired."""
    pass


class SessionManager:
    """Thread-safe in-memory session manager for FAISS indices and document state."""

    def __init__(self):
        self.sessions: Dict[str, Dict[str, Any]] = {}
        self.lock = threading.Lock()

    def create_session(self, index, chunk_map: dict, file_text: str, filename: str) -> str:
        import uuid
        session_id = uuid.uuid4().hex
        entry = {
            "index": index,
            "chunk_map": chunk_map,
            "file_text": file_text,
            "filename": filename,
            "created_at": datetime.utcnow(),
            "last_accessed_at": datetime.utcnow(),
        }
        with self.lock:
            self.sessions[session_id] = entry
        logger.info("Created session %s for file %s", session_id, filename)
        return session_id

    def get_session(self, session_id: str) -> dict:
        with self.lock:
            entry = self.sessions.get(session_id)
            if not entry:
                raise SessionNotFoundError(f"Session not found: {session_id}")
            
            # Check expiry
            created_at = entry.get("created_at")
            if created_at and is_session_expired(created_at, max_age_hours=24):
                del self.sessions[session_id]
                raise SessionExpiredError(f"Session expired: {session_id}")
            
            # Update last accessed time
            entry["last_accessed_at"] = datetime.utcnow()
            return entry

    def session_exists(self, session_id: str) -> bool:
        with self.lock:
            return session_id in self.sessions

    def delete_session(self, session_id: str):
        with self.lock:
            if session_id in self.sessions:
                filename = self.sessions[session_id].get("filename", "unknown")
                del self.sessions[session_id]
                logger.info("Deleted session %s (file: %s)", session_id, filename)

    def update_session(self, session_id: str, **kwargs):
        """Update session metadata."""
        with self.lock:
            if session_id in self.sessions:
                self.sessions[session_id].update(kwargs)
                self.sessions[session_id]["last_accessed_at"] = datetime.utcnow()

    def get_session_count(self) -> int:
        """Return number of active sessions."""
        with self.lock:
            return len(self.sessions)

    def get_oldest_session_age(self) -> float:
        """Return age in seconds of oldest session, or 0 if no sessions."""
        with self.lock:
            if not self.sessions:
                return 0
            now = datetime.utcnow()
            ages = [
                (now - data.get("created_at")).total_seconds()
                for data in self.sessions.values()
                if data.get("created_at")
            ]
            return max(ages) if ages else 0

    def get_session_stats(self) -> dict:
        """Return comprehensive session statistics."""
        with self.lock:
            count = len(self.sessions)
            ages = [
                (datetime.utcnow() - data.get("created_at")).total_seconds()
                for data in self.sessions.values()
                if data.get("created_at")
            ]
            return {
                "total_active": count,
                "oldest_session_age_seconds": max(ages) if ages else 0,
                "newest_session_age_seconds": min(ages) if ages else 0,
            }

    def validate_session(self, session_id: str) -> Tuple[bool, Optional[str]]:
        """Check if session exists and is not expired.
        
        Returns:
            (is_valid, error_message)
        """
        with self.lock:
            entry = self.sessions.get(session_id)
            if not entry:
                return False, "Session not found"
            
            created_at = entry.get("created_at")
            if created_at and is_session_expired(created_at, max_age_hours=24):
                del self.sessions[session_id]
                return False, "Session has expired"
            
            return True, None

    def cleanup_expired_sessions(self, max_age_hours: int = 24) -> int:
        """Remove expired sessions and return count of deleted sessions."""
        now = datetime.utcnow()
        to_delete = []
        
        with self.lock:
            for sid, data in list(self.sessions.items()):
                created_at = data.get("created_at")
                if created_at and is_session_expired(created_at, max_age_hours):
                    to_delete.append((sid, data))
            
            for sid, data in to_delete:
                del self.sessions[sid]
                filename = data.get("filename", "unknown")
                age_hours = (now - data["created_at"]).total_seconds() / 3600
                logger.debug(f"Cleaned up session {sid} (file: {filename}, age: {age_hours:.1f}h)")
        
        if to_delete:
            logger.info(f"Cleanup: removed {len(to_delete)} expired sessions out of {len(self.sessions) + len(to_delete)} total")
        
        return len(to_delete)

    def get_all_sessions(self) -> dict:
        with self.lock:
            return dict(self.sessions)
