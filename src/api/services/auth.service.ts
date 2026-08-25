import { API_ENDPOINTS } from '@/constants/api.constants';
import { api } from '@/api/client/apiClient';
import { STORAGE_KEYS } from '@/constants/storage.constants';
import { clearAuthSession, storeAuthSession, type AuthTokens } from '@/api/authToken';
import type { AuthUser } from '@/types/common.types';
import type { LoginPayload } from '@/types/auth.types';
import { storage } from '@/utils/storage.utils';

interface ApiEnvelope<T> {
  data: T;
}

async function login(payload: LoginPayload): Promise<AuthUser> {
  const response = await api.post<ApiEnvelope<AuthTokens>>(API_ENDPOINTS.AUTH.LOGIN, {
    email: payload.email.trim().toLowerCase(),
    password: payload.password,
  });

  return storeAuthSession(response.data.data);
}

async function refresh(refreshToken: string): Promise<AuthUser> {
  const response = await api.post<ApiEnvelope<AuthTokens>>(API_ENDPOINTS.AUTH.REFRESH, {
    refreshToken,
  });
  return storeAuthSession(response.data.data);
}

async function getCurrentUser(): Promise<AuthUser | null> {
  const token = storage.get<string>(STORAGE_KEYS.ACCESS_TOKEN, '');
  const user = storage.get<AuthUser>(STORAGE_KEYS.USER);
  return token && user ? user : null;
}

async function logout(): Promise<void> {
  try {
    await api.post(API_ENDPOINTS.AUTH.LOGOUT);
  } finally {
    clearAuthSession();
  }
}

function isAuthenticated(): boolean {
  return !!storage.get<string>(STORAGE_KEYS.ACCESS_TOKEN, '');
}

export const authService = {
  login,
  refresh,
  getCurrentUser,
  logout,
  isAuthenticated,
};
