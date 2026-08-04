import React, { useCallback } from 'react';
import { Alert, Box, Button, Checkbox, FormControlLabel, Paper, Stack, Typography } from '@mui/material';
import { WarningAmber as WarningIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAllocationForm } from '../../hooks/useAllocationForm';
import { AllocationDetails } from '../AllocationDetails/AllocationDetails';
import { CapacityPreview } from '../CapacityPreview/CapacityPreview';
import { EmployeeSelector } from '../EmployeeSelector/EmployeeSelector';
import styles from './AllocationFormPage.module.scss';

export const AllocationFormPage = () => {
  const navigate = useNavigate();
  const { values, errors, saving, employees, projects, capacityPreview, updateField, saveAllocation } =
    useAllocationForm({
      employeeId: 'EMP-001',
      projectId: 'PRJ-001',
      role: 'Senior Developer',
      allocationPercentage: 30,
      startDate: '2025-07-15',
      endDate: '2025-08-15',
      billability: 'Billable',
    });
  const isOverallocated = capacityPreview.projectedAllocation > 100;

  const handleSave = useCallback(async () => {
    const result = await saveAllocation();
    if (result) navigate('/allocations');
  }, [navigate, saveAllocation]);

  return (
    <Box className={styles.page}>
      <Box className={styles.content}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'stretch', sm: 'flex-start' }}
          spacing={2}
          className={styles.header}
        >
          <Box>
            <Typography variant="h4" className={styles.title}>
              Create Allocation
            </Typography>
            <Typography variant="body2" className={styles.subtitle}>
              Assign an employee to a project with capacity and billability configuration.
            </Typography>
          </Box>
        </Stack>

        {isOverallocated && (
          <Paper elevation={0} className={styles.topWarning}>
            <Stack direction="row" spacing={1.25} alignItems="flex-start">
              <WarningIcon fontSize="small" />
              <Box>
                <Typography className={styles.warningTitle}>Over-allocation Detected</Typography>
                <Typography variant="body2">
                  This allocation will result in <strong>130% total allocation</strong> for Neha Joshi.
                  Authorized users may override with a mandatory reason.
                </Typography>
                <FormControlLabel
                  control={<Checkbox size="small" />}
                  label="I understand and want to override this allocation"
                  className={styles.overrideCheck}
                />
              </Box>
            </Stack>
          </Paper>
        )}

        <Stack spacing={1.5}>
          {errors.map((error) => (
            <Alert severity="error" key={error}>{error}</Alert>
          ))}
        </Stack>

        <Box className={styles.formGrid}>
          <EmployeeSelector
            employees={employees}
            value={values.employeeId}
            onChange={(employeeId) => updateField('employeeId', employeeId)}
          />
          <AllocationDetails values={values} projects={projects} onChange={updateField} />
        </Box>

        <CapacityPreview preview={capacityPreview} />
      </Box>

      <Paper elevation={0} className={styles.footerBar}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'stretch', sm: 'center' }}
          spacing={2}
        >
          <Stack direction="row" spacing={1} alignItems="center" className={styles.footerWarning}>
            <WarningIcon fontSize="small" />
            <Typography variant="body2">Over-allocation: 130% - Override required to save.</Typography>
          </Stack>
          <Stack direction="row" spacing={1.5} justifyContent="flex-end">
            <Button variant="outlined" className={styles.footerButton} onClick={() => navigate('/allocations')}>
              Cancel
            </Button>
            <Button variant="outlined" className={styles.footerButton}>
              Validate Only
            </Button>
            <Button variant="contained" className={styles.createButton} onClick={handleSave} disabled={saving}>
              Create Allocation
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Box>
  );
};

export default AllocationFormPage;
