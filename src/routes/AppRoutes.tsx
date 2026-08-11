import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from '@/constants/route.constants';
import { AppLayout } from '@/components/layout/AppLayout/AppLayout';
import { AuthLayout } from '@/components/layout/AuthLayout/AuthLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { RouteFallback } from './RouteFallback';
import { AllocationFormPage, DashboardPage, DesignationsPage, EmployeeFormPage, EmployeesPage, ProjectsPage, ResourcePlannerPage, SkillsPage } from '@/features';
import EmployeeDetail from '@/features/Employees/Components/EmployeeDetail/EmployeeDetail';
import { DepartmentsPage } from '@/features/Departments';
import RolesPage from '@/pages/PeopleFlow/RolesPage';
import AuditLogsPage from '@/pages/PeopleFlow/AuditLogsPage';

// Feature-based imports
const LoginPage = React.lazy(() => import('@/features/Auth/Components/LoginPage/LoginPage'));
// const DashboardPage = React.lazy(
//   () => import('@/features/Dashboard/Components/DashboardPage/DashboardPage'),
// );
// const EmployeesPage = React.lazy(
//   () => import('@/features/Employees/Components/EmployeesPage/EmployeesPage'),
// );
// const EmployeeDetail = React.lazy(
//   () => import('@/features/Employees/Components/EmployeeDetail/EmployeeDetail'),
// );
const BenchPage = React.lazy(() => import('@/features/Bench/Components/BenchPage/BenchPage'));
// const ProjectsPage = React.lazy(
//   () => import('@/features/Projects/Components/ProjectsPage/ProjectsPage'),
// );
const AllocationsPage = React.lazy(
  () => import('@/features/allocations/components/AllocationsPage/AllocationsPage'),
);
// const SkillsPage = React.lazy(() => import('@/features/Skills/Components/SkillsPage/SkillsPage'));

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
            <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />

            {/* People */}
            <Route path={ROUTES.EMPLOYEES} element={<EmployeesPage />} />
            <Route path={ROUTES.EMPLOYEE_NEW} element={<EmployeeFormPage />} />
            <Route path={ROUTES.EMPLOYEE_DETAIL} element={<EmployeeDetail />} />
            <Route path={ROUTES.BENCH} element={<BenchPage />} />

            {/* Work */}
            <Route path={ROUTES.PROJECTS} element={<ProjectsPage />} />
            {/* <Route path={ROUTES.PROJECT_DETAIL} element={<ProjectDetailPage />} /> */}
            <Route path={ROUTES.ALLOCATIONS} element={<AllocationsPage />} />
            <Route path={ROUTES.ALLOCATION_NEW} element={<AllocationFormPage />} />
            <Route path={ROUTES.RESOURCE_PLANNER} element={<ResourcePlannerPage />} />

            {/* Insights */}
            {/* <Route path={ROUTES.REPORTS} element={<GenericReportPage />} /> */}

            {/* Administration */}
            <Route path={ROUTES.DEPARTMENTS} element={<DepartmentsPage />} />
            <Route path={ROUTES.DESIGNATIONS} element={<DesignationsPage />} />
            <Route path={ROUTES.SKILLS} element={<SkillsPage />} />
            <Route path={ROUTES.ROLES} element={<RolesPage />} />
            <Route path={ROUTES.AUDIT_LOGS} element={<AuditLogsPage />} />

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

