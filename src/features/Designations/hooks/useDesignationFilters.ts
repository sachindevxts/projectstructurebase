import { useCallback, useMemo, useState } from 'react';
import { useDebounce } from '@/hooks';
import { designationService } from '../services/designationService';
import type { DesignationFilters } from '../types/designation.types';

export const useDesignationFilters = (initialFilters?: Partial<DesignationFilters>) => {
  const [filters, setFilters] = useState<DesignationFilters>({
    search: '',
    department: 'All',
    level: 'All',
    status: 'All',
    ...initialFilters,
  });

  const debouncedSearch = useDebounce(filters.search, 300);

  const filteredDesignations = useMemo(
    () => designationService.filterDesignations({ ...filters, search: debouncedSearch }),
    [debouncedSearch, filters],
  );

  const updateFilter = useCallback(<K extends keyof DesignationFilters>(key: K, value: DesignationFilters[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({ search: '', department: 'All', level: 'All', status: 'All' });
  }, []);

  return { filters, filteredDesignations, updateFilter, resetFilters };
};
