import React from 'react';
import { Avatar, Grid, Paper, Typography } from '@mui/material';
import { Badge, Groups, Layers, PersonOff } from '@mui/icons-material';
import type { DesignationStats as StatsType } from '../../types/designation.types';
import styles from './DesignationStats.module.scss';

interface DesignationStatsProps {
  stats: StatsType;
}

export const DesignationStats = ({ stats }: DesignationStatsProps) => {
  const statItems = [
    { key: 'total', value: stats.total, label: 'Total Designations', icon: <Badge />, color: 'var(--color-info)' },
    { key: 'employees', value: stats.totalEmployees, label: 'Employees Mapped', icon: <Groups />, color: 'var(--color-success-light)' },
    { key: 'levels', value: stats.seniorityLevels, label: 'Seniority Levels', icon: <Layers />, color: 'var(--color-accent-purple)' },
    { key: 'unmapped', value: stats.unmapped, label: 'Unmapped Roles', icon: <PersonOff />, color: 'var(--color-error)' },
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
