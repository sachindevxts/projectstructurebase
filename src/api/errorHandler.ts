import type { AxiosError } from 'axios';
import type { ApiError } from '@/types/common.types';

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
