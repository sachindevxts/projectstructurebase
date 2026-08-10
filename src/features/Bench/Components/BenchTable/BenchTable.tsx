import React, { useState } from 'react';
import { Avatar, Box, Chip, Stack, Typography } from '@mui/material';
import type { BenchEmployee } from '../../Types/bench.types';
import { ReusableTable, type TableColumn } from '@/components/common';
import styles from './BenchTable.module.scss';

interface BenchTableProps {
  employees: BenchEmployee[];
  loading?: boolean;
}

const tableRows = [
  {
    id: 'EMP-004',
    name: 'Amit Dubey',
    department: 'Engineering',
    designation: 'Java Developer',
    skills: ['Java', 'Spring'],
    allocation: '-',
    capacity: '100%',
    benchFrom: 'May 10, 2025',
    benchDays: '68 days',
    lastProject: 'UrbanFleet',
    status: 'Fully Available',
    action: 'Allocate',
  },
  {
    id: 'EMP-008',
    name: 'Saurabh Tiwari',
    department: 'Engineering',
    designation: 'Python Dev',
    skills: ['Python', 'Django'],
    allocation: '-',
    capacity: '100%',
    benchFrom: 'Jun 5, 2025',
    benchDays: '35 days',
    lastProject: 'NovaBank',
    status: 'Fully Available',
    action: 'Allocate',
  },
  {
    id: 'EMP-003',
    name: 'Priya Singh',
    department: 'QA',
    designation: 'QA Lead',
    skills: ['Selenium', 'Cypress'],
    allocation: 'HealthBridge 50%',
    capacity: '50%',
    benchFrom: 'Current',
    benchDays: '-',
    lastProject: 'HealthBridge',
    status: 'Partially Available',
    action: 'View All',
  },
  {
    id: 'EMP-013',
    name: 'Meera Nair',
    department: 'Engineering',
    designation: 'React Developer',
    skills: ['React.js', 'Next.js'],
    allocation: 'HealthBridge 50%',
    capacity: '50%',
    benchFrom: 'Current',
    benchDays: '-',
    lastProject: 'Internal',
    status: 'Partially Available',
    action: 'View All',
  },
  {
    id: 'EMP-006',
    name: 'Karan Malhotra',
    department: 'Engineering',
    designation: 'Tech Lead',
    skills: ['Node.js', 'AWS'],
    allocation: 'Internal 100%',
    capacity: '100%*',
    benchFrom: 'Aug 1, 2025',
    benchDays: '~17 days',
    lastProject: 'Internal HR',
    status: 'Releasing Soon',
    action: 'View Release',
  },
];

type BenchTableRow = (typeof tableRows)[number];

const statusClass: Record<string, string> = {
  'Fully Available': styles.availableChip,
  'Partially Available': styles.partialChip,
  'Releasing Soon': styles.releaseChip,
};

const getInitials = (name: string) =>
  name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

export const BenchTable = ({ loading = false }: BenchTableProps) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const columns: TableColumn<BenchTableRow>[] = [
    {
      id: 'employee',
      label: 'Employee',
      renderCell: (employee) => (
        <Stack direction="row" spacing={1.25} alignItems="center">
          <Avatar className={styles.avatar}>{getInitials(employee.name)}</Avatar>
          <Box>
            <Typography className={styles.employeeName}>{employee.name}</Typography>
            <Typography variant="caption" className={styles.employeeId}>
              {employee.id}
            </Typography>
          </Box>
        </Stack>
      ),
    },
    { id: 'department', label: 'Department', field: 'department' },
    { id: 'designation', label: 'Designation', field: 'designation' },
    {
      id: 'skills',
      label: 'Primary Skills',
      renderCell: (employee) => (
        <Stack spacing={0.5} alignItems="flex-start">
          {employee.skills.map((skill) => (
            <Chip key={skill} label={skill} size="small" className={styles.skillChip} />
          ))}
        </Stack>
      ),
    },
    { id: 'allocation', label: 'Current Alloc.', field: 'allocation' },
    {
      id: 'capacity',
      label: 'Available Capacity',
      renderCell: (employee) => (
        <Typography
          className={employee.capacity === '100%*' ? styles.releaseCapacity : styles.capacityText}
        >
          {employee.capacity}
        </Typography>
      ),
    },
    { id: 'benchFrom', label: 'Bench From', field: 'benchFrom' },
    {
      id: 'benchDays',
      label: 'Bench Days',
      renderCell: (employee) => (
        <Typography
          className={employee.benchDays.includes('68') ? styles.dangerDays : styles.warningDays}
        >
          {employee.benchDays}
        </Typography>
      ),
    },
    { id: 'lastProject', label: 'Last Project', field: 'lastProject' },
    {
      id: 'status',
      label: 'Status',
      renderCell: (employee) => (
        <Chip label={employee.status} size="small" className={statusClass[employee.status]} />
      ),
    },
    {
      id: 'action',
      label: 'Action',
      renderCell: (employee) => (
        <Typography className={styles.actionText}>{employee.action}</Typography>
      ),
    },
  ];

  return (
    <ReusableTable
      rows={tableRows}
      columns={columns}
      getRowId={(employee) => employee.id}
      loading={loading}
      toolbar={
        <Typography variant="h6" className={styles.tableTitle}>
          Available Employees (33)
        </Typography>
      }
      pagination={{
        page,
        rowsPerPage,
        totalRows: tableRows.length,
        rowsPerPageOptions: [5, 10, 15],
        onPageChange: setPage,
        onRowsPerPageChange: (nextRowsPerPage) => {
          setRowsPerPage(nextRowsPerPage);
          setPage(0);
        },
        formatResultCount: ({ from, to, total }) => `Showing ${from}-${to} of ${total}`,
      }}
    />
  );
};
