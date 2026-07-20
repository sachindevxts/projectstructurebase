import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '@/hooks/useAppSelector';
import { ROUTES } from '@/constants';
import { PageSkeleton } from '@/components/common/Skeleton/PageSkeleton';
import { hasPermission, hasRole } from '@/utils/permission.utils';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  requiredPermissions?: string[];
  permissionMode?: 'all' | 'any';
}

export function ProtectedRoute({
  children,
  allowedRoles = [],
  requiredPermissions = [],
  permissionMode = 'all',
}: ProtectedRouteProps) {
  const user = useAppSelector((state) => state.auth.user);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const isLoading = useAppSelector((state) => state.auth.isLoading);
  const location = useLocation();

  if (isLoading) {
    return <PageSkeleton />;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  if (allowedRoles.length && !hasRole(user, allowedRoles)) {
    return <Navigate to={ROUTES.UNAUTHORIZED} replace />;
  }

  if (requiredPermissions.length && !hasPermission(user, requiredPermissions, permissionMode)) {
    return <Navigate to={ROUTES.UNAUTHORIZED} replace />;
  }

  return <>{children}</>;
}
