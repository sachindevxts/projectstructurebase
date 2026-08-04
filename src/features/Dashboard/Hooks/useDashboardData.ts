import { useMemo } from 'react';
import { useDashboard } from './useDashboard';

export const useDashboardData = () => {
  const dashboard = useDashboard();

  const summaryStats = useMemo(() => {
    const stats = dashboard.stats;
    return {
      totalEmployees: stats.find(s => s.id === 'total-employees')?.value || 0,
      activeEmployees: stats.find(s => s.id === 'active-employees')?.value || 0,
      onLeave: stats.find(s => s.id === 'on-leave')?.value || 0,
      billablePercentage: stats.find(s => s.id === 'billable')?.value || '0%',
      overallocated: stats.find(s => s.id === 'open-positions')?.value || 0,
    };
  }, [dashboard.stats]);

  const departmentStats = useMemo(() => {
    const deptData = dashboard.departmentData;
    const total = deptData.reduce((sum, d) => sum + d.count, 0);
    return deptData.map(d => ({
      ...d,
      percentage: total > 0 ? Math.round((d.count / total) * 100) : 0,
    }));
  }, [dashboard.departmentData]);

  const allocationStats = useMemo(() => {
    const { active, total } = dashboard.allocationData;
    return {
      active,
      total,
      percentage: total > 0 ? Math.round((active / total) * 100) : 0,
      inactive: total - active,
    };
  }, [dashboard.allocationData]);

  return {
    ...dashboard,
    summaryStats,
    departmentStats,
    allocationStats,
  };
};