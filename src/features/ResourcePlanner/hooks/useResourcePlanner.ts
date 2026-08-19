import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDebounce } from '@/hooks';
import { plannerService } from '../services/plannerService';
import type {
  PlannerAllocation,
  PlannerFilters,
  PlannerGroupBy,
  PlannerRange,
  PlannerViewMode,
} from '../types/planner.types';

const defaultFilters: PlannerFilters = {
  search: '',
  department: 'All',
  skill: 'All',
  status: 'All',
};

const toDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const useResourcePlanner = () => {
  const [allocations, setAllocations] = useState<PlannerAllocation[]>([]);
  const [filters, setFilters] = useState<PlannerFilters>(defaultFilters);
  const [viewMode, setViewMode] = useState<PlannerViewMode>('month');
  const [groupBy, setGroupBy] = useState<PlannerGroupBy>('employee');
  const [anchorDate, setAnchorDate] = useState(() => new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const debouncedSearch = useDebounce(filters.search, 300);

  const loadPlanner = useCallback(async () => {
    try {
      setLoading(true);
      setAllocations(await plannerService.getAllAllocations());
      setError(null);
    } catch (err) {
      setError('Failed to load resource planner');
      console.error('Error loading planner:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPlanner();
  }, [loadPlanner]);

  const visibleRange = useMemo<PlannerRange>(() => {
    const start = new Date(anchorDate);
    const end = new Date(anchorDate);

    if (viewMode === 'month') {
      start.setDate(1);
      end.setMonth(end.getMonth() + 1, 0);
    } else if (viewMode === 'week') {
      const day = start.getDay();
      start.setDate(start.getDate() - day);
      end.setTime(start.getTime());
      end.setDate(start.getDate() + 6);
    }

    return {
      startDate: toDateKey(start),
      endDate: toDateKey(end),
    };
  }, [anchorDate, viewMode]);

  const filteredAllocations = useMemo(
    () =>
      plannerService.filterAllocations(
        { ...filters, search: debouncedSearch },
        visibleRange,
        allocations,
      ),
    [allocations, debouncedSearch, filters, visibleRange],
  );

  const filterOptions = useMemo(() => plannerService.getFilterOptions(allocations), [allocations]);

  const updateFilter = useCallback(
    <K extends keyof PlannerFilters>(key: K, value: PlannerFilters[K]) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const resetFilters = useCallback(() => setFilters(defaultFilters), []);
  const stats = useMemo(() => plannerService.getStats(filteredAllocations), [filteredAllocations]);

  const movePeriod = useCallback((direction: -1 | 1) => {
    setAnchorDate((current) => {
      const next = new Date(current);
      if (viewMode === 'month') next.setMonth(next.getMonth() + direction);
      if (viewMode === 'week') next.setDate(next.getDate() + direction * 7);
      if (viewMode === 'day') next.setDate(next.getDate() + direction);
      return next;
    });
  }, [viewMode]);

  const goToday = useCallback(() => setAnchorDate(new Date()), []);

  return {
    allocations,
    filteredAllocations,
    filters,
    filterOptions,
    viewMode,
    groupBy,
    anchorDate,
    visibleRange,
    loading,
    error,
    stats,
    loadPlanner,
    updateFilter,
    resetFilters,
    setViewMode,
    setGroupBy,
    movePeriod,
    goToday,
  };
};
