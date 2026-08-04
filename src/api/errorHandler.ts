import type { AxiosError } from 'axios';

export interface ApiError {
  status?: number;
  code?: string;
  message: string;
  fieldErrors?: Record<string, string[]>;
  correlationId?: string;
  originalError?: unknown;
}

export const normalizeApiError = (error: AxiosError | unknown): ApiError => {
  if (error && typeof error === 'object' && 'isAxiosError' in error) {
    const axiosError = error as AxiosError<{ message?: string; errors?: Record<string, string[]> }>;
    return {
      status: axiosError.response?.status,
      code: axiosError.code,
      message: axiosError.response?.data?.message ?? axiosError.message ?? 'Request failed',
      fieldErrors: axiosError.response?.data?.errors,
      correlationId: axiosError.response?.headers?.['x-request-id'] as string | undefined,
      originalError: error,
    };
  }

  return {
    message: 'Request failed',
    originalError: error,
  };
};

export const isApiError = (error: unknown): error is ApiError => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as ApiError).message === 'string'
  );
};

export const getErrorMessage = (error: unknown): string => {
  if (isApiError(error)) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
};