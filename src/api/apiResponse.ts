import type { ApiResponse, PaginatedApiResponse } from '@/types/api.types';

export const createApiResponse = <T>(
  data: T,
  message = 'Request completed successfully',
): ApiResponse<T> => ({
  success: true,
  message,
  data,
});

export const createPaginatedResponse = <T>({
  data,
  page,
  limit,
  totalRecords,
  message = 'Records fetched successfully',
}: {
  data: T[];
  page: number;
  limit: number;
  totalRecords: number;
  message?: string;
}): PaginatedApiResponse<T> => ({
  success: true,
  message,
  data,
  page,
  limit,
  totalRecords,
  totalPages: Math.ceil(totalRecords / limit),
  totalItems: data.length,
});

export const unwrapApiResponse = <T>(response: ApiResponse<T> | T): T => {
  if (response && typeof response === 'object' && 'data' in response) {
    return (response as ApiResponse<T>).data;
  }

  return response as T;
};

export const unwrapPaginatedResponse = <T>(
  response: PaginatedApiResponse<T> | ApiResponse<T[]> | T[],
): T[] => {
  if (Array.isArray(response)) {
    return response;
  }

  return response.data;
};
