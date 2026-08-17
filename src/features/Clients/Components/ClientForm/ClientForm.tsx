import React, { useState } from 'react';
import { Box, Button, FormControl, InputLabel, MenuItem, Select, Stack, TextField } from '@mui/material';
import { CLIENT_HEALTH_OPTIONS, CLIENT_INDUSTRIES } from '../../constants/client.constants';
import type { Client } from '../../types/client.types';
import styles from './ClientForm.module.scss';

interface ClientFormProps {
  initialValue?: Client;
  onSubmit: (client: Omit<Client, 'id'>) => void | Promise<void>;
  onCancel?: () => void;
  submitting?: boolean;
}

const emptyClient: Omit<Client, 'id'> = {
  name: '',
  industry: 'Technology',
  accountManager: '',
  projects: 0,
  activeProjects: 0,
  employeesAllocated: 0,
  revenue: 0,
  status: 'Active',
  health: 'Healthy',
  location: '',
  startDate: new Date().toISOString().split('T')[0],
};

export const ClientForm = ({ initialValue, onSubmit, onCancel, submitting = false }: ClientFormProps) => {
  const [form, setForm] = useState<Omit<Client, 'id'>>(
    initialValue
      ? {
          ...initialValue,
          startDate: new Date(initialValue.startDate).toISOString().split('T')[0],
        }
      : emptyClient,
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onSubmit(form);
  };

  return (
    <Box component="form" className={styles.form} onSubmit={handleSubmit}>
      <TextField label="Client Name" value={form.name} onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))} required fullWidth />
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
        <FormControl fullWidth>
          <InputLabel>Industry</InputLabel>
          <Select value={form.industry} label="Industry" onChange={(event) => setForm((prev) => ({ ...prev, industry: event.target.value }))}>
            {CLIENT_INDUSTRIES.filter((industry) => industry !== 'All').map((industry) => <MenuItem key={industry} value={industry}>{industry}</MenuItem>)}
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel>Health</InputLabel>
          <Select value={form.health} label="Health" onChange={(event) => setForm((prev) => ({ ...prev, health: event.target.value as Client['health'] }))}>
            {CLIENT_HEALTH_OPTIONS.filter((health) => health !== 'All').map((health) => <MenuItem key={health} value={health}>{health}</MenuItem>)}
          </Select>
        </FormControl>
      </Stack>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
        <TextField label="Account Manager" value={form.accountManager} onChange={(event) => setForm((prev) => ({ ...prev, accountManager: event.target.value }))} required fullWidth />
        <TextField label="Location" value={form.location} onChange={(event) => setForm((prev) => ({ ...prev, location: event.target.value }))} fullWidth />
      </Stack>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
        <FormControl fullWidth>
          <InputLabel>Status</InputLabel>
          <Select value={form.status} label="Status" onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value as Client['status'] }))}>
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Inactive">Inactive</MenuItem>
          </Select>
        </FormControl>
        <TextField label="Start Date" type="date" value={form.startDate} onChange={(event) => setForm((prev) => ({ ...prev, startDate: event.target.value }))} required fullWidth InputLabelProps={{ shrink: true }} />
      </Stack>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
        <TextField label="Projects" type="number" value={form.projects} onChange={(event) => setForm((prev) => ({ ...prev, projects: Number(event.target.value) }))} fullWidth />
        <TextField label="Active Projects" type="number" value={form.activeProjects} onChange={(event) => setForm((prev) => ({ ...prev, activeProjects: Number(event.target.value) }))} fullWidth />
        <TextField label="Allocated Employees" type="number" value={form.employeesAllocated} onChange={(event) => setForm((prev) => ({ ...prev, employeesAllocated: Number(event.target.value) }))} fullWidth />
      </Stack>
      <TextField label="Revenue" type="number" value={form.revenue} onChange={(event) => setForm((prev) => ({ ...prev, revenue: Number(event.target.value) }))} fullWidth />
      <Stack direction="row" spacing={1} justifyContent="flex-end">
        {onCancel && <Button onClick={onCancel}>Cancel</Button>}
        <Button type="submit" variant="contained" disabled={submitting}>
          {submitting ? 'Saving...' : 'Save Client'}
        </Button>
      </Stack>
    </Box>
  );
};

