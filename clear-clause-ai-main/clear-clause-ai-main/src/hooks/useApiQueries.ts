import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { healthCheck } from '@/services/api';
import { useSession } from '@/contexts/SessionContext';
import { ApiError } from '@/services/apiClient';

/**
 * Hook for checking backend health status
 * @returns Query object with data, isLoading, error, refetch, etc.
 *
 * Automatically refetches every 30 seconds for continuous monitoring.
 * Retries up to 3 times with exponential backoff.
 *
 * @example
 * const { data, isLoading, error } = useHealthCheck();
 *
 * if (isLoading) return <div>Checking health...</div>;
 * if (error) return <div>Backend unavailable</div>;
 *
 * return <div>Status: {data?.status}</div>;
 */
export const useHealthCheck = (): UseQueryResult<{ status: string }, ApiError> => {
  return useQuery({
    queryKey: ['health'],
    queryFn: () => healthCheck(),
    refetchInterval: 30000, // Refetch every 30 seconds
    retry: 3,
    staleTime: 10000, // Data is fresh for 10 seconds
  });
};

/**
 * Hook for checking if the current session is still valid
 * @returns Query object with data, isLoading, error, refetch, etc.
 *
 * Only enabled when a sessionId exists. Refetches every minute.
 * Useful for detecting if a session has expired on the backend.
 *
 * @example
 * const { data, isLoading } = useSessionStatus();
 *
 * if (data?.status === 'expired') {
 *   clearSession();
 * }
 */
export const useSessionStatus = (): UseQueryResult<{ status: string }, ApiError> => {
  const { sessionId } = useSession();

  return useQuery({
    queryKey: ['session-status', sessionId],
    queryFn: () => healthCheck(),
    enabled: sessionId !== null, // Only run when session exists
    refetchInterval: 60000, // Refetch every minute
    retry: 2,
    staleTime: 30000, // Data is fresh for 30 seconds
  });
};
