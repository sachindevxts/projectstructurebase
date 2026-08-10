import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, TextField, Button, Link, Alert } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { ROUTES } from '@/constants/route.constants';
import styles from './RecoveryPage.module.scss';

export const RecoveryPage = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <Box className={styles.page}>
      <Card className={styles.card}>
        <CardContent>
          <Box className={styles.brand}>
            <Typography variant="h5" fontWeight={700}>
              ♟ PeopleFlow HR
            </Typography>
          </Box>

          <Typography variant="h5" fontWeight={600} gutterBottom>
            Forgot Password?
          </Typography>
          <Typography variant="body2" color="textSecondary" paragraph>
            Enter your work email and we'll send password reset instructions.
          </Typography>

          {submitted ? (
            <Alert severity="success" sx={{ mt: 2 }}>
              Password reset instructions sent to {email}
            </Alert>
          ) : (
            <form onSubmit={handleSubmit} className={styles.form}>
              <TextField
                fullWidth
                label="Work Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button
                fullWidth
                type="submit"
                variant="contained"
                size="large"
              >
                Send Reset Link
              </Button>
            </form>
          )}

          <Link component={RouterLink} to={ROUTES.LOGIN} variant="body2" className={styles.backLink}>
            ← Back to sign in
          </Link>
        </CardContent>
      </Card>
    </Box>
  );
};

export default RecoveryPage;
