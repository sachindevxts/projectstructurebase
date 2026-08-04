import React from 'react';
import { Box, Typography, Stack } from '@mui/material';
import styles from './PfPageHeader.module.scss';

interface PfPageHeaderProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}

export const PfPageHeader = ({ title, subtitle, children }: PfPageHeaderProps) => {
  return (
    <Box className={styles.header}>
      <Box>
        <Typography variant="h4" className={styles.title}>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body2" className={styles.subtitle}>
            {subtitle}
          </Typography>
        )}
      </Box>
      <Stack direction="row" spacing={1} className={styles.actions}>
        {children}
      </Stack>
    </Box>
  );
};