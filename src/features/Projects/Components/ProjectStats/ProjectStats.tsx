import React from 'react';
import { Box, Grid, Paper, Typography, Avatar } from '@mui/material';
import {
  Folder as FolderIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Check as CheckIcon,
} from '@mui/icons-material';
import type { ProjectStats as ProjectStatsType } from '../../Types/project.types';
import styles from './ProjectStats.module.scss';

interface ProjectStatsProps {
  stats: ProjectStatsType;
}

export const ProjectStats = ({ stats }: ProjectStatsProps) => {
  const statItems = [
    { key: 'total', value: stats.total, label: 'Total Projects', icon: <FolderIcon />, color: 'var(--color-info)' },
    { key: 'active', value: stats.active, label: 'Active', icon: <CheckCircleIcon />, color: 'var(--color-success-light)' },
    { key: 'atRisk', value: stats.atRisk, label: 'At Risk', icon: <WarningIcon />, color: 'var(--color-error)' },
    { key: 'completed', value: stats.completed, label: 'Completed', icon: <CheckIcon />, color: 'var(--color-accent-purple)' },
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
