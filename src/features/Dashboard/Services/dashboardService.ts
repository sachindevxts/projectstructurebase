import { dashboardService as apiDashboardService } from '@/api/services/dashboard.service';
import type { DashboardData } from '../Types/dashboard.types';

let dashboardCache: DashboardData | null = null;

async function getDashboardData(): Promise<DashboardData> {
  const summary = await apiDashboardService.getSummary();

  dashboardCache = {
    stats: [
      {
        id: 'total-employees',
        value: summary.totalEmployees,
        label: 'Total Employees',
        change: 0,
        trend: 'neutral',
        icon: 'people',
        color: 'var(--color-info)',
      },
      {
        id: 'active-employees',
        value: summary.activeEmployees,
        label: 'Active',
        change: 0,
        trend: 'neutral',
        icon: 'active',
        color: 'var(--color-success-light)',
      },
      {
        id: 'on-leave',
        value: 0,
        label: 'On Leave',
        change: 0,
        trend: 'neutral',
        icon: 'leave',
        color: 'var(--color-warning-light)',
      },
      {
        id: 'contractors',
        value: 0,
        label: 'Contractors',
        change: 0,
        trend: 'neutral',
        icon: 'contract',
        color: 'var(--color-accent-purple)',
      },
      {
        id: 'billable',
        value: `${summary.billablePercentage}%`,
        label: 'Billable %',
        change: 0,
        trend: 'neutral',
        icon: 'billable',
        color: 'var(--color-success-light)',
      },
      {
        id: 'open-positions',
        value: 0,
        label: 'Overallocated',
        change: 0,
        trend: 'neutral',
        icon: 'risk',
        color: 'var(--color-error)',
      },
    ],
    billableVsNonBillable: {
      billable: summary.billableEmployees,
      nonBillable: summary.nonBillableEmployees,
    },
    employeesByDepartment: [],
    allocationDistribution: {
      active: summary.activeEmployees,
      total: summary.totalEmployees,
    },
    upcomingReleases: [],
    overallocatedEmployees: [],
    recentActivity: [
      {
        id: 'dashboard-summary',
        action: 'Loaded live dashboard summary',
        user: 'System',
        timestamp: new Date().toISOString(),
      },
    ],
  };

  return dashboardCache;
}

function getStats(): DashboardData['stats'] {
  return dashboardCache?.stats ?? [];
}

function getBillableData() {
  return dashboardCache?.billableVsNonBillable ?? { billable: 0, nonBillable: 0 };
}

function getDepartmentData() {
  return dashboardCache?.employeesByDepartment ?? [];
}

function getAllocationData() {
  return dashboardCache?.allocationDistribution ?? { active: 0, total: 0 };
}

function getUpcomingReleases() {
  return dashboardCache?.upcomingReleases ?? [];
}

function getOverallocatedEmployees() {
  return dashboardCache?.overallocatedEmployees ?? [];
}

function getRecentActivity() {
  return dashboardCache?.recentActivity ?? [];
}

export const dashboardService = {
  getDashboardData,
  getStats,
  getBillableData,
  getDepartmentData,
  getAllocationData,
  getUpcomingReleases,
  getOverallocatedEmployees,
  getRecentActivity,
};
