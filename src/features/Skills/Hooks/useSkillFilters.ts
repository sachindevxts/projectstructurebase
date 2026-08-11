import { useState, useMemo, useCallback } from 'react';
import { useDebounce } from '@/hooks';
import { skillService } from '../Services/skillService';

interface FilterState {
  search: string;
  category: string;
  demand: string;
}

export const useSkillFilters = (initialFilters?: Partial<FilterState>) => {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    category: 'All',
    demand: 'All Demand',
    ...initialFilters,
  });

  const debouncedSearch = useDebounce(filters.search, 300);

  const filteredSkills = useMemo(() => {
    return skillService.filterSkills({
      search: debouncedSearch,
      category: filters.category,
      demand: filters.demand,
    });
  }, [debouncedSearch, filters.category, filters.demand]);

  const updateFilter = useCallback(<K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      search: '',
      category: 'All',
      demand: 'All Demand',
    });
  }, []);

  const activeFilterCount = useMemo(() => {
    return Object.values(filters).filter(value => 
      value !== '' && value !== 'All' && value !== 'All Demand'
    ).length;
  }, [filters]);

  return {
    filters,
    filteredSkills,
    updateFilter,
    resetFilters,
    activeFilterCount,
  };
};