import { API_ENDPOINTS } from '@/constants/api.constants';
import { api } from '@/api/client/apiClient';
import { STORAGE_KEYS } from '@/constants/storage.constants';
import type { AuthUser } from '@/types/common.types';
import type { LoginPayload } from '@/types/auth.types';
import { storage } from '@/utils/storage.utils';

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

interface ApiEnvelope<T> {
  data: T;
}

interface AccessTokenPayload {
  sub: string;
  email: string;
  role: 'ADMIN' | 'HR' | 'MANAGER' | 'EMPLOYEE';
  roleId?: string | null;
  roleName?: string;
  permissions?: string[];
}

const ROLE_LABELS: Record<AccessTokenPayload['role'], string> = {
  ADMIN: 'Super Admin',
  HR: 'hr',
  MANAGER: 'manager',
  EMPLOYEE: 'employee',
};

function decodeAccessToken(token: string): AccessTokenPayload {
  const payload = token.split('.')[1];
  if (!payload) {
    throw new Error('Invalid access token');
  }

  const normalizedPayload = payload.replace(/-/g, '+').replace(/_/g, '/');
  const decoded = JSON.parse(window.atob(normalizedPayload)) as AccessTokenPayload;

  if (!decoded.sub || !decoded.email || !decoded.role) {
    throw new Error('Invalid access token payload');
  }

  return decoded;
}

function toDisplayName(email: string): string {
  return email
    .split('@')[0]
    .split(/[._-]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

async function login(payload: LoginPayload): Promise<AuthUser> {
  const response = await api.post<ApiEnvelope<AuthResponse>>(API_ENDPOINTS.AUTH.LOGIN, {
    email: payload.email.trim().toLowerCase(),
    password: payload.password,
  });

  const { accessToken, refreshToken } = response.data.data;
  const tokenPayload = decodeAccessToken(accessToken);
  const user: AuthUser = {
    id: tokenPayload.sub,
    email: tokenPayload.email,
    name: toDisplayName(tokenPayload.email),
    role: tokenPayload.roleName ?? ROLE_LABELS[tokenPayload.role],
    roleId: tokenPayload.roleId ?? null,
    permissions: tokenPayload.permissions ?? [],
  };

  storage.set(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
  storage.set(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
  storage.set(STORAGE_KEYS.USER, user);

  return user;
}

async function getCurrentUser(): Promise<AuthUser | null> {
  const token = storage.get<string>(STORAGE_KEYS.ACCESS_TOKEN, '');
  const user = storage.get<AuthUser>(STORAGE_KEYS.USER);
  return token && user ? user : null;
}

async function logout(): Promise<void> {
  try {
    await api.post('/auth/logout');
  } finally {
    storage.remove(STORAGE_KEYS.ACCESS_TOKEN);
    storage.remove(STORAGE_KEYS.REFRESH_TOKEN);
    storage.remove(STORAGE_KEYS.USER);
  }
}

function isAuthenticated(): boolean {
  return !!storage.get<string>(STORAGE_KEYS.ACCESS_TOKEN, '');
}

export const authService = {
  login,
  getCurrentUser,
  logout,
  isAuthenticated,
};
