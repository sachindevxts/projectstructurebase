import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from '@/constants/route.constants';
import { AppLayout } from '@/components/layout/AppLayout/AppLayout';
import { AuthLayout } from '@/components/layout/AuthLayout/AuthLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { PermissionRoute } from './PermissionRoute';
import { RouteFallback } from './RouteFallback';

// Feature-based imports
const LoginPage = React.lazy(() => import('@/features/Auth/Components/LoginPage/LoginPage'));
const DashboardPage = React.lazy(
  () => import('@/features/Dashboard/Components/DashboardPage/DashboardPage'),
);
const EmployeesPage = React.lazy(
  () => import('@/features/Employees/Components/EmployeesPage/EmployeesPage'),
);
const EmployeeFormPage = React.lazy(
  () => import('@/features/EmployeeForm/Components/EmployeeFormPage/EmployeeFormPage'),
);
const EmployeeDetail = React.lazy(
  () => import('@/features/Employees/Components/EmployeeDetail/EmployeeDetail'),
);
const BenchPage = React.lazy(() => import('@/features/Bench/Components/BenchPage/BenchPage'));
const ClientsPage = React.lazy(
  () => import('@/features/Clients/Components/ClientsPage/ClientsPage'),
);
const ProjectsPage = React.lazy(
  () => import('@/features/Projects/Components/ProjectsPage/ProjectsPage'),
);
const AllocationsPage = React.lazy(
  () => import('@/features/allocations/components/AllocationsPage/AllocationsPage'),
);
const AllocationFormPage = React.lazy(
  () => import('@/features/AllocationForm/Components/AllocationFormPage/AllocationFormPage'),
);
const ResourcePlannerPage = React.lazy(
  () => import('@/features/ResourcePlanner/Components/ResourcePlannerPage/ResourcePlannerPage'),
);
const ReportsPage = React.lazy(
  () => import('@/features/Reports/Components/ReportsPage/ReportsPage'),
);
// Sales & Revenue pages
const SalesOverviewPage = React.lazy(() => import('@/pages/Sales/ExecutiveOverviewPage'));
// const SalesPipelinePage = React.lazy(() => import('@/pages/Sales/SalesPipelinePage'));
// const InvoicesPage = React.lazy(() => import('@/pages/Sales/InvoicesPage'));
const SkillsPage = React.lazy(() => import('@/features/Skills/Components/SkillsPage/SkillsPage'));
const DesignationsPage = React.lazy(
  () => import('@/features/Designations/Components/DesignationsPage/DesignationsPage'),
);
const DepartmentsPage = React.lazy(
  () => import('@/features/Departments/Components/DepartmentsPage/DepartmentsPage'),
);
const RolesPage = React.lazy(() => import('@/pages/PeopleFlow/RolesPage'));
const AuditLogsPage = React.lazy(() => import('@/pages/PeopleFlow/AuditLogsPage'));
const ITDashboardPage = React.lazy(
  () => import('@/features/ITAdministration/Components/ITAdminPages/ITDashboardPage'),
);
const ITTicketsPage = React.lazy(
  () => import('@/features/ITAdministration/Components/ITAdminPages/ITTicketsPage'),
);
const ITCreateTicketPage = React.lazy(
  () => import('@/features/ITAdministration/Components/ITAdminPages/ITCreateTicketPage'),
);
const ITTicketDetailPage = React.lazy(
  () => import('@/features/ITAdministration/Components/ITAdminPages/ITTicketDetailPage'),
);
const ITAssetsPage = React.lazy(
  () => import('@/features/ITAdministration/Components/ITAdminPages/ITAssetsPage'),
);
const ITSetupPage = React.lazy(
  () => import('@/features/ITAdministration/Components/ITAdminPages/ITSetupPage'),
);
const ITSoftwarePage = React.lazy(
  () => import('@/features/ITAdministration/Components/ITAdminPages/ITSoftwarePage'),
);
const ITConfigurationPage = React.lazy(
  () => import('@/features/ITAdministration/Components/ITAdminPages/ITConfigurationPage'),
);

// Legacy pages (to be migrated)
// const EmployeeFormPage = React.lazy(() => import('@/pages/PeopleFlow/EmployeeFormPage'));
// const ProjectDetailPage = React.lazy(() => import('@/pages/PeopleFlow/ProjectDetailPage'));
// const AllocationFormPage = React.lazy(() => import('@/pages/PeopleFlow/AllocationFormPage'));
// const ResourcePlannerPage = React.lazy(() => import('@/pages/PeopleFlow/ResourcePlannerPage'));
// const DepartmentsPage = React.lazy(() => import('@/pages/PeopleFlow/DepartmentsPage'));
// const DesignationsPage = React.lazy(() => import('@/pages/PeopleFlow/DesignationsPage'));
// const RolesPage = React.lazy(() => import('@/pages/PeopleFlow/RolesPage'));
// const AuditLogsPage = React.lazy(() => import('@/pages/PeopleFlow/AuditLogsPage'));
// const GenericReportPage = React.lazy(() => import('@/pages/PeopleFlow/GenericReportPage'));

// System pages
const UnauthorizedPage = React.lazy(() => import('@/pages/Unauthorized/UnauthorizedPage'));
const NotFoundPage = React.lazy(() => import('@/pages/NotFound/NotFoundPage'));
const ServerErrorPage = React.lazy(() => import('@/pages/ServerError/ServerErrorPage'));
const MaintenancePage = React.lazy(() => import('@/pages/Maintenance/MaintenancePage'));

export const AppRoutes = () => {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        </Route>

        {/* Protected App Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            {/* Dashboard */}
            <Route path={ROUTES.HOME} element={<Navigate to={ROUTES.DASHBOARD} replace />} />
            <Route
              path={ROUTES.DASHBOARD}
              element={
                <PermissionRoute permissions={['dashboard:view']}>
                  <DashboardPage />
                </PermissionRoute>
              }
            />

            {/* People */}
            <Route
              path={ROUTES.EMPLOYEES}
              element={
                <PermissionRoute permissions={['employees:view']}>
                  <EmployeesPage />
                </PermissionRoute>
              }
            />
            <Route
              path={ROUTES.EMPLOYEE_NEW}
              element={
                <PermissionRoute permissions={['employees:create']}>
                  <EmployeeFormPage />
                </PermissionRoute>
              }
            />
            <Route
              path={ROUTES.EMPLOYEE_EDIT}
              element={
                <PermissionRoute permissions={['employees:update']}>
                  <EmployeeFormPage />
                </PermissionRoute>
              }
            />
            <Route
              path={ROUTES.EMPLOYEE_DETAIL}
              element={
                <PermissionRoute permissions={['employees:view']}>
                  <EmployeeDetail />
                </PermissionRoute>
              }
            />
            <Route
              path={ROUTES.BENCH}
              element={
                <PermissionRoute permissions={['bench:view']}>
                  <BenchPage />
                </PermissionRoute>
              }
            />

            {/* Work */}
            <Route
              path={ROUTES.CLIENTS}
              element={
                <PermissionRoute permissions={['clients:view']}>
                  <ClientsPage />
                </PermissionRoute>
              }
            />
            <Route
              path={ROUTES.PROJECTS}
              element={
                <PermissionRoute permissions={['projects:view']}>
                  <ProjectsPage />
                </PermissionRoute>
              }
            />
            {/* <Route path={ROUTES.PROJECT_DETAIL} element={<ProjectDetailPage />} /> */}
            <Route
              path={ROUTES.ALLOCATIONS}
              element={
                <PermissionRoute permissions={['allocations:view']}>
                  <AllocationsPage />
                </PermissionRoute>
              }
            />
            <Route
              path={ROUTES.ALLOCATION_NEW}
              element={
                <PermissionRoute permissions={['allocations:create']}>
                  <AllocationFormPage />
                </PermissionRoute>
              }
            />
            <Route
              path={ROUTES.RESOURCE_PLANNER}
              element={
                <PermissionRoute permissions={['resource-planner:view']}>
                  <ResourcePlannerPage />
                </PermissionRoute>
              }
            />

            {/* Insights */}
            <Route
              path={ROUTES.REPORTS}
              element={
                <PermissionRoute permissions={['reports:view']}>
                  <ReportsPage />
                </PermissionRoute>
              }
            />

            {/* Sales & Revenue */}
            <Route
              path={ROUTES.SALES_OVERVIEW}
              element={
                <PermissionRoute permissions={['sales:view']}>
                  <SalesOverviewPage />
                </PermissionRoute>
              }
            />
            {/* <Route
              path={ROUTES.SALES_PIPELINE}
              element={
                <PermissionRoute permissions={['sales:view']}>
                  <SalesPipelinePage />
                </PermissionRoute>
              }
            />
            <Route
              path={ROUTES.SALES_INVOICES}
              element={
                <PermissionRoute permissions={['sales:view']}>
                  <InvoicesPage />
                </PermissionRoute>
              }
            /> */}

            {/* IT Administration */}
            <Route
              path={ROUTES.IT_ADMIN}
              element={
                <PermissionRoute permissions={['it-admin:view']}>
                  <ITDashboardPage />
                </PermissionRoute>
              }
            />
            <Route
              path={ROUTES.IT_TICKETS}
              element={
                <PermissionRoute permissions={['it-admin:tickets:view']}>
                  <ITTicketsPage />
                </PermissionRoute>
              }
            />
            <Route
              path={ROUTES.IT_TICKET_NEW}
              element={
                <PermissionRoute permissions={['it-admin:tickets:create']}>
                  <ITCreateTicketPage />
                </PermissionRoute>
              }
            />
            <Route
              path={ROUTES.IT_TICKET_DETAIL}
              element={
                <PermissionRoute permissions={['it-admin:tickets:view']}>
                  <ITTicketDetailPage />
                </PermissionRoute>
              }
            />
            <Route
              path={ROUTES.IT_ASSETS}
              element={
                <PermissionRoute permissions={['it-admin:assets:view']}>
                  <ITAssetsPage />
                </PermissionRoute>
              }
            />
            <Route
              path={ROUTES.IT_SETUP}
              element={
                <PermissionRoute permissions={['it-admin:setup:view']}>
                  <ITSetupPage />
                </PermissionRoute>
              }
            />
            <Route
              path={ROUTES.IT_SOFTWARE}
              element={
                <PermissionRoute permissions={['it-admin:software:view']}>
                  <ITSoftwarePage />
                </PermissionRoute>
              }
            />
            <Route
              path={ROUTES.IT_CONFIGURATION}
              element={
                <PermissionRoute permissions={['it-admin:configuration:view']}>
                  <ITConfigurationPage />
                </PermissionRoute>
              }
            />

            {/* Administration */}
            <Route
              path={ROUTES.DEPARTMENTS}
              element={
                <PermissionRoute permissions={['departments:view']}>
                  <DepartmentsPage />
                </PermissionRoute>
              }
            />
            <Route
              path={ROUTES.DESIGNATIONS}
              element={
                <PermissionRoute permissions={['designations:view']}>
                  <DesignationsPage />
                </PermissionRoute>
              }
            />
            <Route
              path={ROUTES.SKILLS}
              element={
                <PermissionRoute permissions={['skills:view']}>
                  <SkillsPage />
                </PermissionRoute>
              }
            />
            <Route
              path={ROUTES.ROLES}
              element={
                <PermissionRoute permissions={['roles:view']}>
                  <RolesPage />
                </PermissionRoute>
              }
            />
            <Route
              path={ROUTES.AUDIT_LOGS}
              element={
                <PermissionRoute permissions={['audit-logs:view']}>
                  <AuditLogsPage />
                </PermissionRoute>
              }
            />

            {/* System */}
            <Route path={ROUTES.UNAUTHORIZED} element={<UnauthorizedPage />} />
            <Route path={ROUTES.SERVER_ERROR} element={<ServerErrorPage />} />
            <Route path={ROUTES.MAINTENANCE} element={<MaintenancePage />} />
            <Route path={ROUTES.NOT_FOUND} element={<NotFoundPage />} />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
};
