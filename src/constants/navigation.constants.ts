import { ROUTES } from './route.constants';

export const NAVIGATION_LABELS = {
  APP_NAME: 'PeopleFlow HR',
  COMPANY: 'Acme Corp',
  MAIN: 'MAIN',
  PEOPLE: 'PEOPLE',
  WORK: 'WORK',
  INSIGHTS: 'INSIGHTS',
  ADMINISTRATION: 'ADMINISTRATION',
  DASHBOARD: 'Dashboard',
  EMPLOYEES: 'Employees',
  BENCH: 'Bench & Availability',
  CLIENTS: 'Clients',
  PROJECTS: 'Projects',
  ALLOCATIONS: 'Resource Allocations',
  PLANNER: 'Resource Planner',
  REPORTS: 'Reports',
  DEPARTMENTS: 'Departments',
  DESIGNATIONS: 'Designations',
  SKILLS: 'Skills',
  ROLES: 'Roles & Permissions',
  AUDIT_LOGS: 'Audit Logs',
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
