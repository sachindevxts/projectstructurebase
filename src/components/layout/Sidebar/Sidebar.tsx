import React, { useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Box, Typography, IconButton, Avatar, Stack, Divider } from '@mui/material';
import { ChevronDown, LogOut, Settings } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { setSidebarOpen } from '@/redux/actions';
import { SIDEBAR_ITEMS, NAVIGATION_LABELS } from '@/constants/navigation.constants';
import { useAuth } from '@/Features/auth/Hooks/useAuth';
import styles from './Sidebar.module.scss';

const icons: Record<string, string> = {
  dashboard: '◉',
  employees: '♟',
  bench: '▰',
  clients: '▪',
  projects: '⚭',
  allocations: '↪',
  planner: '▣',
  reports: '▤',
  departments: '♟',
  designations: '▣',
  skills: '♟',
  roles: '⬟',
  audit: '⟳',
};

export const Sidebar = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const mobileOpen = useAppSelector((state) => state.ui.sidebarOpen);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!mobileOpen) return;
    const previousOverflow = document.body.style.overflow;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') dispatch(setSidebarOpen(false));
    };
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleEscape);
    closeButtonRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleEscape);
    };
  }, [dispatch, mobileOpen]);

  const closeMobileSidebar = () => dispatch(setSidebarOpen(false));

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <>
      <button
        className={`${styles.backdrop}${mobileOpen ? ` ${styles.visible}` : ''}`}
        type="button"
        aria-label={NAVIGATION_LABELS.CLOSE_MENU}
        tabIndex={mobileOpen ? 0 : -1}
        onClick={closeMobileSidebar}
      />
      <aside
        id="primary-navigation"
        className={`${styles.sidebar}${mobileOpen ? ` ${styles.mobileOpen}` : ''}`}
        aria-label="Primary navigation"
      >
        <Box className={styles.brand}>
          <Box className={styles.logo}>
            <Typography variant="h6" fontWeight={700}>
              ♟ PeopleFlow HR
            </Typography>
          </Box>
          <IconButton
            ref={closeButtonRef}
            className={styles.closeButton}
            aria-label={NAVIGATION_LABELS.CLOSE_MENU}
            onClick={closeMobileSidebar}
          >
            ×
          </IconButton>
        </Box>

        <Box className={styles.company}>
          <Box className={styles.companyName}>
            <Avatar className={styles.companyAvatar}>AC</Avatar>
            <Typography variant="body2" fontWeight={600}>
              {NAVIGATION_LABELS.COMPANY}
            </Typography>
          </Box>
          <ChevronDown className={styles.companyArrow} size={16} />
        </Box>

        <Box component="nav" className={styles.nav}>
          {SIDEBAR_ITEMS.map((group) => (
            <Box key={group.section} className={styles.navSection}>
              <Typography variant="caption" className={styles.sectionLabel}>
                {group.section}
              </Typography>
              {group.items.map(([id, title, path]) => (
                <NavLink
                  key={id}
                  to={path}
                  className={({ isActive }) =>
                    `${styles.navLink}${isActive ? ` ${styles.active}` : ''}`
                  }
                  onClick={closeMobileSidebar}
                >
                  <span className={styles.navIcon}>{icons[id]}</span>
                  <Typography variant="body2" fontWeight={500}>
                    {title}
                  </Typography>
                </NavLink>
              ))}
            </Box>
          ))}
        </Box>

        <Box className={styles.userSection}>
          <Divider className={styles.divider} />
          <Box className={styles.userInfo}>
            <Avatar className={styles.userAvatar}>{user?.name?.charAt(0) || 'A'}</Avatar>
            <Box>
              <Typography variant="body2" fontWeight={600}>
                {user?.name || 'Arjun Kapoor'}
              </Typography>
              <Typography variant="caption" className={styles.userRole}>
                {user?.role || 'Super Admin'}
              </Typography>
            </Box>
            <IconButton size="small" className={styles.settingsButton}>
              <Settings size={16} />
            </IconButton>
          </Box>
          <button className={styles.logoutButton} onClick={handleLogout}>
            <LogOut size={16} />
            <Typography variant="body2">Logout</Typography>
          </button>
        </Box>
      </aside>
    </>
  );
};

