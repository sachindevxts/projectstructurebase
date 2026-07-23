import type { AppRoute } from '@/types/route.types';
import { lazy } from 'react';
import { AppLayout } from '@/components/layout/AppLayout/AppLayout';
import { AuthLayout } from '@/components/layout/AuthLayout/AuthLayout';
import { PublicLayout } from '@/components/layout/PublicLayout/PublicLayout';
export { SIDEBAR_ITEMS } from '@/constants/navigation.constants';
const Login = lazy(() => import('@/features/auth/pages/LoginPage'));
const Recovery = lazy(() => import('@/features/auth/pages/RecoveryPage'));
const Dashboard = lazy(() => import('@/pages/PeopleFlow/DashboardPage'));
const Employees = lazy(() => import('@/pages/PeopleFlow/EmployeesPage'));
const EmployeeForm = lazy(() => import('@/pages/PeopleFlow/EmployeeFormPage'));
const EmployeeDetail = lazy(() => import('@/pages/PeopleFlow/EmployeeDetailPage'));
const Projects = lazy(() => import('@/pages/PeopleFlow/ProjectsPage'));
const ProjectDetail = lazy(() => import('@/pages/PeopleFlow/ProjectDetailPage'));
const Allocations = lazy(() => import('@/pages/PeopleFlow/AllocationsPage'));
const AllocationForm = lazy(() => import('@/pages/PeopleFlow/AllocationFormPage'));
const Planner = lazy(() => import('@/pages/PeopleFlow/ResourcePlannerPage'));
const Bench = lazy(() => import('@/pages/PeopleFlow/BenchPage'));
const Departments = lazy(() => import('@/pages/PeopleFlow/DepartmentsPage'));
const Designations = lazy(() => import('@/pages/PeopleFlow/DesignationsPage'));
const Skills = lazy(() => import('@/pages/PeopleFlow/SkillsPage'));
const Roles = lazy(() => import('@/pages/PeopleFlow/RolesPage'));
const Audit = lazy(() => import('@/pages/PeopleFlow/AuditLogsPage'));
const States = lazy(() => import('@/pages/PeopleFlow/SystemStatesPage'));
const Report = lazy(() => import('@/pages/PeopleFlow/GenericReportPage'));
const NotFound = lazy(() => import('@/pages/NotFound/NotFoundPage'));
const app = (path: string, element: React.ReactNode): AppRoute => ({
  path,
  element,
  layout: 'app',
});
export const routeConfig: AppRoute[] = [
  { path: '/login', element: <Login />, layout: 'auth' },
  { path: '/forgot-password', element: <Recovery />, layout: 'auth' },
  { path: '/reset-password', element: <Recovery />, layout: 'auth' },
  app('/', <Dashboard />),
  app('/dashboard', <Dashboard />),
  app('/employees', <Employees />),
  app('/employees/new', <EmployeeForm />),
  app('/employees/:employeeId', <EmployeeDetail />),
  app('/employees/:employeeId/edit', <EmployeeForm />),
  app('/projects', <Projects />),
  app('/projects/:projectId', <ProjectDetail />),
  app('/projects/new', <GenericPage title="Create Project" />),
  app('/projects/:projectId/edit', <GenericPage title="Edit Project" />),
  app('/allocations', <Allocations />),
  app('/allocations/new', <AllocationForm />),
  app('/allocations/:allocationId/edit', <AllocationForm />),
  app('/resource-planner', <Planner />),
  app('/bench', <Bench />),
  app('/departments', <Departments />),
  app('/designations', <Designations />),
  app('/skills', <Skills />),
  app('/settings/roles', <Roles />),
  app('/audit-logs', <Audit />),
  app('/system-states', <States />),
  ...['employees', 'allocations', 'project-staffing', 'bench', 'availability'].map((name) =>
    app(`/reports/${name}`, <Report />),
  ),
  ...['clients', 'clients/new', 'clients/:clientId', 'clients/:clientId/edit'].map((path) =>
    app(
      `/${path}`,
      <GenericPage title={path.split('/')[0].replace(/^./, (c) => c.toUpperCase())} />,
    ),
  ),
  { path: '*', element: <NotFound />, layout: 'public' },
];
function GenericPage({ title }: { title: string }) {
  return (
    <div className="pf-page">
      <div className="pf-planner-toolbar">
        <header className="pf-page-header">
          <div>
            <h1>{title}</h1>
            <p>UI ready for local dummy data.</p>
          </div>
          <button className="pf-button">＋ Add {title}</button>
        </header>
      </div>
      <section className="pf-card pf-state">
        <strong>▦</strong>
        <h2>{title} workspace</h2>
        <p>This frontend-only module uses the shared PeopleFlow layout and design system.</p>
      </section>
    </div>
  );
}
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
