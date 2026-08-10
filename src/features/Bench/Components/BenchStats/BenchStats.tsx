import React from 'react';
import { Avatar, Box, Paper, Typography } from '@mui/material';
import {
  HourglassBottom as HourglassIcon,
  PersonAdd as PersonAddIcon,
  PersonOff as PersonOffIcon,
  RunningWithErrors as ReleaseIcon,
  WarningAmber as WarningIcon,
  WorkOff as WorkOffIcon,
} from '@mui/icons-material';
import type { BenchStats as BenchStatsType } from '../../types/bench.types';
import styles from './BenchStats.module.scss';

interface BenchStatsProps {
  stats: BenchStatsType;
}

export const BenchStats = ({ stats }: BenchStatsProps) => {
  const statItems = [
    { value: 12, label: 'Fully Available', icon: <PersonAddIcon />, tone: styles.greenTone },
    { value: 18, label: 'Partially Available', icon: <WorkOffIcon />, tone: styles.blueTone },
    { value: 14, label: 'Releasing Soon', icon: <ReleaseIcon />, tone: styles.orangeTone },
    { value: 8, label: 'Bench >15 Days', icon: <HourglassIcon />, tone: styles.orangeTone },
    { value: 5, label: 'Bench >30 Days', icon: <WarningIcon />, tone: styles.yellowTone },
    { value: 3, label: 'Bench >60 Days', icon: <PersonOffIcon />, tone: styles.redTone },
  ];

  void stats;

  return (
    <Box className={styles.statsGrid}>
      {statItems.map((item) => (
        <Paper elevation={0} className={styles.statCard} key={item.label}>
          <Avatar className={`${styles.statIcon} ${item.tone}`}>{item.icon}</Avatar>
          <Typography variant="h5" className={styles.statValue}>
            {item.value}
          </Typography>
          <Typography variant="body2" className={styles.statLabel}>
            {item.label}
          </Typography>
        </Paper>
      ))}
    </Box>
  );
};

