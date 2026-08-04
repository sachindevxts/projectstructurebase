import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import styles from './SkillMetricCard.module.scss';

interface SkillMetricCardProps {
  label: string;
  value: string | number;
  color?: string;
  icon: string;
}

export const SkillMetricCard = ({ label, value, color, icon }: SkillMetricCardProps) => {
  return (
    <Paper elevation={0} className={styles.metricCard}>
      <Box className={styles.metricIcon} sx={{ color: color || '#64748B' }}>
        <Typography variant="h6">{icon}</Typography>
      </Box>
      <Box>
        <Typography variant="h6" fontWeight={600} className={styles.metricValue}>
          {value}
        </Typography>
        <Typography variant="caption" color="textSecondary" className={styles.metricLabel}>
          {label}
        </Typography>
      </Box>
    </Paper>
  );
};