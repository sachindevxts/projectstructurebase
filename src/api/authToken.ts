import { STORAGE_KEYS } from '@/constants/storage.constants';
import type { AuthUser } from '@/types/common.types';
import { storage } from '@/utils/storage.utils';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
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
  const paddedPayload = normalizedPayload.padEnd(
    Math.ceil(normalizedPayload.length / 4) * 4,
    '=',
  );
  const decoded = JSON.parse(globalThis.atob(paddedPayload)) as AccessTokenPayload;

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

export function buildAuthUserFromToken(token: string): AuthUser {
  const tokenPayload = decodeAccessToken(token);

  return {
    id: tokenPayload.sub,
    email: tokenPayload.email,
    name: toDisplayName(tokenPayload.email),
    role: tokenPayload.roleName ?? ROLE_LABELS[tokenPayload.role],
    roleId: tokenPayload.roleId ?? null,
    permissions: tokenPayload.permissions ?? [],
  };
}

export function storeAuthSession(tokens: AuthTokens): AuthUser {
  const user = buildAuthUserFromToken(tokens.accessToken);
  storage.set(STORAGE_KEYS.ACCESS_TOKEN, tokens.accessToken);
  storage.set(STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken);
  storage.set(STORAGE_KEYS.USER, user);
  return user;
}

export function clearAuthSession(): void {
  storage.remove(STORAGE_KEYS.ACCESS_TOKEN);
  storage.remove(STORAGE_KEYS.REFRESH_TOKEN);
  storage.remove(STORAGE_KEYS.USER);
}
