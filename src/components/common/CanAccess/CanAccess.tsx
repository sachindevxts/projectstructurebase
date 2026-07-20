import type { ReactNode } from 'react';
import { useAppSelector } from '@/hooks/useAppSelector';
import { hasPermission, hasRole, type Permission } from '@/utils/permission.utils';

interface CanAccessProps {
  roles?: string[];
  permissions?: Permission[];
  mode?: 'all' | 'any';
  children: ReactNode;
  fallback?: ReactNode;
}

export function CanAccess({
  roles = [],
  permissions = [],
  mode = 'all',
  children,
  fallback = null,
}: CanAccessProps) {
  const user = useAppSelector((state) => state.auth?.user ?? null);
  const canRole = hasRole(user, roles);
  const canPermission = hasPermission(user, permissions, mode);
  if (!canRole || !canPermission) return <>{fallback}</>;
  return <>{children}</>;
}
