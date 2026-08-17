import React from 'react';
import { Box, Button, FormControl, MenuItem, Select } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { PLANNER_DEPARTMENTS, PLANNER_SKILLS } from '../../constants/planner.constants';
import type { PlannerFilters as FiltersType } from '../../types/planner.types';
import styles from './PlannerFilters.module.scss';

interface PlannerFiltersProps {
  filters: FiltersType;
  onFilterChange: <K extends keyof FiltersType>(key: K, value: FiltersType[K]) => void;
  onReset: () => void;
  resultCount?: number;
  canCreateAllocation?: boolean;
}

export const PlannerFilters = ({ filters, onFilterChange, canCreateAllocation = false }: PlannerFiltersProps) => (
  <Box className={styles.filtersContainer}>
    <FormControl size="small" className={styles.filterItem}>
      <Select value={filters.department} onChange={(event) => onFilterChange('department', event.target.value)}>
        {PLANNER_DEPARTMENTS.map((department) => (
          <MenuItem key={department} value={department}>
            {department === 'All' ? 'All Departments' : department}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
    <FormControl size="small" className={styles.filterItem}>
      <Select value={filters.skill} onChange={(event) => onFilterChange('skill', event.target.value)}>
        {PLANNER_SKILLS.map((skill) => (
          <MenuItem key={skill} value={skill}>
            {skill === 'All' ? 'All Skills' : skill}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
    {canCreateAllocation && (
      <Button variant="contained" startIcon={<AddIcon />} className={styles.addButton}>
        Add Allocation
      </Button>
    )}
  </Box>
);

