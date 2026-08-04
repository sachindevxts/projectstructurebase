import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  InputAdornment,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import {
  Add as AddIcon,
  Download as DownloadIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useBench } from '../../Hooks/useBench';
import { BenchChart } from '../BenchChart/BenchChart';
import { BenchStats } from '../BenchStats/BenchStats';
import { BenchTable } from '../BenchTable/BenchTable';
import styles from './BenchPage.module.scss';

export const BenchPage = () => {
  const navigate = useNavigate();
  const { employees, loading, stats, skills } = useBench();
  const [search, setSearch] = useState('');

  const filteredEmployees = employees.filter((employee) =>
    employee.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <Box className={styles.page}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'stretch', sm: 'flex-start' }}
        spacing={2}
        className={styles.header}
      >
        <Box>
          <Typography variant="h4" className={styles.title}>
            Bench & Availability
          </Typography>
          <Typography variant="body2" className={styles.subtitle}>
            Monitor available capacity, bench strength, and upcoming releases
          </Typography>
        </Box>
        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <Button variant="outlined" startIcon={<DownloadIcon />} className={styles.outlineButton}>
            Export
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            className={styles.primaryButton}
            onClick={() => navigate('/allocations/new')}
          >
            Create Allocation
          </Button>
        </Stack>
      </Stack>

      <BenchStats stats={stats} />

      <Box className={styles.controlsGrid}>
        <Paper elevation={0} className={styles.filtersCard}>
          <Stack direction="row" spacing={1.5} alignItems="flex-end" className={styles.filters}>
            <TextField
              placeholder="Search available employees."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              size="small"
              className={styles.search}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
            <Box className={styles.filterItem}>
              <Typography variant="caption">Dept</Typography>
              <FormControl size="small" fullWidth>
                <Select value="All">
                  <MenuItem value="All">All</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box className={styles.filterItem}>
              <Typography variant="caption">Skill</Typography>
              <FormControl size="small" fullWidth>
                <Select value="All">
                  <MenuItem value="All">All</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box className={styles.filterItem}>
              <Typography variant="caption">Availability</Typography>
              <FormControl size="small" fullWidth>
                <Select value="All">
                  <MenuItem value="All">All</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box className={styles.filterItem}>
              <Typography variant="caption">Bench Duration</Typography>
              <FormControl size="small" fullWidth>
                <Select value="All">
                  <MenuItem value="All">All</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Button variant="text" className={styles.clearButton}>Clear</Button>
          </Stack>
        </Paper>
        <BenchChart skills={skills} />
      </Box>

      <BenchTable employees={filteredEmployees} loading={loading} />
    </Box>
  );
};

export default BenchPage;
