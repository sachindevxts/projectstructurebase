import React from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { CheckCircle as CheckCircleIcon, Info as InfoIcon, WarningAmber as WarningIcon } from '@mui/icons-material';
import { ALLOCATION_ROLES, BILLABILITY_OPTIONS } from '../../constants/allocationForm.constants';
import type { AllocationFormProject, AllocationFormValues } from '../../types/allocationForm.types';
import styles from './AllocationDetails.module.scss';

interface AllocationDetailsProps {
  values: AllocationFormValues;
  projects: AllocationFormProject[];
  onChange: <K extends keyof AllocationFormValues>(key: K, value: AllocationFormValues[K]) => void;
}

export const AllocationDetails = ({ values, projects, onChange }: AllocationDetailsProps) => {
  const selectedProject = projects.find((project) => project.id === values.projectId) ?? projects[0];

  return (
    <Stack spacing={2.5}>
      <Paper elevation={0} className={styles.card}>
        <Typography variant="h6" className={styles.title}>Project</Typography>
        <Paper elevation={0} className={styles.projectCard}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
            <Box>
              <Typography className={styles.projectName}>{selectedProject?.name}</Typography>
              <Typography variant="body2" className={styles.projectMeta}>
                {selectedProject?.client} - PM: {selectedProject?.manager} - {selectedProject?.status}
              </Typography>
              <Typography variant="caption" className={styles.projectDates}>
                May 1 - Aug 15, 2025 - 12 members
              </Typography>
            </Box>
            <CheckCircleIcon className={styles.projectCheck} />
          </Stack>
        </Paper>
      </Paper>

      <Paper elevation={0} className={styles.card}>
        <Typography variant="h6" className={styles.title}>Allocation Details</Typography>
        <Box className={styles.formGrid}>
          <FormControl size="small" fullWidth>
            <InputLabel>Project Role *</InputLabel>
            <Select
              value={values.role}
              label="Project Role *"
              onChange={(event) => onChange('role', event.target.value)}
            >
              {ALLOCATION_ROLES.map((role) => (
                <MenuItem key={role} value={role}>{role}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            size="small"
            label="Allocation % *"
            type="number"
            value={values.allocationPercentage}
            onChange={(event) => onChange('allocationPercentage', Number(event.target.value))}
            fullWidth
          />

          <TextField
            size="small"
            label="Start Date *"
            type="date"
            value={values.startDate}
            onChange={(event) => onChange('startDate', event.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />

          <TextField
            size="small"
            label="End Date *"
            type="date"
            value={values.endDate}
            onChange={(event) => onChange('endDate', event.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />

          <FormControl size="small" fullWidth>
            <InputLabel>Billability</InputLabel>
            <Select
              value={values.billability}
              label="Billability"
              onChange={(event) => onChange('billability', event.target.value as AllocationFormValues['billability'])}
            >
              {BILLABILITY_OPTIONS.map((option) => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField size="small" label="Hours/Week" value="24" fullWidth />
        </Box>
        <TextField
          label="Notes"
          value={values.notes}
          onChange={(event) => onChange('notes', event.target.value)}
          multiline
          rows={3}
          placeholder="Optional allocation notes..."
          className={styles.notes}
          fullWidth
        />
      </Paper>

      <Paper elevation={0} className={styles.overrideBox}>
        <Stack direction="row" spacing={1} alignItems="center" className={styles.overrideTitle}>
          <WarningIcon fontSize="small" />
          <Typography>Override Required</Typography>
        </Stack>
        <Typography variant="body2" className={styles.overrideCopy}>
          This employee will be at 130% allocation. Please provide a mandatory reason to proceed.
        </Typography>
        <TextField
          label="Override Reason *"
          multiline
          rows={3}
          placeholder="Explain why over-allocation is necessary..."
          fullWidth
          className={styles.overrideInput}
        />
        <Stack direction="row" spacing={0.75} alignItems="center" className={styles.auditHint}>
          <InfoIcon fontSize="inherit" />
          <Typography variant="caption">This override will be recorded in the audit log.</Typography>
        </Stack>
      </Paper>
    </Stack>
  );
};
