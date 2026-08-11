import React from 'react';
import {
  Box,
  Button,
  Chip,
  InputAdornment,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Stack,
  Paper,
} from '@mui/material';
import { Search as SearchIcon, Clear as ClearIcon } from '@mui/icons-material';
import { SKILL_CATEGORIES, DEMAND_LEVELS } from '../../Constants/skill.constants';
import styles from './SkillFilters.module.scss';

interface SkillFiltersProps {
  search: string;
  category: string;
  demand: string;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onDemandChange: (value: string) => void;
  onReset: () => void;
  resultCount: number;
}

export const SkillFilters = ({
  search,
  category,
  demand,
  onSearchChange,
  onCategoryChange,
  onDemandChange,
  onReset,
  resultCount,
}: SkillFiltersProps) => {
  return (
    <Box className={styles.filtersContainer}>
      <TextField
        placeholder="Search skill name..."
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

      <Stack direction="row" spacing={1} className={styles.categoryWrapper}>
        {SKILL_CATEGORIES.map((cat) => (
          <Chip
            key={cat}
            label={cat}
            onClick={() => onCategoryChange(cat)}
            color={category === cat ? 'primary' : 'default'}
            variant={category === cat ? 'filled' : 'outlined'}
            size="small"
            className={styles.categoryChip}
          />
        ))}
      </Stack>

      <Stack direction="row" spacing={1} alignItems="center" className={styles.filtersEnd}>
        <FormControl size="small" className={styles.demandSelect}>
          <InputLabel>Demand</InputLabel>
          <Select
            value={demand}
            label="Demand"
            onChange={(e) => onDemandChange(e.target.value)}
          >
            <MenuItem value="All Demand">All Demand</MenuItem>
            {DEMAND_LEVELS.map((level) => (
              <MenuItem key={level} value={`${level} Demand`}>{level} Demand</MenuItem>
            ))}
            <MenuItem value="Gap">Gap</MenuItem>
          </Select>
        </FormControl>
        
        {search && (
          <Button size="small" onClick={onReset} startIcon={<ClearIcon />}>
            Clear
          </Button>
        )}
        
        <Chip label={`${resultCount} skills`} variant="outlined" size="small" />
      </Stack>
    </Box>
  );
};
