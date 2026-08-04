import React from 'react';
import { Box, Grid, Paper, Typography, Avatar } from '@mui/material';
import {
  People as PeopleIcon,
  CheckCircle as CheckCircleIcon,
  BeachAccess as BeachAccessIcon,
  Warning as WarningIcon,
  AttachMoney as AttachMoneyIcon,
} from '@mui/icons-material';
import type { EmployeeStats as EmployeeStatsType } from '../../types/employee.types';
import styles from './EmployeeStats.module.scss';

interface EmployeeStatsProps {
  stats: EmployeeStatsType;
}

export const EmployeeStats = ({ stats }: EmployeeStatsProps) => {
  const statItems = [
    { key: 'total', value: stats.total, label: 'Total Employees', icon: <PeopleIcon />, color: '#3B82F6' },
    { key: 'active', value: stats.active, label: 'Active', icon: <CheckCircleIcon />, color: '#22C55E' },
    { key: 'onLeave', value: stats.onLeave, label: 'On Leave', icon: <BeachAccessIcon />, color: '#F59E0B' },
    { key: 'overallocated', value: stats.overallocated, label: 'Overallocated', icon: <WarningIcon />, color: '#EF4444' },
    { key: 'billable', value: `${Math.round((stats.billable / stats.total) * 100)}%`, label: 'Billable %', icon: <AttachMoneyIcon />, color: '#8B5CF6' },
  ];

  return (
    <Grid container spacing={2} className={styles.statsGrid}>
      {statItems.map((item) => (
        <Grid item xs={12} sm={6} md={4} lg={2.4} key={item.key}>
          <Paper elevation={0} className={styles.statCard}>
            <Avatar className={styles.statIcon} sx={{ bgcolor: `${item.color}20`, color: item.color }}>
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