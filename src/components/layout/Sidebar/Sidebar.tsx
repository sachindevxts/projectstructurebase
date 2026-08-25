import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Box, Typography, IconButton, Avatar, Stack, Divider } from '@mui/material';
import {
  Award,
  BadgeCheck,
  BarChart3,
  Boxes,
  Briefcase,
  Building2,
  CalendarRange,
  ChevronDown,
  ClipboardList,
  FolderKanban,
  HardDrive,
  History,
  KeyRound,
  LayoutDashboard,
  LogOut,
  Monitor,
  Repeat2,
  ReceiptText,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  Ticket,
  Users,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { logout as logoutAction, setSidebarOpen } from '@/redux/actions';
import { SIDEBAR_ITEMS, NAVIGATION_LABELS } from '@/constants/navigation.constants';
import ConfirmationDialog from '@/components/common/ConfirmationDialog/ConfirmationDialog';
import { hasPermission } from '@/utils/permission.utils';
import styles from './Sidebar.module.scss';

const icons: Record<string, React.ReactNode> = {
  dashboard: <LayoutDashboard size={16} />,
  employees: <Users size={16} />,
  bench: <Boxes size={16} />,
  clients: <Building2 size={16} />,
  projects: <FolderKanban size={16} />,
  allocations: <Repeat2 size={16} />,
  planner: <CalendarRange size={16} />,
  reports: <BarChart3 size={16} />,
  'sales-overview': <BarChart3 size={16} />,
  'sales-pipeline': <FolderKanban size={16} />,
  'sales-invoices': <ReceiptText size={16} />,
  departments: <Briefcase size={16} />,
  designations: <BadgeCheck size={16} />,
  skills: <Award size={16} />,
  users: <Users size={16} />,
  roles: <ShieldCheck size={16} />,
  audit: <History size={16} />,
  'it-admin': <Monitor size={16} />,
  'it-tickets': <Ticket size={16} />,
  'it-assets': <HardDrive size={16} />,
  'it-setup': <ClipboardList size={16} />,
  'it-software': <KeyRound size={16} />,
  'it-config': <SlidersHorizontal size={16} />,
};

const navigationPermissions: Record<string, string> = {
  dashboard: 'dashboard:view',
  employees: 'employees:view',
  bench: 'bench:view',
  clients: 'clients:view',
  projects: 'projects:view',
  allocations: 'allocations:view',
  planner: 'resource-planner:view',
  reports: 'reports:view',
  departments: 'departments:view',
  designations: 'designations:view',
  skills: 'skills:view',
  users: 'users:view',
  roles: 'roles:view',
  audit: 'audit-logs:view',
  'it-admin': 'it-admin:view',
  'it-tickets': 'it-admin:tickets:view',
  'it-assets': 'it-admin:assets:view',
  'it-setup': 'it-admin:setup:view',
  'it-software': 'it-admin:software:view',
  'it-config': 'it-admin:configuration:view',
  'sales-overview': 'sales:view',
  'sales-pipeline': 'sales:view',
  'sales-invoices': 'sales:view',
};

export const Sidebar = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);
  const mobileOpen = useAppSelector((state) => state.ui.sidebarOpen);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);

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

  const requestLogout = () => {
    setLogoutDialogOpen(true);
  };

  const cancelLogout = () => {
    if (!logoutLoading) setLogoutDialogOpen(false);
  };

  const confirmLogout = async () => {
    setLogoutLoading(true);
    try {
      await dispatch(logoutAction());
      setLogoutDialogOpen(false);
      navigate('/login');
    } finally {
      setLogoutLoading(false);
    }
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
          {SIDEBAR_ITEMS.map((group) => {
            const visibleItems = group.items.filter(([id]) =>
              hasPermission(user, [navigationPermissions[id] ?? `${id}:view`]),
            );
            if (!visibleItems.length) return null;
            return (
              <Box key={group.section} className={styles.navSection}>
                <Typography variant="caption" className={styles.sectionLabel}>
                  {group.section}
                </Typography>
                {visibleItems.map(([id, title, path]) => (
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
            );
          })}
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
          <button className={styles.logoutButton} onClick={requestLogout}>
            <LogOut size={16} />
            <Typography variant="body2">Logout</Typography>
          </button>
        </Box>
      </aside>
      <ConfirmationDialog
        isOpen={logoutDialogOpen}
        title="Logout"
        message="Are you sure want to logout?"
        confirmText="Logout"
        cancelText="Cancel"
        confirmVariant="danger"
        loading={logoutLoading}
        onConfirm={confirmLogout}
        onCancel={cancelLogout}
      />
    </>
  );
};
