import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDebounce } from '@/hooks';
import { plannerService } from '../services/plannerService';
import type { PlannerAllocation, PlannerFilters } from '../types/planner.types';

const defaultFilters: PlannerFilters = {
  search: '',
  department: 'All',
  skill: 'All',
  status: 'All',
};

export const useResourcePlanner = () => {
  const [allocations, setAllocations] = useState<PlannerAllocation[]>([]);
  const [filters, setFilters] = useState<PlannerFilters>(defaultFilters);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const debouncedSearch = useDebounce(filters.search, 300);

  const loadPlanner = useCallback(async () => {
    try {
      setLoading(true);
      setAllocations(plannerService.getAllAllocations());
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

  const filteredAllocations = useMemo(
    () => plannerService.filterAllocations({ ...filters, search: debouncedSearch }),
    [allocations, debouncedSearch, filters],
  );

  const updateFilter = useCallback(<K extends keyof PlannerFilters>(key: K, value: PlannerFilters[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetFilters = useCallback(() => setFilters(defaultFilters), []);
  const stats = useMemo(() => plannerService.getStats(), [allocations]);

  return { allocations, filteredAllocations, filters, loading, error, stats, loadPlanner, updateFilter, resetFilters };
};
