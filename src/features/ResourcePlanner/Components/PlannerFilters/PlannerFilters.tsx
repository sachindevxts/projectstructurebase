import React from 'react';
import { Box, Button, FormControl, MenuItem, Select } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import type { PlannerFilters as FiltersType } from '../../types/planner.types';
import styles from './PlannerFilters.module.scss';

interface PlannerFiltersProps {
  filters: FiltersType;
  onFilterChange: <K extends keyof FiltersType>(key: K, value: FiltersType[K]) => void;
  onReset: () => void;
  resultCount?: number;
  canCreateAllocation?: boolean;
  departments: string[];
  skills: string[];
  statuses: string[];
  onAddAllocation?: () => void;
}

export const PlannerFilters = ({
  filters,
  onFilterChange,
  canCreateAllocation = false,
  departments,
  skills,
  statuses,
  onAddAllocation,
}: PlannerFiltersProps) => (
  <Box className={styles.filtersContainer}>
    <FormControl size="small" className={styles.filterItem}>
      <Select value={filters.department} onChange={(event) => onFilterChange('department', event.target.value)}>
        {departments.map((department) => (
          <MenuItem key={department} value={department}>
            {department === 'All' ? 'All Departments' : department}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
    <FormControl size="small" className={styles.filterItem}>
      <Select value={filters.skill} onChange={(event) => onFilterChange('skill', event.target.value)}>
        {skills.map((skill) => (
          <MenuItem key={skill} value={skill}>
            {skill === 'All' ? 'All Skills' : skill}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
    <FormControl size="small" className={styles.filterItem}>
      <Select value={filters.status} onChange={(event) => onFilterChange('status', event.target.value)}>
        {statuses.map((status) => (
          <MenuItem key={status} value={status}>
            {status === 'All' ? 'All Statuses' : status}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
    {canCreateAllocation && (
      <Button variant="contained" startIcon={<AddIcon />} className={styles.addButton} onClick={onAddAllocation}>
        Add Allocation
      </Button>
    )}
  </Box>
);

