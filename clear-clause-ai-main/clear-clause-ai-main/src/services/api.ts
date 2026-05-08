import { apiClient, ApiError } from './apiClient';
import type {
  UploadResponse,
  QueryResponse,
  SummarizeResponse,
  CompareResponse,
  AnalyzeResponse,
} from '@/types/api';

/**
 * Upload a document file and create a processing session.
 *
 * @param file - File to upload (PDF, DOCX, or TXT)
 * @param onUploadProgress - Optional callback to track upload progress (0-100)
 * @param signal - Optional AbortSignal for request cancellation
 * @returns Promise with UploadResponse containing session_id, filename, and chunk_count
 * @throws ApiError if upload fails
 *
 * @example
 * try {
 *   const response = await uploadDocument(file, (progress) => {
 *     console.log(`Upload progress: ${progress}%`);
 *   });
 *   console.log(`Session created: ${response.session_id}`);
 * } catch (error) {
 *   console.error('Upload failed:', error.message);
 * }
 */
export async function uploadDocument(
  file: File,
  onUploadProgress?: (progress: number) => void,
  signal?: AbortSignal
): Promise<UploadResponse> {
  // Validate file
  if (!file) {
    throw new Error('File is required');
  }

  const maxSizeMb = Number(import.meta.env.VITE_MAX_UPLOAD_SIZE_MB || 10);
  const maxSizeBytes = maxSizeMb * 1024 * 1024;

  if (file.size > maxSizeBytes) {
    throw new Error(`File size exceeds ${maxSizeMb}MB limit`);
  }

  const form = new FormData();
  form.append('file', file);

  const resp = await apiClient.post<UploadResponse>('/api/upload', form, {
    // Do NOT set Content-Type manually — let the browser/axios set the
    // correct multipart boundary. Setting it manually causes 422 errors.
    // Ensure we don't send the instance default JSON Content-Type header
    // so that the browser can set the multipart boundary automatically.
    headers: { 'Content-Type': undefined as unknown as string },
    onUploadProgress: (progressEvent) => {
      if (onUploadProgress && progressEvent.total) {
        const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
        onUploadProgress(progress);
      }
    },
    signal,
  });

  return resp.data;
}

/**
 * Query the uploaded document session with a question.
 *
 * @param sessionId - Session ID from uploadDocument response
 * @param query - Question to ask about the document (max 1000 chars)
 * @param signal - Optional AbortSignal for request cancellation
 * @returns Promise with QueryResponse containing answer and retrieved_chunks
 * @throws ApiError if query fails
 *
 * @example
 * try {
 *   const response = await queryDocument(sessionId, 'What is the payment term?');
 *   console.log('Answer:', response.answer);
 * } catch (error) {
 *   console.error('Query failed:', error.message);
 * }
 */
export async function queryDocument(
  sessionId: string,
  query: string,
  signal?: AbortSignal
): Promise<QueryResponse> {
  // Validate inputs
  if (!sessionId?.trim()) {
    throw new Error('Session ID is required');
  }
  if (!query?.trim()) {
    throw new Error('Query cannot be empty');
  }
  if (query.length > 1000) {
    throw new Error('Query exceeds 1000 character limit');
  }

  const resp = await apiClient.post<QueryResponse>(
    '/api/query',
    { session_id: sessionId, query },
    { signal }
  );

  return resp.data;
}

/**
 * Generate a summary of the uploaded document.
 *
 * @param sessionId - Session ID from uploadDocument response
 * @param signal - Optional AbortSignal for request cancellation
 * @returns Promise with SummarizeResponse containing summary text
 * @throws ApiError if summarization fails
 *
 * @example
 * try {
 *   const response = await summarizeDocument(sessionId);
 *   console.log('Summary:', response.summary);
 * } catch (error) {
 *   console.error('Summarization failed:', error.message);
 * }
 */
export async function summarizeDocument(
  sessionId: string,
  signal?: AbortSignal
): Promise<SummarizeResponse> {
  // Validate input
  if (!sessionId?.trim()) {
    throw new Error('Session ID is required');
  }

  const resp = await apiClient.post<SummarizeResponse>(
    '/api/summarize',
    { session_id: sessionId },
    { signal }
  );

  return resp.data;
}

/**
 * Compare a clause with the uploaded document content.
 *
 * @param sessionId - Session ID from uploadDocument response
 * @param clause - Clause text to compare (max 5000 chars)
 * @param signal - Optional AbortSignal for request cancellation
 * @returns Promise with CompareResponse containing analysis results
 * @throws ApiError if comparison fails
 *
 * @example
 * try {
 *   const response = await compareClause(sessionId, 'Payment due within 30 days');
 *   console.log('Comparison:', response.analysis);
 * } catch (error) {
 *   console.error('Comparison failed:', error.message);
 * }
 */
export async function compareClause(
  sessionId: string,
  clause: string,
  signal?: AbortSignal
): Promise<CompareResponse> {
  // Validate inputs
  if (!sessionId?.trim()) {
    throw new Error('Session ID is required');
  }
  if (!clause?.trim()) {
    throw new Error('Clause cannot be empty');
  }
  if (clause.length > 5000) {
    throw new Error('Clause exceeds 5000 character limit');
  }

  const resp = await apiClient.post<CompareResponse>(
    '/api/compare',
    { session_id: sessionId, clause },
    { signal }
  );

  return resp.data;
}

/**
 * Analyze risks in the uploaded document.
 *
 * @param sessionId - Session ID from uploadDocument response
 * @param analysisType - Type of analysis: 'risk', 'compliance', or 'legal' (default: 'risk')
 * @param signal - Optional AbortSignal for request cancellation
 * @returns Promise with AnalyzeResponse containing risk analysis results
 * @throws ApiError if analysis fails
 *
 * @example
 * try {
 *   const response = await analyzeRisks(sessionId, 'risk');
 *   console.log('Risks found:', response.risks);
 * } catch (error) {
 *   console.error('Analysis failed:', error.message);
 * }
 */
export async function analyzeRisks(
  sessionId: string,
  analysisType = 'risk',
  signal?: AbortSignal
): Promise<AnalyzeResponse> {
  // Validate inputs
  if (!sessionId?.trim()) {
    throw new Error('Session ID is required');
  }

  const resp = await apiClient.post<AnalyzeResponse>(
    '/api/analyze',
    { session_id: sessionId, analysis_type: analysisType },
    { signal }
  );

  return resp.data;
}

/**
 * Extract clauses from the document using a consistent prompt.
 * This helper calls `queryDocument` with a predefined extraction prompt
 * and returns the raw QueryResponse which should contain structured clauses.
 *
 * @param sessionId - active session id
 * @param signal - optional AbortSignal
 */
/**
 * Extract structured clauses from an uploaded document.
 *
 * @param sessionId - Session ID of the uploaded document
 * @param signal - Optional AbortSignal for request cancellation
 * @returns Promise with extracted clauses
 * @throws ApiError if extraction fails
 *
 * @example
 * try {
 *   const response = await extractClauses('abc123');
 *   console.log('Clauses:', response.clauses);
 * } catch (error) {
 *   console.error('Extraction failed:', error.message);
 * }
 */
export async function extractClauses(
  sessionId: string,
  signal?: AbortSignal
) {
  if (!sessionId?.trim()) {
    throw new Error('Session ID is required');
  }

  const resp = await apiClient.post<{
    clauses: Array<{
      clause_text: string;
      clause_type?: string;
      risk_level?: 'safe' | 'moderate' | 'high' | string;
      implications?: string;
      category?: string;
    }>;
    total_clauses: number;
    success: boolean;
  }>(`/api/extract-clauses`, { session_id: sessionId }, { signal, timeout: 180000 });

  return resp.data;
}

/**
 * Check the health status of the backend API.
 *
 * @param signal - Optional AbortSignal for request cancellation
 * @returns Promise with health status information
 * @throws ApiError if health check fails
 *
 * @example
 * try {
 *   const response = await healthCheck();
 *   console.log('Backend status:', response.status);
 * } catch (error) {
 *   console.error('Backend unavailable:', error.message);
 * }
 */
export async function healthCheck(signal?: AbortSignal): Promise<{ status: string }> {
  const resp = await apiClient.get<{ status: string }>('/api/health', { signal });
  return resp.data;
}

export default {
  uploadDocument,
  queryDocument,
  summarizeDocument,
  compareClause,
  analyzeRisks,
  extractClauses,
  healthCheck,
};
