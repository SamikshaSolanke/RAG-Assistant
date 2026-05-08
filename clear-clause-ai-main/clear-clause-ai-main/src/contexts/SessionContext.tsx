import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

/**
 * Session state interface
 */
interface SessionState {
  sessionId: string | null;
  filename: string | null;
  chunkCount: number | null;
}

/**
 * Session context interface
 */
interface SessionContextType extends SessionState {
  setSession: (sessionId: string, filename: string, chunkCount: number) => void;
  clearSession: () => void;
  isSessionActive: boolean;
}

/**
 * Create the SessionContext
 */
const SessionContext = createContext<SessionContextType | undefined>(undefined);

/**
 * SessionProvider component
 */
export const SessionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [filename, setFilename] = useState<string | null>(null);
  const [chunkCount, setChunkCount] = useState<number | null>(null);

  /**
   * Load session from sessionStorage on mount
   */
  useEffect(() => {
    try {
      const storedSession = sessionStorage.getItem('rag-session');
      if (storedSession) {
        const parsed = JSON.parse(storedSession);
        if (parsed.sessionId && parsed.filename && parsed.chunkCount !== null) {
          setSessionId(parsed.sessionId);
          setFilename(parsed.filename);
          setChunkCount(parsed.chunkCount);
          if (import.meta.env.DEV) {
            console.debug('[SessionContext] Loaded session from storage:', parsed.sessionId);
          }
        }
      }
    } catch (error) {
      console.error('[SessionContext] Failed to load session from storage:', error);
    }
  }, []);

  /**
   * Set session data and persist to sessionStorage
   */
  const handleSetSession = (newSessionId: string, newFilename: string, newChunkCount: number) => {
    setSessionId(newSessionId);
    setFilename(newFilename);
    setChunkCount(newChunkCount);

    const sessionData = {
      sessionId: newSessionId,
      filename: newFilename,
      chunkCount: newChunkCount,
    };
    sessionStorage.setItem('rag-session', JSON.stringify(sessionData));

    if (import.meta.env.DEV) {
      console.debug('[SessionContext] Session set:', newSessionId);
    }
  };

  /**
   * Clear session data from state and sessionStorage
   */
  const handleClearSession = () => {
    setSessionId(null);
    setFilename(null);
    setChunkCount(null);
    sessionStorage.removeItem('rag-session');

    if (import.meta.env.DEV) {
      console.debug('[SessionContext] Session cleared');
    }
  };

  /**
   * Computed property: check if session is active
   */
  const isSessionActive = sessionId !== null;

  const value: SessionContextType = {
    sessionId,
    filename,
    chunkCount,
    setSession: handleSetSession,
    clearSession: handleClearSession,
    isSessionActive,
  };

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
};

/**
 * Custom hook to use SessionContext
 * @throws Error if used outside SessionProvider
 */
export const useSession = (): SessionContextType => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};
