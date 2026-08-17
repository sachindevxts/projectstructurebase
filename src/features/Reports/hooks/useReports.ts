import { useCallback, useEffect, useMemo, useState } from 'react';
import { reportService } from '../services/reportService';
import type { ReportData, ReportFilters } from '../types/report.types';

const defaultFilters: ReportFilters = {
  period: 'This Month',
  department: 'All',
  reportType: 'Workforce',
};

export const useReports = () => {
  const [filters, setFilters] = useState<ReportFilters>(defaultFilters);
  const [data, setData] = useState<ReportData>({
    metrics: { headcount: 0, billable: 0, bench: 0, utilization: 0 },
    departmentUtilization: [],
    monthlyTrend: [],
    allocationMix: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadReports = useCallback(async () => {
    try {
      setLoading(true);
      setData(await reportService.getReportData(filters));
      setError(null);
    } catch (err) {
      setError('Failed to load reports');
      console.error('Error loading reports:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  const updateFilter = useCallback(<K extends keyof ReportFilters>(key: K, value: ReportFilters[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetFilters = useCallback(() => setFilters(defaultFilters), []);
  const stats = useMemo(() => data.metrics, [data]);

  return { data, stats, filters, loading, error, loadReports, updateFilter, resetFilters };
};
