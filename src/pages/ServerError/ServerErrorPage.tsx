import React from 'react';
import { Box, Container, Typography, Button, Paper } from '@mui/material';
import { Error as ErrorIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import styles from './ServerErrorPage.module.scss';

export const ServerErrorPage = () => {
  const navigate = useNavigate();

  return (
    <Box className={styles.page}>
      <Container maxWidth="sm">
        <Paper className={styles.card}>
          <Box className={styles.iconContainer}>
            <ErrorIcon className={styles.icon} />
          </Box>
          <Typography variant="h4" gutterBottom>
            Server Error
          </Typography>
          <Typography variant="body1" color="textSecondary" paragraph>
            Something went wrong on our side. Please try again later.
          </Typography>
          <Box className={styles.actions}>
            <Button
              variant="outlined"
              onClick={() => navigate(-1)}
            >
              Go Back
            </Button>
            <Button
              variant="contained"
              onClick={() => navigate('/dashboard')}
            >
              Dashboard
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default ServerErrorPage;