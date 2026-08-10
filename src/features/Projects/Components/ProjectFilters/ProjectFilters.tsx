import React from 'react';
import {
  Box,
  Chip,
  InputAdornment,
  TextField,
  Stack,
} from '@mui/material';
import { Search as SearchIcon, Clear as ClearIcon } from '@mui/icons-material';
import styles from './ProjectFilters.module.scss';

interface ProjectFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  resultCount: number;
}

export const ProjectFilters = ({
  search,
  onSearchChange,
  resultCount,
}: ProjectFiltersProps) => {
  return (
    <Box className={styles.filtersContainer}>
      <TextField
        placeholder="Search projects..."
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
        <Chip label={`${resultCount} projects`} variant="outlined" size="small" />
      </Stack>
    </Box>
  );
};
