export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  DASHBOARD: '/dashboard',
  
  // People
  EMPLOYEES: '/employees',
  EMPLOYEE_DETAIL: '/employees/:employeeId',
  EMPLOYEE_EDIT: '/employees/:employeeId/edit',
  EMPLOYEE_NEW: '/employees/new',
  BENCH: '/bench',
  
  // Work
  CLIENTS: '/clients',
  PROJECTS: '/projects',
  PROJECT_DETAIL: '/projects/:projectId',
  PROJECT_NEW: '/projects/new',
  ALLOCATIONS: '/allocations',
  ALLOCATION_NEW: '/allocations/new',
  RESOURCE_PLANNER: '/resource-planner',
  
  // Insights
  REPORTS: '/reports',
  REPORTS_EMPLOYEES: '/reports/employees',
  REPORTS_PROJECTS: '/reports/projects',
  REPORTS_ALLOCATIONS: '/reports/allocations',
  
  // Administration
  DEPARTMENTS: '/departments',
  DESIGNATIONS: '/designations',
  SKILLS: '/skills',
  ROLES: '/settings/roles',
  AUDIT_LOGS: '/audit-logs',
  
  // System
  UNAUTHORIZED: '/unauthorized',
  SERVER_ERROR: '/server-error',
  MAINTENANCE: '/maintenance',
  NOT_FOUND: '*',
} as const;