import React from 'react';
import {
  Avatar,
  Box,
  Chip,
  InputAdornment,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import type { AllocationFormEmployee } from '../../types/allocationForm.types';
import styles from './EmployeeSelector.module.scss';

interface EmployeeSelectorProps {
  employees: AllocationFormEmployee[];
  value: string;
  onChange: (employeeId: string) => void;
}

const skillsByEmployee: Record<string, string[]> = {
  'EMP-001': ['React.js', 'TypeScript'],
  'EMP-013': ['React.js', 'Next.js'],
  'EMP-004': ['Java', 'Spring Boot'],
};

const availabilityLabel = (allocation: number) => `${Math.max(0, 100 - allocation)}%`;

const allocationNote = (employee: AllocationFormEmployee) => {
  if (employee.id === 'EMP-001') return 'NovaBank 70% - Internal 30% = 100% allocated';
  if (employee.id === 'EMP-013') return 'HealthBridge 50% - Available 50%';
  if (employee.id === 'EMP-004') return 'Available 100%';
  return `${employee.allocation}% allocated`;
};

export const EmployeeSelector = ({ employees, value, onChange }: EmployeeSelectorProps) => (
  <Paper elevation={0} className={styles.card}>
    <Typography variant="h6" className={styles.title}>
      Select Employee
    </Typography>
    <TextField
      size="small"
      placeholder="Search by name, skill, designation..."
      className={styles.search}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon fontSize="small" />
          </InputAdornment>
        ),
      }}
    />
    <Stack direction="row" spacing={1} className={styles.filters}>
      <Select size="small" value="All Skills" className={styles.filterSelect}>
        <MenuItem value="All Skills">All Skills</MenuItem>
      </Select>
      <Select size="small" value="All Dept." className={styles.filterSelect}>
        <MenuItem value="All Dept.">All Dept.</MenuItem>
      </Select>
      <Select size="small" value="Availability" className={styles.filterSelect}>
        <MenuItem value="Availability">Availability</MenuItem>
      </Select>
    </Stack>

    <Stack spacing={1.5} className={styles.employeeList}>
      {employees.slice(0, 3).map((employee) => {
        const selected = employee.id === value;
        return (
          <Paper
            key={employee.id}
            elevation={0}
            component="button"
            type="button"
            className={selected ? styles.employeeCardSelected : styles.employeeCard}
            onClick={() => onChange(employee.id)}
          >
            <Stack direction="row" spacing={1.5} alignItems="flex-start">
              <Avatar className={styles.avatar}>{employee.name.charAt(0)}</Avatar>
              <Box className={styles.employeeMain}>
                <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                  <Typography className={styles.employeeName}>{employee.name}</Typography>
                  <Chip
                    label={employee.id === 'EMP-004' ? 'Non-Billable' : 'Billable'}
                    size="small"
                    className={employee.id === 'EMP-004' ? styles.nonBillableChip : styles.billableChip}
                  />
                </Stack>
                <Typography variant="body2" className={styles.employeeMeta}>
                  {employee.designation.replace('Senior ', 'Sr. ')} - {employee.department}
                </Typography>
                <Stack direction="row" spacing={0.75} flexWrap="wrap" className={styles.skills}>
                  {(skillsByEmployee[employee.id] ?? ['React.js']).map((skill) => (
                    <Chip key={skill} label={skill} size="small" className={styles.skillChip} />
                  ))}
                </Stack>
              </Box>
              <Box className={employee.allocation >= 100 ? styles.availableBlue : styles.availableGreen}>
                <Typography>{availabilityLabel(employee.allocation)}</Typography>
                <span>Available</span>
              </Box>
            </Stack>
            <Box className={styles.capacityTrack}>
              <Box
                className={employee.allocation > 100 ? styles.capacityDanger : styles.capacityFill}
                sx={{ width: `${Math.min(employee.allocation, 100)}%` }}
              />
            </Box>
            <Typography variant="caption" className={styles.capacityNote}>
              {allocationNote(employee)}
            </Typography>
          </Paper>
        );
      })}
    </Stack>
  </Paper>
);
