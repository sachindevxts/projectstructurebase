export type RequestStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

export interface AsyncState<T> {
  data: T;
  status: RequestStatus;
  error: ApiError | null;
  initialized: boolean;
}

export interface ApiError {
  status?: number;
  code?: string;
  message: string;
  fieldErrors?: Record<string, string[]>;
  correlationId?: string;
  originalError?: unknown;
}

export interface UserRole {
  id: string;
  name: string;
  permissions: string[];
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
  permissions: string[];
}

export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}
