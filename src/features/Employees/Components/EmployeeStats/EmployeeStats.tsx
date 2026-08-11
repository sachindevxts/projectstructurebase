import React from 'react';
import { Box, Grid, Paper, Typography, Avatar } from '@mui/material';
import {
  People as PeopleIcon,
  CheckCircle as CheckCircleIcon,
  BeachAccess as BeachAccessIcon,
  Warning as WarningIcon,
  AttachMoney as AttachMoneyIcon,
} from '@mui/icons-material';
import type { EmployeeStats as EmployeeStatsType } from '../../Types/employee.types';
import styles from './EmployeeStats.module.scss';

interface EmployeeStatsProps {
  stats: EmployeeStatsType;
}

export const EmployeeStats = ({ stats }: EmployeeStatsProps) => {
  const statItems = [
    { key: 'total', value: stats.total, label: 'Total Employees', icon: <PeopleIcon />, color: 'var(--color-info)' },
    { key: 'active', value: stats.active, label: 'Active', icon: <CheckCircleIcon />, color: 'var(--color-success-light)' },
    { key: 'onLeave', value: stats.onLeave, label: 'On Leave', icon: <BeachAccessIcon />, color: 'var(--color-warning-light)' },
    { key: 'overallocated', value: stats.overallocated, label: 'Overallocated', icon: <WarningIcon />, color: 'var(--color-error)' },
    { key: 'billable', value: `${Math.round((stats.billable / stats.total) * 100)}%`, label: 'Billable %', icon: <AttachMoneyIcon />, color: 'var(--color-accent-purple)' },
  ];

  return (
    <Grid container spacing={2} className={styles.statsGrid}>
      {statItems.map((item) => (
        <Grid item xs={12} sm={6} md={4} lg={2.4} key={item.key}>
          <Paper elevation={0} className={styles.statCard}>
            <Avatar className={styles.statIcon} sx={{ bgcolor: `color-mix(in srgb, ${item.color} 14%, transparent)`, color: item.color }}>
              {item.icon}
            </Avatar>
            <Typography variant="h5" className={styles.statValue}>
              {item.value}
            </Typography>
            <Typography variant="body2" className={styles.statLabel}>
              {item.label}
            </Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};
