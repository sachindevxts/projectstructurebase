import React from 'react';
import { Box, Grid, Paper, Typography, Avatar } from '@mui/material';
import {
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import type { AllocationStats as AllocationStatsType } from '../../Types/allocation.types';
import styles from './AllocationStats.module.scss';

interface AllocationStatsProps {
  stats: AllocationStatsType;
}

export const AllocationStats = ({ stats }: AllocationStatsProps) => {
  const statItems = [
    { key: 'total', value: stats.total, label: 'Total Allocations', icon: <AssignmentIcon />, color: 'var(--color-info)' },
    { key: 'active', value: stats.active, label: 'Active', icon: <CheckCircleIcon />, color: 'var(--color-success-light)' },
    { key: 'overallocated', value: stats.overallocated, label: 'Overallocated', icon: <WarningIcon />, color: 'var(--color-error)' },
    { key: 'releasingSoon', value: stats.releasingSoon, label: 'Releasing Soon', icon: <ScheduleIcon />, color: 'var(--color-warning-light)' },
  ];

  return (
    <Grid container spacing={2} className={styles.statsGrid}>
      {statItems.map((item) => (
        <Grid item xs={12} sm={6} md={3} key={item.key}>
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