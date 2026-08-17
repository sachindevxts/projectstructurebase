import React from 'react';
import { Box, Button, IconButton, Paper, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { useResourcePlanner } from '../../hooks/useResourcePlanner';
import { PlannerFilters } from '../PlannerFilters/PlannerFilters';
import { PlannerTimeline } from '../PlannerTimeline/PlannerTimeline';
import { useAppSelector } from '@/hooks';
import { hasPermission } from '@/utils/permission.utils';
import styles from './ResourcePlannerPage.module.scss';

export const ResourcePlannerPage = () => {
  const user = useAppSelector((state) => state.auth.user);
  const canCreateAllocation = hasPermission(user, ['allocations:create']);
  const { filteredAllocations, filters, loading, updateFilter, resetFilters } = useResourcePlanner();

  return (
    <Box className={styles.page}>
      <Paper elevation={0} className={styles.plannerShell}>
        <Box className={styles.toolbar}>
          <Box className={styles.toolbarLeft}>
            <Typography variant="h6" className={styles.title}>
              Resource Planner
            </Typography>
            <ToggleButtonGroup value="month" exclusive size="small" className={styles.segmented}>
              <ToggleButton value="month">Month</ToggleButton>
              <ToggleButton value="week">Week</ToggleButton>
              <ToggleButton value="day">Day</ToggleButton>
            </ToggleButtonGroup>
            <ToggleButtonGroup value="employee" exclusive size="small" className={styles.segmented}>
              <ToggleButton value="employee">By Employee</ToggleButton>
              <ToggleButton value="project">By Project</ToggleButton>
              <ToggleButton value="heatmap">Heatmap</ToggleButton>
            </ToggleButtonGroup>
          </Box>

          <Box className={styles.monthControls}>
            <IconButton size="small" className={styles.navButton}>
              <ChevronLeft fontSize="small" />
            </IconButton>
            <Typography variant="body2" className={styles.monthLabel}>
              July 2025
            </Typography>
            <IconButton size="small" className={styles.navButton}>
              <ChevronRight fontSize="small" />
            </IconButton>
            <Button variant="outlined" className={styles.todayButton}>
              Today
            </Button>
          </Box>

          <Box className={styles.filtersRow}>
            <PlannerFilters
              filters={filters}
              onFilterChange={updateFilter}
              onReset={resetFilters}
              resultCount={filteredAllocations.length}
              canCreateAllocation={canCreateAllocation}
            />
          </Box>
        </Box>

        <PlannerTimeline allocations={filteredAllocations} loading={loading} />
      </Paper>
    </Box>
  );
};

export default ResourcePlannerPage;

