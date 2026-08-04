import React from 'react';
import { Box, Chip, FormControl, InputAdornment, InputLabel, MenuItem, Select, Stack, TextField } from '@mui/material';
import { Clear as ClearIcon, Search as SearchIcon } from '@mui/icons-material';
import { DESIGNATION_DEPARTMENTS, DESIGNATION_LEVELS, DESIGNATION_STATUSES } from '../../constants/designation.constants';
import type { DesignationFilters as FiltersType } from '../../types/designation.types';
import styles from './DesignationFilters.module.scss';

interface DesignationFiltersProps {
  filters: FiltersType;
  onFilterChange: <K extends keyof FiltersType>(key: K, value: FiltersType[K]) => void;
  onReset: () => void;
  resultCount: number;
}

export const DesignationFilters = ({ filters, onFilterChange, onReset, resultCount }: DesignationFiltersProps) => {
  const hasActiveFilters = Object.values(filters).some((value) => value !== '' && value !== 'All');

  return (
    <Box className={styles.filtersContainer}>
      <TextField
        placeholder="Search designations..."
        value={filters.search}
        onChange={(event) => onFilterChange('search', event.target.value)}
        size="small"
        className={styles.searchInput}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" />
            </InputAdornment>
          ),
          endAdornment: filters.search ? (
            <InputAdornment position="end">
              <ClearIcon fontSize="small" onClick={() => onFilterChange('search', '')} sx={{ cursor: 'pointer' }} />
            </InputAdornment>
          ) : null,
        }}
      />

      <FormControl size="small" className={styles.filterItem}>
        <InputLabel>Department</InputLabel>
        <Select value={filters.department} label="Department" onChange={(event) => onFilterChange('department', event.target.value)}>
          {DESIGNATION_DEPARTMENTS.map((department) => (
            <MenuItem key={department} value={department}>
              {department}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl size="small" className={styles.filterItem}>
        <InputLabel>Level</InputLabel>
        <Select value={filters.level} label="Level" onChange={(event) => onFilterChange('level', event.target.value)}>
          <MenuItem value="All">All Levels</MenuItem>
          {DESIGNATION_LEVELS.map((level) => (
            <MenuItem key={level} value={level}>
              {level}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl size="small" className={styles.filterItem}>
        <InputLabel>Status</InputLabel>
        <Select value={filters.status} label="Status" onChange={(event) => onFilterChange('status', event.target.value)}>
          {DESIGNATION_STATUSES.map((status) => (
            <MenuItem key={status} value={status}>
              {status}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Stack direction="row" spacing={1} alignItems="center" className={styles.filtersEnd}>
        {hasActiveFilters && <Chip label="Clear all" onClick={onReset} size="small" color="primary" variant="outlined" />}
        <Chip label={`${resultCount} designations`} variant="outlined" size="small" />
      </Stack>
    </Box>
  );
};
