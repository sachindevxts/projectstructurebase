import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Divider,
  FormControlLabel,
  Link,
  TextField,
  Typography,
  Alert,
  Stack,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { login } from '@/redux/actions';
import { useAppDispatch, useAppSelector } from '@/hooks';
import styles from './LoginPage.module.scss';

export const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const loading = useAppSelector((state) => state.auth.isLoading);
  const error = useAppSelector((state) => state.auth.error?.message ?? null);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: 'admin@peopleflow.local',
    password: 'PeopleFlow@123',
    rememberMe: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await dispatch(
      login({
        email: formData.email,
        password: formData.password,
      }),
    );
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <Box className={styles.container}>
      <Box className={styles.hero}>
        <Box className={styles.brand}>
          <Typography variant="h5" fontWeight={700}>
            ♟ PeopleFlow HR
          </Typography>
        </Box>
        <Box className={styles.heroContent}>
          <Typography variant="h3" fontWeight={700} gutterBottom>
            Manage people, projects, capacity,
            <br />
            and utilization from one platform.
          </Typography>
          <Typography variant="body1" color="textSecondary" paragraph>
            The workforce operations suite trusted by 1,200+ companies to keep teams staffed,
            billable, and moving.
          </Typography>
          <Stack spacing={1} sx={{ mt: 2 }}>
            <Typography variant="body2">◉ Real-time resource allocation visibility</Typography>
            <Typography variant="body2">▣ Project staffing & bench tracking</Typography>
            <Typography variant="body2">$ Billability & utilization insights</Typography>
          </Stack>
        </Box>
        <Typography variant="caption" color="textSecondary" sx={{ mt: 'auto', pt: 4 }}>
          © 2026 PeopleFlow HR Inc. All rights reserved.
        </Typography>
      </Box>

      <Box className={styles.formContainer}>
        <Box className={styles.support}>
          <Typography variant="body2" color="textSecondary">
            Need help? <Link href="#">Contact Support</Link>
          </Typography>
        </Box>

        <Card elevation={0} className={styles.card}>
          <CardContent>
            <Typography variant="h4" fontWeight={700} gutterBottom>
              Welcome back
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Sign in to your account
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit} className={styles.form}>
              <TextField
                fullWidth
                label="Work Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />

              <TextField
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Box className={styles.options}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.rememberMe}
                      onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                    />
                  }
                  label="Remember me"
                />
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Box>

              <Button
                fullWidth
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
                className={styles.submitButton}
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </Button>

              <Divider className={styles.divider}>OR CONTINUE WITH</Divider>

              <Box className={styles.socialButtons}>
                <Button variant="outlined" fullWidth>
                  Google
                </Button>
                <Button variant="outlined" fullWidth>
                  Microsoft
                </Button>
              </Box>

              <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                Don't have an account? <Link href="#">Request access</Link>
              </Typography>
            </form>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default LoginPage;
