import { useMutation, UseMutationResult } from '@tanstack/react-query';
import {
  uploadDocument,
  queryDocument,
  summarizeDocument,
  compareClause,
  analyzeRisks,
  extractClauses,
} from '@/services/api';
import type {
  UploadResponse,
  QueryResponse,
  SummarizeResponse,
  CompareResponse,
  AnalyzeResponse,
} from '@/types/api';
import { useSession } from '@/contexts/SessionContext';
import { useToast } from '@/hooks/use-toast';
import { ApiError } from '@/services/apiClient';

/**
 * Hook for uploading a document and creating a session
 * @returns Mutation object with mutate, isLoading, error, data, etc.
 *
 * @example
 * const { mutate, isLoading, error } = useUploadDocument();
 *
 * const handleUpload = (file: File) => {
 *   mutate(file);
 * };
 */
type UploadInput = File | { file: File; onUploadProgress?: (n: number) => void; signal?: AbortSignal };

export const useUploadDocument = (): UseMutationResult<UploadResponse, ApiError, UploadInput> => {
  const { setSession } = useSession();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (input: UploadInput) => {
      // Support both direct File and an object with progress/signal
      if (input instanceof File) return uploadDocument(input);
      return uploadDocument(input.file, input.onUploadProgress, input.signal);
    },
    onSuccess: (data) => {
      setSession(data.session_id, data.filename, data.chunk_count);
      toast({
        title: 'Success',
        description: `Document uploaded: ${data.filename}`,
      });
    },
    onError: (error) => {
      toast({
        title: 'Upload Failed',
        description: error instanceof ApiError ? error.message : 'Unknown error',
        variant: 'destructive',
      });
    },
  });
};

/**
 * Hook for querying an uploaded document
 * @returns Mutation object with mutate, isLoading, error, data, etc.
 *
 * @example
 * const { mutate, isLoading } = useQueryDocument();
 *
 * const handleQuery = (query: string) => {
 *   mutate({ sessionId, query });
 * };
 */
export const useQueryDocument = (): UseMutationResult<
  QueryResponse,
  ApiError,
  { sessionId: string; query: string }
> => {
  const { sessionId } = useSession();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ sessionId: sid, query }) => {
      if (!sid) {
        throw new Error('No active session. Please upload a document first.');
      }
      return queryDocument(sid, query);
    },
    retry: false,
    onError: (error) => {
      toast({
        title: 'Query Failed',
        description: error instanceof ApiError ? error.message : 'Unknown error',
        variant: 'destructive',
      });
    },
  });
};

/**
 * Hook for summarizing an uploaded document
 * @returns Mutation object with mutate, isLoading, error, data, etc.
 *
 * @example
 * const { mutate, isLoading } = useSummarizeDocument();
 *
 * const handleSummarize = () => {
 *   mutate(sessionId!);
 * };
 */
export const useSummarizeDocument = (): UseMutationResult<SummarizeResponse, ApiError, string> => {
  const { sessionId } = useSession();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (sid: string) => {
      if (!sid) {
        throw new Error('No active session. Please upload a document first.');
      }
      return summarizeDocument(sid);
    },
    retry: false,
    onError: (error) => {
      toast({
        title: 'Summarization Failed',
        description: error instanceof ApiError ? error.message : 'Unknown error',
        variant: 'destructive',
      });
    },
  });
};

/**
 * Hook for comparing a clause with document content
 * @returns Mutation object with mutate, isLoading, error, data, etc.
 *
 * @example
 * const { mutate, isLoading } = useCompareClause();
 *
 * const handleCompare = (clause: string) => {
 *   mutate({ sessionId, clause });
 * };
 */
export const useCompareClause = (): UseMutationResult<
  CompareResponse,
  ApiError,
  { sessionId: string; clause: string }
> => {
  const { sessionId } = useSession();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ sessionId: sid, clause }) => {
      if (!sid) {
        throw new Error('No active session. Please upload a document first.');
      }
      if (!clause?.trim()) {
        throw new Error('Clause cannot be empty.');
      }
      return compareClause(sid, clause);
    },
    retry: false,
    onError: (error) => {
      toast({
        title: 'Comparison Failed',
        description: error instanceof ApiError ? error.message : 'Unknown error',
        variant: 'destructive',
      });
    },
  });
};

/**
 * Hook for analyzing risks in an uploaded document
 * @returns Mutation object with mutate, isLoading, error, data, etc.
 *
 * @example
 * const { mutate, isLoading } = useAnalyzeRisks();
 *
 * const handleAnalyze = (analysisType: string) => {
 *   mutate({ sessionId, analysisType });
 * };
 */
export const useAnalyzeRisks = (): UseMutationResult<
  AnalyzeResponse,
  ApiError,
  { sessionId: string; analysisType?: string }
> => {
  const { sessionId } = useSession();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ sessionId: sid, analysisType = 'risk' }) => {
      if (!sid) {
        throw new Error('No active session. Please upload a document first.');
      }
      return analyzeRisks(sid, analysisType);
    },
    retry: false,
    onError: (error) => {
      toast({
        title: 'Analysis Failed',
        description: error instanceof ApiError ? error.message : 'Unknown error',
        variant: 'destructive',
      });
    },
  });
};

/**
 * Hook for extracting clauses (uses extractClauses helper)
 */
export const useExtractClauses = (): UseMutationResult<
  {
    clauses: Array<{
      clause_text: string;
      clause_type?: string;
      risk_level?: 'safe' | 'moderate' | 'high' | string;
      implications?: string;
      category?: string;
    }>;
    total_clauses: number;
    success: boolean;
  },
  ApiError,
  { sessionId: string }
> => {
  const { sessionId } = useSession();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ sessionId: sid }) => {
      if (!sid) throw new Error('No active session. Please upload a document first.');
      return extractClauses(sid);
    },
    retry: false,
    onError: (error) => {
      toast({
        title: 'Clause Extraction Failed',
        description: error instanceof ApiError ? error.message : 'Unknown error',
        variant: 'destructive',
      });
    },
    onSuccess: () => {
      toast({ title: 'Clauses extracted', description: 'Clauses extracted successfully' });
    },
  });
};
