import type { AuthUser } from '@/types/common.types';

export type Permission = string;

export function hasPermission(
  user: AuthUser | null,
  requiredPermissions: Permission[] = [],
  mode: 'all' | 'any' = 'all',
): boolean {
  if (!user) return false;
  if (!requiredPermissions.length) return true;
  const userPermissions = new Set(user.permissions ?? []);
  if (mode === 'any') {
    return requiredPermissions.some((permission) => userPermissions.has(permission));
  }
  return requiredPermissions.every((permission) => userPermissions.has(permission));
}

export function hasRole(user: AuthUser | null, allowedRoles: string[] = []): boolean {
  if (!user) return false;
  if (!allowedRoles.length) return true;
  return allowedRoles.includes(user.role);
}
