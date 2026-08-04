import React from 'react';
import { Box, Button, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { RestartAlt } from '@mui/icons-material';
import { REPORT_DEPARTMENTS, REPORT_PERIODS, REPORT_TYPES } from '../../constants/report.constants';
import type { ReportFilters as FiltersType } from '../../types/report.types';
import styles from './ReportFilters.module.scss';

interface ReportFiltersProps {
  filters: FiltersType;
  onFilterChange: <K extends keyof FiltersType>(key: K, value: FiltersType[K]) => void;
  onReset: () => void;
}

export const ReportFilters = ({ filters, onFilterChange, onReset }: ReportFiltersProps) => (
  <Box className={styles.filtersContainer}>
    <FormControl size="small" className={styles.filterItem}>
      <InputLabel>Period</InputLabel>
      <Select value={filters.period} label="Period" onChange={(event) => onFilterChange('period', event.target.value)}>
        {REPORT_PERIODS.map((period) => <MenuItem key={period} value={period}>{period}</MenuItem>)}
      </Select>
    </FormControl>
    <FormControl size="small" className={styles.filterItem}>
      <InputLabel>Department</InputLabel>
      <Select value={filters.department} label="Department" onChange={(event) => onFilterChange('department', event.target.value)}>
        {REPORT_DEPARTMENTS.map((department) => <MenuItem key={department} value={department}>{department}</MenuItem>)}
      </Select>
    </FormControl>
    <FormControl size="small" className={styles.filterItem}>
      <InputLabel>Report Type</InputLabel>
      <Select value={filters.reportType} label="Report Type" onChange={(event) => onFilterChange('reportType', event.target.value)}>
        {REPORT_TYPES.map((type) => <MenuItem key={type} value={type}>{type}</MenuItem>)}
      </Select>
    </FormControl>
    <Button variant="outlined" startIcon={<RestartAlt />} onClick={onReset} className={styles.filtersEnd}>Reset</Button>
  </Box>
);
