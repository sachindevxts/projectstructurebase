import React from 'react';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { useResourcePlanner } from '../../hooks/useResourcePlanner';
import { PlannerFilters } from '../PlannerFilters/PlannerFilters';
import { PlannerTimeline } from '../PlannerTimeline/PlannerTimeline';
import { useAppSelector } from '@/hooks';
import { hasPermission } from '@/utils/permission.utils';
import { useAllocationForm } from '@/features/AllocationForm/hooks/useAllocationForm';
import type { PlannerGroupBy, PlannerViewMode } from '../../types/planner.types';
import styles from './ResourcePlannerPage.module.scss';

export const ResourcePlannerPage = () => {
  const user = useAppSelector((state) => state.auth.user);
  const canCreateAllocation = hasPermission(user, ['allocations:create']);
  const {
    filteredAllocations,
    filters,
    filterOptions,
    viewMode,
    groupBy,
    anchorDate,
    visibleRange,
    loading,
    updateFilter,
    resetFilters,
    loadPlanner,
    setViewMode,
    setGroupBy,
    movePeriod,
    goToday,
  } = useResourcePlanner();
  const {
    values,
    errors,
    saving,
    employees,
    projects,
    updateField,
    saveAllocation,
  } = useAllocationForm();
  const [allocationDialogOpen, setAllocationDialogOpen] = React.useState(false);

  const periodLabel = React.useMemo(() => {
    if (viewMode === 'day') {
      return anchorDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
    if (viewMode === 'week') {
      const start = new Date(`${visibleRange.startDate}T00:00:00`);
      const end = new Date(`${visibleRange.endDate}T00:00:00`);
      return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    }
    return anchorDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }, [anchorDate, viewMode, visibleRange]);

  const handleCreateAllocation = async () => {
    const result = await saveAllocation();
    if (!result) return;
    setAllocationDialogOpen(false);
    await loadPlanner();
  };

  return (
    <Box className={styles.page}>
      <Paper elevation={0} className={styles.plannerShell}>
        <Box className={styles.toolbar}>
          <Box className={styles.toolbarLeft}>
            <Typography variant="h6" className={styles.title}>
              Resource Planner
            </Typography>
            <ToggleButtonGroup
              value={viewMode}
              exclusive
              size="small"
              className={styles.segmented}
              onChange={(_, value: PlannerViewMode | null) => value && setViewMode(value)}
            >
              <ToggleButton value="month">Month</ToggleButton>
              <ToggleButton value="week">Week</ToggleButton>
              <ToggleButton value="day">Day</ToggleButton>
            </ToggleButtonGroup>
            <ToggleButtonGroup
              value={groupBy}
              exclusive
              size="small"
              className={styles.segmented}
              onChange={(_, value: PlannerGroupBy | null) => value && setGroupBy(value)}
            >
              <ToggleButton value="employee">By Employee</ToggleButton>
              <ToggleButton value="project">By Project</ToggleButton>
              <ToggleButton value="heatmap">Heatmap</ToggleButton>
            </ToggleButtonGroup>
          </Box>

          <Box className={styles.monthControls}>
            <IconButton size="small" className={styles.navButton} onClick={() => movePeriod(-1)}>
              <ChevronLeft fontSize="small" />
            </IconButton>
            <Typography variant="body2" className={styles.monthLabel}>
              {periodLabel}
            </Typography>
            <IconButton size="small" className={styles.navButton} onClick={() => movePeriod(1)}>
              <ChevronRight fontSize="small" />
            </IconButton>
            <Button variant="outlined" className={styles.todayButton} onClick={goToday}>
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
              departments={filterOptions.departments}
              skills={filterOptions.skills}
              statuses={filterOptions.statuses}
              onAddAllocation={() => setAllocationDialogOpen(true)}
            />
          </Box>
        </Box>

        <PlannerTimeline
          allocations={filteredAllocations}
          loading={loading}
          viewMode={viewMode}
          groupBy={groupBy}
          visibleRange={visibleRange}
        />
      </Paper>

      <Dialog open={allocationDialogOpen} onClose={() => !saving && setAllocationDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add allocation</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            {errors.map((error) => <Alert key={error} severity="error">{error}</Alert>)}
            <FormControl fullWidth>
              <InputLabel id="planner-employee-label">Employee</InputLabel>
              <Select
                labelId="planner-employee-label"
                label="Employee"
                value={values.employeeId}
                onChange={(event) => updateField('employeeId', event.target.value)}
              >
                {employees.map((employee) => (
                  <MenuItem key={employee.id} value={employee.id}>
                    {employee.name} - {employee.department}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel id="planner-project-label">Project</InputLabel>
              <Select
                labelId="planner-project-label"
                label="Project"
                value={values.projectId}
                onChange={(event) => updateField('projectId', event.target.value)}
              >
                {projects.map((project) => (
                  <MenuItem key={project.id} value={project.id}>
                    {project.name} - {project.client}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                label="Role"
                value={values.role}
                onChange={(event) => updateField('role', event.target.value)}
                fullWidth
              />
              <TextField
                label="Allocation %"
                type="number"
                value={values.allocationPercentage}
                onChange={(event) => updateField('allocationPercentage', Number(event.target.value))}
                fullWidth
              />
            </Stack>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                label="Start date"
                type="date"
                value={values.startDate}
                onChange={(event) => updateField('startDate', event.target.value)}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
              <TextField
                label="End date"
                type="date"
                value={values.endDate}
                onChange={(event) => updateField('endDate', event.target.value)}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            </Stack>
            <FormControl fullWidth>
              <InputLabel id="planner-billability-label">Billability</InputLabel>
              <Select
                labelId="planner-billability-label"
                label="Billability"
                value={values.billability}
                onChange={(event) => updateField('billability', event.target.value as typeof values.billability)}
              >
                <MenuItem value="Billable">Billable</MenuItem>
                <MenuItem value="Non-Billable">Non-Billable</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAllocationDialogOpen(false)} disabled={saving}>Cancel</Button>
          <Button variant="contained" onClick={handleCreateAllocation} disabled={saving}>
            {saving ? 'Saving...' : 'Create allocation'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ResourcePlannerPage;

