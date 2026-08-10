import React from 'react';
import {
  Box,
  Chip,
  InputAdornment,
  TextField,
  Stack,
} from '@mui/material';
import { Search as SearchIcon, Clear as ClearIcon } from '@mui/icons-material';
import styles from './AllocationFilters.module.scss';

interface AllocationFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  resultCount: number;
}

export const AllocationFilters = ({
  search,
  onSearchChange,
  resultCount,
}: AllocationFiltersProps) => {
  return (
    <Box className={styles.filtersContainer}>
      <TextField
        placeholder="Search employee or project..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        size="small"
        className={styles.searchInput}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" />
            </InputAdornment>
          ),
          endAdornment: search && (
            <InputAdornment position="end">
              <ClearIcon
                fontSize="small"
                onClick={() => onSearchChange('')}
                sx={{ cursor: 'pointer' }}
              />
            </InputAdornment>
          ),
        }}
      />

      <Stack direction="row" spacing={1} alignItems="center" className={styles.filtersEnd}>
        <Chip label={`${resultCount} allocations`} variant="outlined" size="small" />
      </Stack>
    </Box>
  );
};
