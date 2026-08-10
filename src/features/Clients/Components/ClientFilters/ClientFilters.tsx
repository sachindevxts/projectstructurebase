import React from 'react';
import { Box, Chip, FormControl, InputAdornment, InputLabel, MenuItem, Select, Stack, TextField } from '@mui/material';
import { Clear as ClearIcon, Search as SearchIcon } from '@mui/icons-material';
import { CLIENT_HEALTH_OPTIONS, CLIENT_INDUSTRIES, CLIENT_STATUSES } from '../../constants/client.constants';
import type { ClientFilters as FiltersType } from '../../types/client.types';
import styles from './ClientFilters.module.scss';

interface ClientFiltersProps {
  filters: FiltersType;
  onFilterChange: <K extends keyof FiltersType>(key: K, value: FiltersType[K]) => void;
  onReset: () => void;
  resultCount: number;
}

export const ClientFilters = ({ filters, onFilterChange, onReset, resultCount }: ClientFiltersProps) => {
  const hasActiveFilters = Object.values(filters).some((value) => value !== '' && value !== 'All');

  return (
    <Box className={styles.filtersContainer}>
      <TextField
        placeholder="Search clients..."
        value={filters.search}
        onChange={(event) => onFilterChange('search', event.target.value)}
        size="small"
        className={styles.searchInput}
        InputProps={{
          startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment>,
          endAdornment: filters.search ? <InputAdornment position="end"><ClearIcon fontSize="small" onClick={() => onFilterChange('search', '')} sx={{ cursor: 'pointer' }} /></InputAdornment> : null,
        }}
      />
      <FormControl size="small" className={styles.filterItem}>
        <InputLabel>Industry</InputLabel>
        <Select value={filters.industry} label="Industry" onChange={(event) => onFilterChange('industry', event.target.value)}>
          {CLIENT_INDUSTRIES.map((industry) => <MenuItem key={industry} value={industry}>{industry}</MenuItem>)}
        </Select>
      </FormControl>
      <FormControl size="small" className={styles.filterItem}>
        <InputLabel>Status</InputLabel>
        <Select value={filters.status} label="Status" onChange={(event) => onFilterChange('status', event.target.value)}>
          {CLIENT_STATUSES.map((status) => <MenuItem key={status} value={status}>{status}</MenuItem>)}
        </Select>
      </FormControl>
      <FormControl size="small" className={styles.filterItem}>
        <InputLabel>Health</InputLabel>
        <Select value={filters.health} label="Health" onChange={(event) => onFilterChange('health', event.target.value)}>
          {CLIENT_HEALTH_OPTIONS.map((health) => <MenuItem key={health} value={health}>{health}</MenuItem>)}
        </Select>
      </FormControl>
      <Stack direction="row" spacing={1} alignItems="center" className={styles.filtersEnd}>
        {hasActiveFilters && <Chip label="Clear all" onClick={onReset} size="small" color="primary" variant="outlined" />}
        <Chip label={`${resultCount} clients`} variant="outlined" size="small" />
      </Stack>
    </Box>
  );
};

