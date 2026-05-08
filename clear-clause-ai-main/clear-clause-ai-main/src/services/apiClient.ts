import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { ApiError } from '@/types/api';

const BASE_URL = (import.meta.env.VITE_API_BASE_URL as string) || 'http://localhost:8000';
const TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT || 60000);

const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  validateStatus: (status) => status >= 200 && status < 300,
});

/**
 * Interface for enhanced axios config with retry tracking
 */
interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  'retry-count'?: number;
}

/**
 * Generate a unique request ID for tracing
 */
const generateRequestId = (): string => {
  return `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Create a cancel token for request cancellation
 */
export const createCancelToken = () => {
  return new axios.CancelToken((cancel) => cancel);
};

/**
 * Retry logic with exponential backoff
 */
const MAX_RETRIES = 3;
const RETRY_DELAY_BASE = 1000; // 1 second

const shouldRetry = (error: AxiosError): boolean => {
  if (!error.response) {
    // Network error
    const code = error.code;
    return code === 'ECONNABORTED' || code === 'ETIMEDOUT' || code === 'ENOTFOUND';
  }

  const status = error.response.status;
  // Don't retry 4xx client errors
  if (status >= 400 && status < 500) {
    return false;
  }
  // Retry 5xx server errors
  return status >= 500;
};

const getRetryDelay = (retryCount: number): number => {
  return RETRY_DELAY_BASE * Math.pow(2, retryCount);
};

/**
 * Request interceptor: Add request ID and logging
 */
apiClient.interceptors.request.use((config) => {
  const extendedConfig = config as ExtendedAxiosRequestConfig;

  // Initialize retry count if not set
  if (!extendedConfig['retry-count']) {
    extendedConfig['retry-count'] = 0;
  }

  // Generate and add request ID
  const requestId = generateRequestId();
  extendedConfig.headers['X-Request-ID'] = requestId;

  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.debug(
      `[api] ${config.method?.toUpperCase()} ${config.url} (${requestId})`
    );
  }

  return config;
});

/**
 * Response interceptor: Handle errors with retry logic
 */
apiClient.interceptors.response.use(
  (res) => res,
  async (err: AxiosError) => {
    const config = err.config as ExtendedAxiosRequestConfig;

    // Check if we should retry
    if (shouldRetry(err) && config && (config['retry-count'] ?? 0) < MAX_RETRIES) {
      config['retry-count'] = (config['retry-count'] ?? 0) + 1;

      const delay = getRetryDelay(config['retry-count'] - 1);
      const requestId = config.headers['X-Request-ID'];

      if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.debug(
          `[api] Retry attempt ${config['retry-count']}/${MAX_RETRIES} after ${delay}ms (${requestId})`
        );
      }

      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, delay));

      // Retry the request
      return apiClient(config);
    }

    // Transform error into ApiError
    if (err.response) {
      const status = err.response.status;
      const data = err.response.data as any;
      const message = data?.detail || data?.error || err.message || 'API Error';
      const detail = data?.detail || JSON.stringify(data);
      throw new ApiError(message, status, detail);
    }

    // Network or timeout error
    if (err.code === 'ECONNABORTED' || err.code === 'ETIMEDOUT') {
      throw new ApiError('Request timeout. The server took too long to respond.', 0, err.code);
    }

    throw new ApiError(
      err.message || 'Network error. Unable to reach the server.',
      0,
      err.code
    );
  }
);

export { apiClient };
export { ApiError };
