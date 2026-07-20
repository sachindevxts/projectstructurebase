import type { ReactNode } from 'react';
import type { Permission } from '@/utils/permission.utils';
import type { UserRole } from './common.types';

export interface AppRoute {
  path: string;
  element: ReactNode;
  layout: 'app' | 'auth' | 'public' | 'none';
  isProtected?: boolean;
  allowedRoles?: UserRole['name'][];
  requiredPermissions?: Permission[];
}
