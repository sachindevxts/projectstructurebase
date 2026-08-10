import React from 'react';
import { Box, Container, Typography, Button, Paper } from '@mui/material';
import { Lock as LockIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import styles from './UnauthorizedPage.module.scss';

export const UnauthorizedPage = () => {
  const navigate = useNavigate();

  return (
    <Box className={styles.page}>
      <Container maxWidth="sm">
        <Paper className={styles.card}>
          <Box className={styles.iconContainer}>
            <LockIcon className={styles.icon} />
          </Box>
          <Typography variant="h4" gutterBottom>
            Access Denied
          </Typography>
          <Typography variant="body1" color="textSecondary" paragraph>
            You don't have permission to view this page. Please contact your administrator.
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate(-1)}
            className={styles.button}
          >
            Go Back
          </Button>
        </Paper>
      </Container>
    </Box>
  );
};

export default UnauthorizedPage;
