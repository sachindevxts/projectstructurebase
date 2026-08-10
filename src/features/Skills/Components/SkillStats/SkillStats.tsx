import React from 'react';
import { 
  Box, 
  Grid, 
  Paper, 
  Typography, 
  useTheme 
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  Warning as WarningIcon,
  Whatshot as WhatshotIcon,
  Category as CategoryIcon,
} from '@mui/icons-material';
import type { SkillStats as SkillStatsType } from '../../Types/skill.types';
import styles from './SkillStats.module.scss';

interface SkillStatsProps {
  stats: SkillStatsType;
}

const STAT_ICONS = {
  totalSkills: <TrendingUpIcon />,
  mappedEmployees: <PeopleIcon />,
  gapsIdentified: <WarningIcon />,
  highDemand: <WhatshotIcon />,
  categories: <CategoryIcon />,
};

const STAT_COLORS = {
  totalSkills: 'var(--color-info)',
  mappedEmployees: 'var(--color-success-light)',
  gapsIdentified: 'var(--color-error)',
  highDemand: 'var(--color-accent-purple)',
  categories: 'var(--color-warning-light)',
};

const STAT_BG_COLORS = {
  totalSkills: 'rgba(59, 130, 246, 0.1)',
  mappedEmployees: 'rgba(34, 197, 94, 0.1)',
  gapsIdentified: 'rgba(239, 68, 68, 0.1)',
  highDemand: 'rgba(139, 92, 246, 0.1)',
  categories: 'rgba(245, 158, 11, 0.1)',
};

export const SkillStats = ({ stats }: SkillStatsProps) => {
  const theme = useTheme();
  
  const statItems = [
    { key: 'totalSkills', value: stats.totalSkills, label: 'Total Skills' },
    { key: 'mappedEmployees', value: stats.mappedEmployees, label: 'Mapped Employees' },
    { key: 'gapsIdentified', value: stats.gapsIdentified, label: 'Gaps Identified' },
    { key: 'highDemand', value: stats.highDemand, label: 'High Demand' },
    { key: 'categories', value: stats.categories, label: 'Categories' },
  ];

  return (
    <Grid container spacing={2} className={styles.statsGrid}>
      {statItems.map((item) => (
        <Grid item xs={12} sm={6} md={4} lg={2.4} key={item.key}>
          <Paper 
            elevation={0} 
            className={styles.statCard}
            sx={{ 
              borderColor: STAT_COLORS[item.key as keyof typeof STAT_COLORS],
            }}
          >
            <Box 
              className={styles.statIcon}
              sx={{ 
                color: STAT_COLORS[item.key as keyof typeof STAT_COLORS],
                bgcolor: STAT_BG_COLORS[item.key as keyof typeof STAT_BG_COLORS],
              }}
            >
              {STAT_ICONS[item.key as keyof typeof STAT_ICONS]}
            </Box>
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
