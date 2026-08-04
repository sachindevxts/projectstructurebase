import React from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Avatar,
  useTheme,
} from '@mui/material';
import { TrendingUp, TrendingDown, TrendingFlat } from '@mui/icons-material';
import type { DashboardStat } from '../../Types/dashboard.types';
import styles from './DashboardStats.module.scss';

interface DashboardStatsProps {
  stats: DashboardStat[];
}

export const DashboardStats = ({ stats }: DashboardStatsProps) => {
  const theme = useTheme();

  const getTrendIcon = (trend?: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up':
        return <TrendingUp sx={{ fontSize: 14, color: '#22C55E' }} />;
      case 'down':
        return <TrendingDown sx={{ fontSize: 14, color: '#EF4444' }} />;
      default:
        return <TrendingFlat sx={{ fontSize: 14, color: '#94A3B8' }} />;
    }
  };

  const getTrendColor = (trend?: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up':
        return '#22C55E';
      case 'down':
        return '#EF4444';
      default:
        return '#94A3B8';
    }
  };

  return (
    <Grid container spacing={2} className={styles.statsGrid}>
      {stats.map((stat) => (
        <Grid item xs={12} sm={6} md={4} lg={2} key={stat.id}>
          <Paper elevation={0} className={styles.statCard}>
            <Box className={styles.statHeader}>
              <Avatar 
                className={styles.statIcon}
                sx={{ bgcolor: `${stat.color}20`, color: stat.color }}
              >
                {stat.icon}
              </Avatar>
              {stat.change !== undefined && (
                <Box className={styles.statTrend}>
                  {getTrendIcon(stat.trend)}
                  <Typography 
                    variant="caption" 
                    sx={{ color: getTrendColor(stat.trend), fontWeight: 600 }}
                  >
                    {stat.change > 0 ? '+' : ''}{stat.change}%
                  </Typography>
                </Box>
              )}
            </Box>
            <Typography variant="h5" className={styles.statValue}>
              {stat.value}
            </Typography>
            <Typography variant="body2" className={styles.statLabel}>
              {stat.label}
            </Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};