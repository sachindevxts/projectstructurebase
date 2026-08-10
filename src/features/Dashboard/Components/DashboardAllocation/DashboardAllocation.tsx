import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
} from '@mui/material';
import styles from './DashboardAllocation.module.scss';

interface DashboardAllocationProps {
  allocationData: {
    active: number;
    total: number;
    percentage: number;
    inactive: number;
  };
}

export const DashboardAllocation = ({ allocationData }: DashboardAllocationProps) => {
  const { active, total, percentage, inactive } = allocationData;

  return (
    <Card className={styles.allocationCard}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Allocation Distribution
        </Typography>
        <Box className={styles.donutContainer}>
          <Box className={styles.donut}>
            <CircularProgress
              variant="determinate"
              value={percentage}
              size={160}
              thickness={8}
              sx={{ color: 'var(--color-info)' }}
            />
            <CircularProgress
              variant="determinate"
              value={100}
              size={160}
              thickness={8}
              sx={{ color: 'var(--color-border)', position: 'absolute' }}
            />
            <Box className={styles.donutCenter}>
              <Typography variant="h4" fontWeight={700}>
                {active}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                Active
              </Typography>
            </Box>
          </Box>
          <Box className={styles.legend}>
            <Box className={styles.legendItem}>
              <Box className={styles.legendColor} sx={{ bgcolor: 'var(--color-info)' }} />
              <Typography variant="caption" fontWeight={500}>
                Active Allocation ({active})
              </Typography>
            </Box>
            <Box className={styles.legendItem}>
              <Box className={styles.legendColor} sx={{ bgcolor: 'var(--color-border)' }} />
              <Typography variant="caption" fontWeight={500}>
                Available ({inactive})
              </Typography>
            </Box>
            <Box className={styles.legendItem}>
              <Box className={styles.legendColor} sx={{ bgcolor: 'var(--color-success-light)' }} />
              <Typography variant="caption" fontWeight={500}>
                Total ({total})
              </Typography>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
