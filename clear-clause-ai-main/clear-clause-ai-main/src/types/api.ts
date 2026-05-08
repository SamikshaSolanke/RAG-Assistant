/* Types mirroring backend Pydantic models (src/models.py)
   Generated to provide type-safety for API interactions.
*/

export interface QueryRequest {
  session_id: string;
  query: string;
}

export interface SummarizeRequest {
  session_id: string;
}

export interface CompareRequest {
  session_id: string;
  clause: string;
}

export interface AnalyzeRequest {
  session_id: string;
  analysis_type?: string; // default: "risk"
}

export interface RetrievedChunk {
  text: string;
  distance: number;
}

export interface UploadResponse {
  session_id: string;
  filename: string;
  chunk_count: number;
  message: string;
  success: boolean;
}

export interface QueryResponse {
  answer: string;
  retrieved_chunks?: RetrievedChunk[];
  success: boolean;
}

export interface SummarizeResponse {
  summary: string;
  success: boolean;
}

export interface CompareResponse {
  comparison: string;
  success: boolean;
}

export interface AnalyzeResponse {
  analysis: string;
  analysis_type: string;
  success: boolean;
}

export interface ErrorResponse {
  error: string;
  detail?: string;
  success: boolean; // false
}

export type ApiResponse<T> = T;

export class ApiError extends Error {
  public status: number;
  public detail?: string;

  constructor(message: string, status = 500, detail?: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.detail = detail;
  }
}

/**
 * Structured clause extracted from LLM responses
 */
export interface ExtractedClause {
  id: number;
  text: string;
  type: string;
  risk: 'safe' | 'moderate' | 'high';
  explanation: string;
}

/**
 * Aggregated risk metrics returned by analysis endpoint
 */
export interface RiskMetrics {
  riskLevel: number; // overall risk percentage (0-100)
  confidenceScore: number; // AI confidence percentage (0-100)
  totalClauses: number;
  safeClauses: number;
  moderateClauses: number;
  highRiskClauses: number;
}

/**
 * Result of a clause comparison between standard clause and document clause
 */
export interface ComparisonResult {
  standardClause: string;
  documentClause: string;
  deviations: string[];
  severity: 'minor' | 'moderate' | 'major';
}

export { };
