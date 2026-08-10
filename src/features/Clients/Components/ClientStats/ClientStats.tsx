import React from 'react';
import { Avatar, Grid, Paper, Typography } from '@mui/material';
import { AccountBalance, CheckCircle, CurrencyRupee, WarningAmber } from '@mui/icons-material';
import type { ClientStats as StatsType } from '../../types/client.types';
import styles from './ClientStats.module.scss';

interface ClientStatsProps {
  stats: StatsType;
}

export const ClientStats = ({ stats }: ClientStatsProps) => {
  const statItems = [
    { key: 'total', value: stats.total, label: 'Total Clients', icon: <AccountBalance />, color: 'var(--color-info)' },
    { key: 'active', value: stats.active, label: 'Active Clients', icon: <CheckCircle />, color: 'var(--color-success-light)' },
    { key: 'revenue', value: `₹${Math.round(stats.revenue / 100000)}L`, label: 'Booked Revenue', icon: <CurrencyRupee />, color: 'var(--color-accent-purple)' },
    { key: 'risk', value: stats.atRisk, label: 'At Risk', icon: <WarningAmber />, color: 'var(--color-error)' },
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

