import { Navigate } from 'react-router-dom';
import { useAppSelector } from '@/hooks/useAppSelector';
import { ROUTES } from '@/constants';
import { hasPermission, type Permission } from '@/utils/permission.utils';

interface PermissionRouteProps {
  children: React.ReactNode;
  permissions: Permission[];
  mode?: 'all' | 'any';
}

export function PermissionRoute({ children, permissions, mode = 'all' }: PermissionRouteProps) {
  const user = useAppSelector((state :any) => state.auth.user);
  const isAuthenticated = useAppSelector((state :any) => state.auth.isAuthenticated);

  if (!isAuthenticated || !user) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (!hasPermission(user, permissions, mode)) {
    return <Navigate to={ROUTES.UNAUTHORIZED} replace />;
  }

  return <>{children}</>;
}

