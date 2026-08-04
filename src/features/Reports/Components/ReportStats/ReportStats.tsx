import React from 'react';
import { Avatar, Grid, Paper, Typography } from '@mui/material';
import { Groups, Paid, PersonSearch, TrendingUp } from '@mui/icons-material';
import type { ReportMetrics } from '../../types/report.types';
import styles from './ReportStats.module.scss';

interface ReportStatsProps {
  stats: ReportMetrics;
}

export const ReportStats = ({ stats }: ReportStatsProps) => {
  const statItems = [
    { key: 'headcount', value: stats.headcount, label: 'Headcount', icon: <Groups />, color: '#3B82F6' },
    { key: 'billable', value: stats.billable, label: 'Billable People', icon: <Paid />, color: '#22C55E' },
    { key: 'bench', value: stats.bench, label: 'Bench', icon: <PersonSearch />, color: '#F59E0B' },
    { key: 'utilization', value: `${stats.utilization}%`, label: 'Utilization', icon: <TrendingUp />, color: '#8B5CF6' },
  ];

  return (
    <Grid container spacing={2} className={styles.statsGrid}>
      {statItems.map((item) => (
        <Grid item xs={12} sm={6} md={3} key={item.key}>
          <Paper elevation={0} className={styles.statCard}>
            <Avatar className={styles.statIcon} sx={{ bgcolor: `${item.color}20`, color: item.color }}>{item.icon}</Avatar>
            <Typography variant="h5" className={styles.statValue}>{item.value}</Typography>
            <Typography variant="body2" className={styles.statLabel}>{item.label}</Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};
