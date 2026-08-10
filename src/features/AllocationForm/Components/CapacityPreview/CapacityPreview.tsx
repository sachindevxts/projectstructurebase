import React from 'react';
import { Box, Paper, Stack, Typography } from '@mui/material';
import type { CapacityPreviewData } from '../../types/allocationForm.types';
import styles from './CapacityPreview.module.scss';

interface CapacityPreviewProps {
  preview: CapacityPreviewData;
}

export const CapacityPreview = ({ preview }: CapacityPreviewProps) => (
  <Paper elevation={0} className={styles.preview}>
    <Typography variant="h6" className={styles.title}>
      Live Capacity Preview - Aditi Mehra
    </Typography>
    <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={2} className={styles.metrics}>
      <Box className={styles.metric}>
        <Typography className={styles.currentValue}>{preview.currentAllocation}%</Typography>
        <span>Current Alloc.</span>
      </Box>
      <Box className={styles.metric}>
        <Typography className={styles.requestedValue}>{preview.requestedAllocation}%</Typography>
        <span>Requested</span>
      </Box>
      <Box className={styles.metric}>
        <Typography className={styles.resultValue}>{preview.projectedAllocation}%</Typography>
        <span>Resulting Alloc.</span>
      </Box>
      <Box className={styles.metric}>
        <Typography className={styles.overValue}>{preview.remainingCapacity}%</Typography>
        <span>Over Capacity</span>
      </Box>
    </Stack>

    <Box className={styles.capacityBar}>
      <Box className={styles.novaSegment}>NovaBank 70%</Box>
      <Box className={styles.internalSegment}>Internal 30%</Box>
      <Box className={styles.newSegment}>New 30%</Box>
    </Box>

    <Stack direction="row" spacing={2} flexWrap="wrap" className={styles.legend}>
      <span><i className={styles.novaDot} />NovaBank 70%</span>
      <span><i className={styles.internalDot} />Internal 30%</span>
      <span><i className={styles.newDot} />New NovaBank Portal 30%</span>
    </Stack>
  </Paper>
);

