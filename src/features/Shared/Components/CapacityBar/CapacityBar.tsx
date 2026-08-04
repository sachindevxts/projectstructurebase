import React from 'react';
import { Box, Typography } from '@mui/material';
import styles from './CapacityBar.module.scss';

interface CapacityBarProps {
  value: number;
  showLabel?: boolean;
}

export const CapacityBar = ({ value, showLabel = true }: CapacityBarProps) => {
  const isOverallocated = value > 100;
  const displayValue = Math.min(value, 100);

  return (
    <Box className={styles.container}>
      {showLabel && (
        <Typography 
          variant="caption" 
          className={`${styles.label} ${isOverallocated ? styles.overallocated : ''}`}
        >
          {value}%
        </Typography>
      )}
      <Box className={styles.track}>
        <Box 
          className={`${styles.fill} ${isOverallocated ? styles.overallocated : ''}`}
          sx={{ width: `${displayValue}%` }}
        />
      </Box>
    </Box>
  );
};