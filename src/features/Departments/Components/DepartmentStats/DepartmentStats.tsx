import React from 'react';
import { Box, Grid, Paper, Typography, Avatar } from '@mui/material';
import {
  Business as BusinessIcon,
  People as PeopleIcon,
  PersonOff as PersonOffIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import type { DepartmentStats as DepartmentStatsType } from '../../types/department.types';
import styles from './DepartmentStats.module.scss';

interface DepartmentStatsProps {
  stats: DepartmentStatsType;
}

export const DepartmentStats = ({ stats }: DepartmentStatsProps) => {
  const statItems = [
    { key: 'total', value: stats.total, label: 'Total Departments', icon: <BusinessIcon />, color: 'var(--color-info)' },
    { key: 'employees', value: stats.totalEmployees, label: 'Total Employees', icon: <PeopleIcon />, color: 'var(--color-success-light)' },
    { key: 'bench', value: stats.onBench, label: 'On Bench', icon: <PersonOffIcon />, color: 'var(--color-warning-light)' },
    { key: 'billability', value: `${stats.avgBillability}%`, label: 'Avg Billability', icon: <TrendingUpIcon />, color: 'var(--color-accent-purple)' },
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
