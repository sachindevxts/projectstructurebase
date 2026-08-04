import React from 'react';
import { Grid, TextField } from '@mui/material';
import type { EmployeeFormValues } from '../../types/employeeForm.types';
import styles from './PersonalInfo.module.scss';

interface PersonalInfoProps {
  values: EmployeeFormValues;
  onChange: <K extends keyof EmployeeFormValues>(key: K, value: EmployeeFormValues[K]) => void;
}

export const PersonalInfo = ({ values, onChange }: PersonalInfoProps) => (
  <Grid container spacing={2} className={styles.section}>
    <Grid item xs={12} md={6}>
      <TextField label="Full Name" value={values.name} onChange={(event) => onChange('name', event.target.value)} required fullWidth />
    </Grid>
    <Grid item xs={12} md={6}>
      <TextField label="Email" value={values.email} onChange={(event) => onChange('email', event.target.value)} required fullWidth />
    </Grid>
    <Grid item xs={12} md={6}>
      <TextField label="Phone" value={values.phone} onChange={(event) => onChange('phone', event.target.value)} fullWidth />
    </Grid>
    <Grid item xs={12} md={6}>
      <TextField label="Location" value={values.location} onChange={(event) => onChange('location', event.target.value)} fullWidth />
    </Grid>
  </Grid>
);
