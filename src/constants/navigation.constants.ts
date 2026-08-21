import { ROUTES } from './route.constants';

export const NAVIGATION_LABELS = {
  APP_NAME: 'PeopleFlow HR',
  COMPANY: 'Acme Corp',

  // Sections
  MAIN: 'MAIN',
  PEOPLE: 'PEOPLE',
  WORK: 'WORK',
  INSIGHTS: 'INSIGHTS',
  IT: 'IT',
  ADMINISTRATION: 'ADMINISTRATION',

  // Navigation Items
  DASHBOARD: 'Dashboard',
  EMPLOYEES: 'Employees',
  BENCH: 'Bench & Availability',
  CLIENTS: 'Clients',
  PROJECTS: 'Projects',
  ALLOCATIONS: 'Resource Allocations',
  PLANNER: 'Resource Planner',
  REPORTS: 'Reports',
  IT_ADMIN: 'IT Dashboard',
  IT_TICKETS: 'IT Tickets',
  IT_ASSETS: 'IT Assets',
  IT_SETUP: 'System Setup',
  IT_SOFTWARE: 'Software Licences',
  IT_CONFIGURATION: 'IT Configuration',
  // Sales & Revenue
  SALES_REVENUE: 'Sales & Revenue',
  SALES_OVERVIEW: 'Executive overview',
  SALES_PIPELINE: 'Sales pipeline',
  SALES_INVOICES: 'Invoices',
  DEPARTMENTS: 'Departments',
  DESIGNATIONS: 'Designations',
  SKILLS: 'Skills',
  ROLES: 'Roles & Permissions',
  AUDIT_LOGS: 'Audit Logs',

  // Actions
  CLOSE_MENU: 'Close navigation menu',
  OPEN_MENU: 'Open navigation menu',
} as const;

export const SIDEBAR_ITEMS = [
  {
    section: NAVIGATION_LABELS.MAIN,
    items: [['dashboard', NAVIGATION_LABELS.DASHBOARD, ROUTES.DASHBOARD]],
  },
  {
    section: NAVIGATION_LABELS.PEOPLE,
    items: [
      ['employees', NAVIGATION_LABELS.EMPLOYEES, ROUTES.EMPLOYEES],
      ['bench', NAVIGATION_LABELS.BENCH, ROUTES.BENCH],
    ],
  },
  {
    section: NAVIGATION_LABELS.WORK,
    items: [
      ['clients', NAVIGATION_LABELS.CLIENTS, ROUTES.CLIENTS],
      ['projects', NAVIGATION_LABELS.PROJECTS, ROUTES.PROJECTS],
      ['allocations', NAVIGATION_LABELS.ALLOCATIONS, ROUTES.ALLOCATIONS],
      ['planner', NAVIGATION_LABELS.PLANNER, ROUTES.RESOURCE_PLANNER],
    ],
  },
  {
    section: NAVIGATION_LABELS.INSIGHTS,
    items: [['reports', NAVIGATION_LABELS.REPORTS, ROUTES.REPORTS]],
  },
  {
    section: NAVIGATION_LABELS.SALES_REVENUE,
    items: [
      ['sales-overview', NAVIGATION_LABELS.SALES_OVERVIEW, ROUTES.SALES_OVERVIEW],
      ['sales-pipeline', NAVIGATION_LABELS.SALES_PIPELINE, ROUTES.SALES_PIPELINE],
      ['invoices', NAVIGATION_LABELS.SALES_INVOICES, ROUTES.SALES_INVOICES],
    ],
  },
  {
    section: NAVIGATION_LABELS.IT,
    items: [
      ['it-admin', NAVIGATION_LABELS.IT_ADMIN, ROUTES.IT_ADMIN],
      ['it-tickets', NAVIGATION_LABELS.IT_TICKETS, ROUTES.IT_TICKETS],
      ['it-assets', NAVIGATION_LABELS.IT_ASSETS, ROUTES.IT_ASSETS],
      ['it-setup', NAVIGATION_LABELS.IT_SETUP, ROUTES.IT_SETUP],
      ['it-software', NAVIGATION_LABELS.IT_SOFTWARE, ROUTES.IT_SOFTWARE],
      ['it-config', NAVIGATION_LABELS.IT_CONFIGURATION, ROUTES.IT_CONFIGURATION],
    ],
  },
  {
    section: NAVIGATION_LABELS.ADMINISTRATION,
    items: [
      ['departments', NAVIGATION_LABELS.DEPARTMENTS, ROUTES.DEPARTMENTS],
      ['designations', NAVIGATION_LABELS.DESIGNATIONS, ROUTES.DESIGNATIONS],
      ['skills', NAVIGATION_LABELS.SKILLS, ROUTES.SKILLS],
      ['roles', NAVIGATION_LABELS.ROLES, ROUTES.ROLES],
      ['audit', NAVIGATION_LABELS.AUDIT_LOGS, ROUTES.AUDIT_LOGS],
    ],
  },
] as const;
