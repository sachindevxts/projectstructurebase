import type { AppRoute } from '@/types/route.types';
import { ROUTES, USER_ROLES, PERMISSIONS } from '@/constants';
import { lazy } from 'react';
import { AppLayout } from '@/components/layout/AppLayout/AppLayout';
import { AuthLayout } from '@/components/layout/AuthLayout/AuthLayout';
import { PublicLayout } from '@/components/layout/PublicLayout/PublicLayout';

const LoginPage = lazy(() => import('@/features/auth/pages/LoginPage'));
const DashboardPage = lazy(() => import('@/features/dashboard/pages/DashboardPage'));
const UsersPage = lazy(() => import('@/features/users/pages/UsersPage'));
const UnauthorizedPage = lazy(() => import('@/pages/Unauthorized/UnauthorizedPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFound/NotFoundPage'));
const ServerErrorPage = lazy(() => import('@/pages/ServerError/ServerErrorPage'));
const MaintenancePage = lazy(() => import('@/pages/Maintenance/MaintenancePage'));

export const SIDEBAR_ITEMS: Array<{
  id: string;
  title: string;
  path: string;
  roles: string[];
  permissions: string[];
}> = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    path: ROUTES.DASHBOARD,
    roles: [USER_ROLES.ADMIN, USER_ROLES.MANAGER, USER_ROLES.USER],
    permissions: [PERMISSIONS.DASHBOARD_VIEW],
  },
  {
    id: 'users',
    title: 'Users',
    path: ROUTES.USERS,
    roles: [USER_ROLES.ADMIN, USER_ROLES.MANAGER],
    permissions: [PERMISSIONS.USER_VIEW],
  },
];

export const routeConfig: AppRoute[] = [
  {
    path: ROUTES.LOGIN,
    element: <LoginPage />,
    layout: 'auth',
  },
  {
    path: ROUTES.HOME,
    element: <DashboardPage />,
    layout: 'app',
    isProtected: true,
  },
  {
    path: ROUTES.DASHBOARD,
    element: <DashboardPage />,
    layout: 'app',
    isProtected: true,
    requiredPermissions: [PERMISSIONS.DASHBOARD_VIEW],
  },
  {
    path: ROUTES.USERS,
    element: <UsersPage />,
    layout: 'app',
    isProtected: true,
    allowedRoles: [USER_ROLES.ADMIN, USER_ROLES.MANAGER],
    requiredPermissions: [PERMISSIONS.USER_VIEW],
  },
  {
    path: ROUTES.UNAUTHORIZED,
    element: <UnauthorizedPage />,
    layout: 'public',
  },
  {
    path: ROUTES.SERVER_ERROR,
    element: <ServerErrorPage />,
    layout: 'public',
  },
  {
    path: ROUTES.NOT_FOUND,
    element: <NotFoundPage />,
    layout: 'none',
  },
  {
    path: '/maintenance',
    element: <MaintenancePage />,
    layout: 'public',
  },
];

export function getRouteLayout(layout: AppRoute['layout']) {
  switch (layout) {
    case 'app':
      return AppLayout;
    case 'auth':
      return AuthLayout;
    case 'public':
      return PublicLayout;
    default:
      return ({ children }: { children: React.ReactNode }) => <>{children}</>;
  }
}
