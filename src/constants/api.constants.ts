export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    ME: '/auth/me',
  },
  DASHBOARD: {
    SUMMARY: '/dashboard/summary',
    WIDGETS: '/dashboard/widgets',
  },
  USERS: {
    LIST: '/users',
  },
  EMPLOYEES: '/employees',
  DEPARTMENTS: '/departments',
  DESIGNATIONS: '/designations',
  PROJECTS: '/projects',
  PROJECT_ALLOCATIONS: '/project-allocations',
  AUDIT_LOGS: '/audit-logs',
  CLIENTS: '/clients',
  SKILLS: '/skills',
  ROLES: '/roles',
  REPORTS: {
    WORKFORCE: '/reports/workforce',
  },
} as const;
