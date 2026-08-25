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
  USERS: '/users',
  ROLES: '/settings/roles',
  AUDIT_LOGS: '/audit-logs',
  IT_ADMIN: '/it-admin',
  IT_TICKETS: '/it-admin/tickets',
  IT_TICKET_NEW: '/it-admin/tickets/new',
  IT_TICKET_DETAIL: '/it-admin/tickets/:ticketId',
  IT_ASSETS: '/it-admin/assets',
  IT_SETUP: '/it-admin/setup',
  IT_SOFTWARE: '/it-admin/software',
  IT_CONFIGURATION: '/it-admin/configuration',
  // Sales & Revenue
  SALES: '/sales',
  SALES_OVERVIEW: '/sales/overview',
  SALES_PIPELINE: '/sales/pipeline',
  SALES_INVOICES_COLLECTIONS: '/sales/invoices-collections',

  // System
  UNAUTHORIZED: '/unauthorized',
  SERVER_ERROR: '/server-error',
  MAINTENANCE: '/maintenance',
  NOT_FOUND: '*',
} as const;
