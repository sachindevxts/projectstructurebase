export interface ApiEnvelope<T> {
  success: boolean;
  message?: string;
  data: T;
  timestamp?: string;
  path?: string;
}

export interface PaginatedEnvelope<T> {
  success: boolean;
  message?: string;
  data: T[];
  page: number;
  limit: number;
  totalRecords: number;
  totalPages: number;
  totalItems: number;
  timestamp?: string;
  path?: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  totalRecords: number;
  totalPages: number;
  totalItems: number;
}

export function unwrapApiData<T>(response: ApiEnvelope<T> | T): T {
  if (response && typeof response === 'object' && 'data' in response && 'success' in response) {
    return (response as ApiEnvelope<T>).data;
  }

  return response as T;
}

export function unwrapPaginatedApiData<T>(
  response: PaginatedEnvelope<T>,
): { data: T[]; pagination: PaginationMeta } {
  return {
    data: response.data,
    pagination: {
      page: response.page,
      limit: response.limit,
      totalRecords: response.totalRecords,
      totalPages: response.totalPages,
      totalItems: response.totalItems,
    },
  };
}
