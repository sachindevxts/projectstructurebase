import React from 'react';
import { FormControl, Grid, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { EMPLOYEE_DEPARTMENTS, EMPLOYEE_TYPES } from '../../constants/employeeForm.constants';
import type { EmployeeFormValues } from '../../types/employeeForm.types';
import styles from './EmploymentInfo.module.scss';

interface EmploymentInfoProps {
  values: EmployeeFormValues;
  onChange: <K extends keyof EmployeeFormValues>(key: K, value: EmployeeFormValues[K]) => void;
}

export const EmploymentInfo = ({ values, onChange }: EmploymentInfoProps) => (
  <Grid container spacing={2} className={styles.section}>
    <Grid item xs={12} md={6}>
      <FormControl fullWidth>
        <InputLabel>Department</InputLabel>
        <Select value={values.department} label="Department" onChange={(event) => onChange('department', event.target.value)}>
          {EMPLOYEE_DEPARTMENTS.map((department) => <MenuItem key={department} value={department}>{department}</MenuItem>)}
        </Select>
      </FormControl>
    </Grid>
    <Grid item xs={12} md={6}>
      <TextField label="Designation" value={values.designation} onChange={(event) => onChange('designation', event.target.value)} required fullWidth />
    </Grid>
    <Grid item xs={12} md={6}>
      <TextField label="Manager" value={values.manager} onChange={(event) => onChange('manager', event.target.value)} fullWidth />
    </Grid>
    <Grid item xs={12} md={3}>
      <FormControl fullWidth>
        <InputLabel>Type</InputLabel>
        <Select value={values.type} label="Type" onChange={(event) => onChange('type', event.target.value as EmployeeFormValues['type'])}>
          {EMPLOYEE_TYPES.map((type) => <MenuItem key={type} value={type}>{type}</MenuItem>)}
        </Select>
      </FormControl>
    </Grid>
    <Grid item xs={12} md={3}>
      <TextField label="Joined" value={values.joined} onChange={(event) => onChange('joined', event.target.value)} fullWidth />
    </Grid>
  </Grid>
);

