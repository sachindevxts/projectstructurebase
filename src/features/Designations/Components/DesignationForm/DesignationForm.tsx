import React, { useState } from 'react';
import { Box, Button, FormControl, InputLabel, MenuItem, Select, Stack, TextField } from '@mui/material';
import { DESIGNATION_DEPARTMENTS, DESIGNATION_LEVELS } from '../../constants/designation.constants';
import type { Designation } from '../../types/designation.types';
import styles from './DesignationForm.module.scss';

interface DesignationFormProps {
  initialValue?: Designation;
  onSubmit: (designation: Omit<Designation, 'id'>) => void;
  onCancel?: () => void;
}

const emptyDesignation: Omit<Designation, 'id'> = {
  name: '',
  department: 'Engineering',
  level: 'Mid-level',
  employees: 0,
  skills: [],
  status: 'Active',
  description: '',
};

export const DesignationForm = ({ initialValue, onSubmit, onCancel }: DesignationFormProps) => {
  const [form, setForm] = useState<Omit<Designation, 'id'>>(initialValue ?? emptyDesignation);
  const [skillsInput, setSkillsInput] = useState((initialValue?.skills ?? []).join(', '));

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit({
      ...form,
      employees: Number(form.employees),
      skills: skillsInput.split(',').map((skill) => skill.trim()).filter(Boolean),
    });
  };

  return (
    <Box component="form" className={styles.form} onSubmit={handleSubmit}>
      <TextField label="Designation Name" value={form.name} onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))} required fullWidth />
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
        <FormControl fullWidth>
          <InputLabel>Department</InputLabel>
          <Select value={form.department} label="Department" onChange={(event) => setForm((prev) => ({ ...prev, department: event.target.value }))}>
            {DESIGNATION_DEPARTMENTS.filter((department) => department !== 'All').map((department) => (
              <MenuItem key={department} value={department}>
                {department}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel>Level</InputLabel>
          <Select value={form.level} label="Level" onChange={(event) => setForm((prev) => ({ ...prev, level: event.target.value as Designation['level'] }))}>
            {DESIGNATION_LEVELS.map((level) => (
              <MenuItem key={level} value={level}>
                {level}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>
      <TextField label="Mapped Employees" type="number" value={form.employees} onChange={(event) => setForm((prev) => ({ ...prev, employees: Number(event.target.value) }))} fullWidth />
      <TextField label="Skills" helperText="Separate skills with commas" value={skillsInput} onChange={(event) => setSkillsInput(event.target.value)} fullWidth />
      <TextField label="Description" value={form.description} onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))} multiline rows={3} fullWidth />
      <Stack direction="row" spacing={1} justifyContent="flex-end">
        {onCancel && <Button onClick={onCancel}>Cancel</Button>}
        <Button type="submit" variant="contained">Save Designation</Button>
      </Stack>
    </Box>
  );
};

