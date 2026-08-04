import { useState, useMemo, useCallback } from 'react';
import { useDebounce } from '@/hooks';
import { employeeService } from '../services/employeeService';
import type { EmployeeFilters } from '../types/employee.types';

export const useEmployeeFilters = (initialFilters?: Partial<EmployeeFilters>) => {
  const [filters, setFilters] = useState<EmployeeFilters>({
    search: '',
    department: 'All',
    designation: 'All',
    status: 'All',
    billability: 'All',
    employmentType: 'All',
    ...initialFilters,
  });

  const debouncedSearch = useDebounce(filters.search, 300);

  const filteredEmployees = useMemo(() => {
    return employeeService.filterEmployees({
      ...filters,
      search: debouncedSearch,
    });
  }, [debouncedSearch, filters]);

  const updateFilter = useCallback(<K extends keyof EmployeeFilters>(
    key: K,
    value: EmployeeFilters[K]
  ) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      search: '',
      department: 'All',
      designation: 'All',
      status: 'All',
      billability: 'All',
      employmentType: 'All',
    });
  }, []);

  const activeFilterCount = useMemo(() => {
    return Object.values(filters).filter(value =>
      value !== '' && value !== 'All'
    ).length;
  }, [filters]);

  return {
    filters,
    filteredEmployees,
    updateFilter,
    resetFilters,
    activeFilterCount,
  };
};