import { lazy } from 'react';
import { ROUTES } from '@/constants/route.constants';
import type { AppRoute } from '@/types/route.types';
import { DashboardPage } from '@/Features';

// Feature-based lazy imports
// const DashboardPage = lazy(() => import('@/Features/dashboard/components/DashboardPage/DashboardPage'));
const EmployeesPage = lazy(
  () => import('@/Features/employees/components/EmployeesPage/EmployeesPage'),
);
const EmployeeDetailPage = lazy(() => import('@/pages/PeopleFlow/EmployeeDetailPage'));
// const EmployeeFormPage = lazy(() => import('@/pages/PeopleFlow/EmployeeFormPage'));
const BenchPage = lazy(() => import('@/Features/bench/components/BenchPage/BenchPage'));
const ProjectsPage = lazy(() => import('@/Features/projects/components/ProjectsPage/ProjectsPage'));
// const ProjectDetailPage = lazy(() => import('@/pages/PeopleFlow/ProjectDetailPage'));
const AllocationsPage = lazy(
  () => import('@/Features/allocations/components/AllocationsPage/AllocationsPage'),
);
const AllocationFormPage = lazy(() => import('@/pages/PeopleFlow/AllocationFormPage'));
// const ResourcePlannerPage = lazy(() => import('@/pages/PeopleFlow/ResourcePlannerPage'));
// const DepartmentsPage = lazy(() => import('@/pages/PeopleFlow/DepartmentsPage'));
// const DesignationsPage = lazy(() => import('@/pages/PeopleFlow/DesignationsPage'));
const SkillsPage = lazy(() => import('@/Features/skills/components/SkillsPage/SkillsPage'));
const RolesPage = lazy(() => import('@/pages/PeopleFlow/RolesPage'));
const AuditLogsPage = lazy(() => import('@/pages/PeopleFlow/AuditLogsPage'));
// const GenericReportPage = lazy(() => import('@/pages/PeopleFlow/GenericReportPage'));
const LoginPage = lazy(() => import('@/Features/auth/components/LoginPage/LoginPage'));
const RecoveryPage = lazy(() => import('@/pages/Auth/RecoveryPage'));

// System pages
const UnauthorizedPage = lazy(() => import('@/pages/Unauthorized/UnauthorizedPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFound/NotFoundPage'));
const ServerErrorPage = lazy(() => import('@/pages/ServerError/ServerErrorPage'));
const MaintenancePage = lazy(() => import('@/pages/Maintenance/MaintenancePage'));

export const routeConfig: AppRoute[] = [
  // Public Routes
  {
    path: ROUTES.LOGIN,
    element: <LoginPage />,
    layout: 'auth',
    isProtected: false,
  },
  {
    path: ROUTES.FORGOT_PASSWORD,
    element: <RecoveryPage />,
    layout: 'auth',
    isProtected: false,
  },
  {
    path: ROUTES.RESET_PASSWORD,
    element: <RecoveryPage />,
    layout: 'auth',
    isProtected: false,
  },

  // Protected App Routes
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
  },

  // People Section
  {
    path: ROUTES.EMPLOYEES,
    element: <EmployeesPage />,
    layout: 'app',
    isProtected: true,
  },
  // {
  //   path: ROUTES.EMPLOYEE_NEW,
  //   element: <EmployeeFormPage />,
  //   layout: 'app',
  //   isProtected: true,
  // },
  // {
  //   path: ROUTES.EMPLOYEE_DETAIL,
  //   element: <EmployeeDetailPage />,
  //   layout: 'app',
  //   isProtected: true,
  // },
  // {
  //   path: ROUTES.EMPLOYEE_EDIT,
  //   element: <EmployeeFormPage />,
  //   layout: 'app',
  //   isProtected: true,
  // },
  {
    path: ROUTES.BENCH,
    element: <BenchPage />,
    layout: 'app',
    isProtected: true,
  },

  // Work Section
  {
    path: ROUTES.PROJECTS,
    element: <ProjectsPage />,
    layout: 'app',
    isProtected: true,
  },
  // {
  //   path: ROUTES.PROJECT_NEW,
  //   element: <ProjectDetailPage />,
  //   layout: 'app',
  //   isProtected: true,
  // },
  // {
  //   path: ROUTES.PROJECT_DETAIL,
  //   element: <ProjectDetailPage />,
  //   layout: 'app',
  //   isProtected: true,
  // },
  {
    path: ROUTES.ALLOCATIONS,
    element: <AllocationsPage />,
    layout: 'app',
    isProtected: true,
  },
  {
    path: ROUTES.ALLOCATION_NEW,
    element: <AllocationFormPage />,
    layout: 'app',
    isProtected: true,
  },
  // {
  //   path: ROUTES.RESOURCE_PLANNER,
  //   element: <ResourcePlannerPage />,
  //   layout: 'app',
  //   isProtected: true,
  // },

  // // Insights Section
  // {
  //   path: ROUTES.REPORTS,
  //   element: <GenericReportPage />,
  //   layout: 'app',
  //   isProtected: true,
  // },
  // {
  //   path: ROUTES.REPORTS_EMPLOYEES,
  //   element: <GenericReportPage />,
  //   layout: 'app',
  //   isProtected: true,
  // },
  // {
  //   path: ROUTES.REPORTS_PROJECTS,
  //   element: <GenericReportPage />,
  //   layout: 'app',
  //   isProtected: true,
  // },
  // {
  //   path: ROUTES.REPORTS_ALLOCATIONS,
  //   element: <GenericReportPage />,
  //   layout: 'app',
  //   isProtected: true,
  // },

  // // Administration Section
  // {
  //   path: ROUTES.DEPARTMENTS,
  //   element: <DepartmentsPage />,
  //   layout: 'app',
  //   isProtected: true,
  // },
  // {
  //   path: ROUTES.DESIGNATIONS,
  //   element: <DesignationsPage />,
  //   layout: 'app',
  //   isProtected: true,
  // },
  {
    path: ROUTES.SKILLS,
    element: <SkillsPage />,
    layout: 'app',
    isProtected: true,
  },
  {
    path: ROUTES.ROLES,
    element: <RolesPage />,
    layout: 'app',
    isProtected: true,
  },
  {
    path: ROUTES.AUDIT_LOGS,
    element: <AuditLogsPage />,
    layout: 'app',
    isProtected: true,
  },

  // System Routes
  {
    path: ROUTES.UNAUTHORIZED,
    element: <UnauthorizedPage />,
    layout: 'none',
    isProtected: false,
  },
  {
    path: ROUTES.SERVER_ERROR,
    element: <ServerErrorPage />,
    layout: 'none',
    isProtected: false,
  },
  {
    path: ROUTES.MAINTENANCE,
    element: <MaintenancePage />,
    layout: 'none',
    isProtected: false,
  },
  {
    path: ROUTES.NOT_FOUND,
    element: <NotFoundPage />,
    layout: 'none',
    isProtected: false,
  },
];

