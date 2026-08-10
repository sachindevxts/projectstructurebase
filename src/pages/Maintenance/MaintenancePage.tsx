import React from 'react';
import { Box, Container, Typography, Paper } from '@mui/material';
import { Build as BuildIcon } from '@mui/icons-material';
import styles from './MaintenancePage.module.scss';

export const MaintenancePage = () => {
  return (
    <Box className={styles.page}>
      <Container maxWidth="sm">
        <Paper className={styles.card}>
          <Box className={styles.iconContainer}>
            <BuildIcon className={styles.icon} />
          </Box>
          <Typography variant="h4" gutterBottom>
            Under Maintenance
          </Typography>
          <Typography variant="body1" color="textSecondary" paragraph>
            The application is currently under maintenance. We'll be back shortly.
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Estimated downtime: 30 minutes
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default MaintenancePage;
