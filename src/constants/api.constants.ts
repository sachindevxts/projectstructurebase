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
  EMPLOYEE_LOOKUP: '/employees/lookup',
  DEPARTMENTS: '/departments',
  DEPARTMENT_LOOKUP: '/departments/lookup',
  DESIGNATIONS: '/designations',
  DESIGNATION_LOOKUP: '/designations/lookup',
  PROJECTS: '/projects',
  PROJECT_LOOKUP: '/projects/lookup',
  PROJECT_ALLOCATIONS: '/project-allocations',
  PROJECT_ALLOCATION_LOOKUP: '/project-allocations/lookup',
  AUDIT_LOGS: '/audit-logs',
  IT_ADMIN: {
    DASHBOARD: '/it-admin/dashboard',
    TICKETS: '/it-admin/tickets',
    ASSETS: '/it-admin/assets',
    SETUP_REQUESTS: '/it-admin/setup-requests',
    SOFTWARE_LICENCES: '/it-admin/software-licences',
    CONFIGURATION: '/it-admin/configuration',
  },
  CLIENTS: '/clients',
  SKILLS: '/skills',
  ROLES: '/roles',
  NOTIFICATIONS: '/notifications',
  REPORTS: {
    WORKFORCE: '/reports/workforce',
  },
} as const;
