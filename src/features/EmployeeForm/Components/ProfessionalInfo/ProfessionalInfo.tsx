import React, { useMemo } from 'react';
import { FormControl, Grid, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { EMPLOYEE_BILLABILITY, EMPLOYEE_STATUSES } from '../../constants/employeeForm.constants';
import type { EmployeeFormValues } from '../../types/employeeForm.types';
import styles from './ProfessionalInfo.module.scss';

interface ProfessionalInfoProps {
  values: EmployeeFormValues;
  onChange: <K extends keyof EmployeeFormValues>(key: K, value: EmployeeFormValues[K]) => void;
}

export const ProfessionalInfo = ({ values, onChange }: ProfessionalInfoProps) => {
  const skillsValue = useMemo(() => values.skills.join(', '), [values.skills]);

  return (
    <Grid container spacing={2} className={styles.section}>
      <Grid item xs={12} md={4}>
        <TextField label="Allocation %" type="number" value={values.allocation} onChange={(event) => onChange('allocation', Number(event.target.value))} fullWidth />
      </Grid>
      <Grid item xs={12} md={4}>
        <FormControl fullWidth>
          <InputLabel>Billability</InputLabel>
          <Select value={values.billability} label="Billability" onChange={(event) => onChange('billability', event.target.value as EmployeeFormValues['billability'])}>
            {EMPLOYEE_BILLABILITY.map((option) => <MenuItem key={option} value={option}>{option}</MenuItem>)}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} md={4}>
        <FormControl fullWidth>
          <InputLabel>Status</InputLabel>
          <Select value={values.status} label="Status" onChange={(event) => onChange('status', event.target.value as EmployeeFormValues['status'])}>
            {EMPLOYEE_STATUSES.map((status) => <MenuItem key={status} value={status}>{status}</MenuItem>)}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Skills"
          helperText="Separate skills with commas"
          value={skillsValue}
          onChange={(event) => onChange('skills', event.target.value.split(',').map((skill) => skill.trim()).filter(Boolean))}
          fullWidth
        />
      </Grid>
    </Grid>
  );
};

