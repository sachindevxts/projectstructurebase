import React from 'react';
import {
  Box,
  Button,
  Chip,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from '@mui/material';
import { Clear as ClearIcon, Search as SearchIcon } from '@mui/icons-material';
import type { EmployeeFilters as EmployeeFiltersType } from '../../types/employee.types';
import styles from './EmployeeFilters.module.scss';

interface EmployeeFiltersProps {
  filters: EmployeeFiltersType;
  onFilterChange: (key: keyof EmployeeFiltersType, value: string) => void;
  onReset: () => void;
  resultCount?: number;
}

export const EmployeeFilters = ({
  filters,
  onFilterChange,
  onReset,
}: EmployeeFiltersProps) => {
  const departments = ['All', 'Engineering', 'QA', 'Design', 'HR', 'Delivery'];
  const designations = [
    'All',
    'Senior React Developer',
    'Backend Engineer',
    'QA Lead',
    'Java Developer',
    'UI/UX Designer',
  ];
  const statuses = ['All', 'Active', 'Inactive', 'On Leave', 'Overallocated', 'Releasing Soon'];
  const billabilities = ['All', 'Billable', 'Non-Billable'];
  const employmentTypes = ['All', 'Full-Time', 'Contract', 'Part-Time'];
  const activeFilters = [
    { key: 'department', label: filters.department },
    { key: 'designation', label: filters.designation },
    { key: 'status', label: filters.status },
    { key: 'billability', label: filters.billability },
    { key: 'employmentType', label: filters.employmentType },
  ].filter((filter) => filter.label && filter.label !== 'All');
  const hasActiveFilters = activeFilters.length > 0 || Boolean(filters.search);

  return (
    <Box className={styles.filtersContainer}>
      <Box className={styles.filterControls}>
        <TextField
          placeholder="Search name, email or ID..."
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
            endAdornment: filters.search && (
              <InputAdornment position="end">
                <ClearIcon
                  fontSize="small"
                  onClick={() => onFilterChange('search', '')}
                  sx={{ cursor: 'pointer' }}
                />
              </InputAdornment>
            ),
          }}
        />

        <FormControl size="small" className={styles.filterItem}>
          <InputLabel>Department</InputLabel>
          <Select
            value={filters.department}
            label="Department"
            sx={{minWidth : 150}}
            onChange={(event) => onFilterChange('department', event.target.value)}
          >
            {departments.map((department) => (
              <MenuItem key={department} value={department}>{department}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" className={styles.filterItem}>
          <InputLabel>Designation</InputLabel>
          <Select
            value={filters.designation}
            label="Designation"
            sx={{minWidth : 150}}
            onChange={(event) => onFilterChange('designation', event.target.value)}
          >
            {designations.map((designation) => (
              <MenuItem key={designation} value={designation}>{designation}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" className={styles.filterItem}>
          <InputLabel>Status</InputLabel>
          <Select
            value={filters.status}
            label="Status"
            sx={{minWidth : 150}}
            onChange={(event) => onFilterChange('status', event.target.value)}
          >
            {statuses.map((status) => (
              <MenuItem key={status} value={status}>{status}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" className={styles.filterItem}>
          <InputLabel>Billability</InputLabel>
          <Select
            value={filters.billability}
            label="Billability"
            sx={{minWidth : 150}}
            onChange={(event) => onFilterChange('billability', event.target.value)}
          >
            {billabilities.map((billability) => (
              <MenuItem key={billability} value={billability}>{billability}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" className={styles.filterItem}>
          <InputLabel>Employment Type</InputLabel>
          <Select
            value={filters.employmentType}
            label="Employment Type"
            sx={{minWidth : 150}}
            onChange={(event) => onFilterChange('employmentType', event.target.value)}
          >
            {employmentTypes.map((type) => (
              <MenuItem key={type} value={type}>{type}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Stack direction="row" spacing={1} alignItems="center" className={styles.activeFilters}>
        {hasActiveFilters && (
          <Button variant="text" onClick={onReset} className={styles.clearButton}>
            Clear all
          </Button>
        )}
        {activeFilters.map((filter) => (
          <Chip
            key={filter.key}
            label={filter.label}
            size="small"
            onDelete={() => onFilterChange(filter.key as keyof EmployeeFiltersType, 'All')}
            className={styles.filterChip}
          />
        ))}
      </Stack>
    </Box>
  );
};

