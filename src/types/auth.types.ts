export interface LoginPayload {
  email: string;
  password: string;
}

import type { AuthUser } from './common.types';
import type { ApiError } from './common.types';

export interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  initialized: boolean;
  error: ApiError | null;
}
