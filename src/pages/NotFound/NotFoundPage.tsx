import React from 'react';
import { Box, Container, Typography, Button, Paper } from '@mui/material';
import { Home as HomeIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import styles from './NotFoundPage.module.scss';

export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <Box className={styles.page}>
      <Container maxWidth="sm">
        <Paper className={styles.card}>
          <Typography variant="h1" className={styles.code}>
            404
          </Typography>
          <Typography variant="h4" gutterBottom>
            Page Not Found
          </Typography>
          <Typography variant="body1" color="textSecondary" paragraph>
            The page you are looking for doesn't exist or may have been moved.
          </Typography>
          <Button
            variant="contained"
            startIcon={<HomeIcon />}
            onClick={() => navigate('/dashboard')}
            className={styles.button}
          >
            Back to Dashboard
          </Button>
        </Paper>
      </Container>
    </Box>
  );
};

export default NotFoundPage;