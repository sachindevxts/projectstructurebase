import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Badge,
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  Brightness4,
  Brightness7,
  Close as CloseIcon,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { setSidebarOpen } from '@/redux/actions';
import { selectSidebarOpen } from '@/redux/selectors';
import { NAVIGATION_LABELS } from '@/constants/navigation.constants';
import { useNotifications } from '@/features/Notifications/hooks/useNotifications';
import { useTheme } from '@/providers/ThemeProvider';
import styles from './Topbar.module.scss';

export const Topbar = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const { resolvedTheme, toggleTheme } = useTheme();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const sidebarOpen = useAppSelector(selectSidebarOpen);
  const darkModeEnabled = resolvedTheme === 'dark';
  const {
    items: notifications,
    unreadCount,
    loading: notificationsLoading,
    markRead,
    markAllRead,
    clearAll,
  } = useNotifications(Boolean(user), notificationsOpen);

  const getBreadcrumbs = () => {
    const path = pathname.split('/').filter(Boolean);
    if (path.length === 0) return ['Dashboard'];
    return path.map((p) => p.charAt(0).toUpperCase() + p.slice(1));
  };

  const breadcrumbs = getBreadcrumbs();

  const openNotifications = () => {
    setNotificationsOpen(true);
  };

  const closeNotifications = () => {
    setNotificationsOpen(false);
  };

  const handleNotificationClick = async (notificationId: string, route: string | null) => {
    closeNotifications();
    if (route) navigate(route);
  };

  const handleMarkRead = async (
    event: React.MouseEvent<HTMLButtonElement>,
    notificationId: string,
  ) => {
    event.stopPropagation();
    await markRead(notificationId);
  };

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
          <IconButton
            className={styles.iconButton}
            aria-label="Open notifications"
            aria-controls={notificationsOpen ? 'notifications-panel' : undefined}
            aria-haspopup="dialog"
            aria-expanded={notificationsOpen ? 'true' : undefined}
            onClick={openNotifications}
          >
            <Badge badgeContent={unreadCount} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
        </Tooltip>
        <Drawer
          anchor="right"
          open={notificationsOpen}
          onClose={closeNotifications}
          transitionDuration={260}
          ModalProps={{ keepMounted: true }}
          PaperProps={{ className: styles.notificationPanel }}
        >
          <Box id="notifications-panel" className={styles.notificationHeader}>
            <Box>
              <Typography className={styles.notificationTitle}>Notifications</Typography>
              <Typography className={styles.notificationSubtitle}>
                {unreadCount ? `${unreadCount} unread` : 'All caught up'}
              </Typography>
            </Box>
            <Box className={styles.notificationActions}>
              <Tooltip title="Close notifications">
                <IconButton
                  size="small"
                  className={styles.notificationCloseButton}
                  aria-label="Close notifications"
                  onClick={closeNotifications}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
          <Divider />
          {notificationsLoading ? (
            <Box className={styles.notificationEmpty}>Loading notifications...</Box>
          ) : notifications.length ? (
            <List disablePadding className={styles.notificationList}>
              {notifications.map((notification) => {
                const unread = !notification.readAt;

                return (
                  <ListItem
                    key={notification.id}
                    className={`${styles.notificationItem} ${unread ? styles.unread : ''}`}
                    onClick={() => handleNotificationClick(notification.id, notification.route)}
                  >
                    <Box className={styles.notificationBody}>
                      <Typography className={styles.notificationItemTitle}>
                        {notification.title}
                      </Typography>
                      <Typography className={styles.notificationMessage}>
                        {notification.message}
                      </Typography>
                      <Typography className={styles.notificationActor}>
                        Performed by {notification.actorEmail ?? 'System'}
                      </Typography>
                      <Typography className={styles.notificationMeta}>
                        {new Date(notification.createdAt).toLocaleString()}
                      </Typography>
                    </Box>
                    {unread && (
                      <Button
                        size="small"
                        variant="text"
                        className={styles.notificationReadButton}
                        onClick={(event) => handleMarkRead(event, notification.id)}
                      >
                        Mark as read
                      </Button>
                    )}
                  </ListItem>
                );
              })}
            </List>
          ) : (
            <Box className={styles.notificationEmpty}>No notifications yet</Box>
          )}
          <Box className={styles.notificationFooter}>
            <Button
              variant="outlined"
              onClick={markAllRead}
              disabled={!unreadCount}
              className={styles.notificationFooterButton}
            >
              Mark all as read
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={clearAll}
              disabled={!notifications.length}
              className={styles.notificationFooterButton}
            >
              Clear all
            </Button>
          </Box>
        </Drawer>

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
