import React from 'react';
import { useLocation } from 'react-router-dom';
import { Box, IconButton, Badge, TextField, InputAdornment, Tooltip, Switch } from '@mui/material';
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  Brightness4,
  Brightness7,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { setSidebarOpen } from '@/redux/actions';
import { selectSidebarOpen } from '@/redux/selectors';
import { NAVIGATION_LABELS } from '@/constants/navigation.constants';
import { useAuth } from '@/Features/Auth/Hooks/useAuth';
import { useTheme } from '@/providers/ThemeProvider';
import styles from './Topbar.module.scss';

export const Topbar = () => {
  const { pathname } = useLocation();
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const { resolvedTheme, toggleTheme } = useTheme();
  const sidebarOpen = useAppSelector(selectSidebarOpen);
  const darkModeEnabled = resolvedTheme === 'dark';

  const getBreadcrumbs = () => {
    const path = pathname.split('/').filter(Boolean);
    if (path.length === 0) return ['Dashboard'];
    return path.map((p) => p.charAt(0).toUpperCase() + p.slice(1));
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className={styles.topbar}>
      <Box className={styles.leftSection}>
        <IconButton
          className={styles.menuToggle}
          aria-label={sidebarOpen ? NAVIGATION_LABELS.CLOSE_MENU : NAVIGATION_LABELS.OPEN_MENU}
          aria-expanded={sidebarOpen}
          aria-controls="primary-navigation"
          onClick={() => dispatch(setSidebarOpen(!sidebarOpen))}
        >
          <MenuIcon />
        </IconButton>
        <Box className={styles.breadcrumbs} aria-label="Breadcrumb">
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={index}>
              {index > 0 && <span className={styles.separator}>›</span>}
              <span className={index === breadcrumbs.length - 1 ? styles.current : ''}>
                {crumb}
              </span>
            </React.Fragment>
          ))}
        </Box>
      </Box>

      <Box className={styles.rightSection}>
        <TextField
          className={styles.searchInput}
          placeholder="Global search..."
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
        />

        <Tooltip title="Notifications">
          <IconButton className={styles.iconButton}>
            <Badge badgeContent={5} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
        </Tooltip>

        <Tooltip title="Toggle theme">
          <Switch
            checked={darkModeEnabled}
            onChange={toggleTheme}
            icon={<Brightness7 fontSize="small" />}
            checkedIcon={<Brightness4 fontSize="small" />}
            className={styles.themeSwitch}
          />
        </Tooltip>

        <Box className={styles.userAvatar}>{user?.name?.charAt(0) || 'A'}</Box>
      </Box>
    </header>
  );
};
