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
    { key: 'total', value: stats.total, label: 'Total Projects', icon: <FolderIcon />, color: '#3B82F6' },
    { key: 'active', value: stats.active, label: 'Active', icon: <CheckCircleIcon />, color: '#22C55E' },
    { key: 'atRisk', value: stats.atRisk, label: 'At Risk', icon: <WarningIcon />, color: '#EF4444' },
    { key: 'completed', value: stats.completed, label: 'Completed', icon: <CheckIcon />, color: '#8B5CF6' },
  ];

  return (
    <Grid container spacing={2} className={styles.statsGrid}>
      {statItems.map((item) => (
        <Grid item xs={12} sm={6} md={3} key={item.key}>
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