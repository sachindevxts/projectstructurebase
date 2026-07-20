export interface LoginPayload {
  email: string;
  password: string;
}

import type { AuthUser } from './common.types';

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
