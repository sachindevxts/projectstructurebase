import type { AuthState } from '@/types/auth.types';
import type { ApiError, RequestStatus } from '@/types/common.types';
import type { UserSummary } from '@/types/user.types';
import type { Action, ThunkAction } from '@reduxjs/toolkit';
import type { RootState } from '../reducers/rootReducer';

export interface DashboardState {
  data: { totalProducts: number; totalUsers: number };
  status: RequestStatus;
  error: ApiError | null;
  initialized: boolean;
}

export interface UsersState {
  data: UserSummary[];
  status: RequestStatus;
  error: ApiError | null;
  initialized: boolean;
}

export interface UiState {
  theme: 'light' | 'dark' | 'system';
  sidebarOpen: boolean;
  notifications: Array<{
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
  }>;
}

export interface RootStateShape {
  auth: AuthState;
  dashboard: DashboardState;
  users: UsersState;
  ui: UiState;
}
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
