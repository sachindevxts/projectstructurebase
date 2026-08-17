import { useState, useEffect, useCallback, useMemo } from 'react';
import type { DashboardData, DashboardState } from '../Types/dashboard.types';
import { dashboardService } from '../Services/dashboardService';

export const useDashboard = () => {
  const [state, setState] = useState<DashboardState>({
    data: null,
    loading: true,
    error: null,
    initialized: false,
  });

  const loadDashboard = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      const data = await dashboardService.getDashboardData();
      setState({
        data,
        loading: false,
        error: null,
        initialized: true,
      });
    } catch (err) {
      setState({
        data: null,
        loading: false,
        error: 'Failed to load dashboard data',
        initialized: false,
      });
      console.error('Error loading dashboard:', err);
    }
  }, []);

  useEffect(() => {
    if (!state.initialized) {
      loadDashboard();
    }
  }, [state.initialized, loadDashboard]);

  const stats = useMemo(() => state.data?.stats || [], [state.data]);
  const billableData = useMemo(
    () => state.data?.billableVsNonBillable || { billable: 0, nonBillable: 0 },
    [state.data],
  );
  const departmentData = useMemo(() => state.data?.employeesByDepartment || [], [state.data]);
  const allocationData = useMemo(
    () => state.data?.allocationDistribution || { active: 0, total: 0 },
    [state.data],
  );
  const upcomingReleases = useMemo(() => state.data?.upcomingReleases || [], [state.data]);
  const overallocatedEmployees = useMemo(
    () => state.data?.overallocatedEmployees || [],
    [state.data],
  );
  const recentActivity = useMemo(() => state.data?.recentActivity || [], [state.data]);

  return {
    data: state.data,
    loading: state.loading,
    error: state.error,
    initialized: state.initialized,
    stats,
    billableData,
    departmentData,
    allocationData,
    upcomingReleases,
    overallocatedEmployees,
    recentActivity,
    refresh: loadDashboard,
  };
};
