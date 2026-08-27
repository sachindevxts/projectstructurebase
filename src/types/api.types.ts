export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedApiResponse<T> extends ApiResponse<T[]> {
  page: number;
  limit: number;
  totalRecords: number;
  totalPages: number;
  totalItems: number;
}
