import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import {
  Activity,
  Bot,
  CheckCircle2,
  HelpCircle,
  Link2,
  LogOut,
  Menu,
  Search,
  X,
  Zap,
} from 'lucide-react';
import { NAVIGATION_LABELS, SIDEBAR_GROUPS } from '@/constants/navigation.constants';
import { ROUTES } from '@/constants/route.constants';
import styles from './LeadRouteApp.module.scss';

export function LeadRouteLayout() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Box className={styles.shell}>
      <button
        className={`${styles.mobileBackdrop}${sidebarOpen ? ` ${styles.mobileBackdropVisible}` : ''}`}
        aria-label={NAVIGATION_LABELS.CLOSE_MENU}
        onClick={() => setSidebarOpen(false)}
      />
      <aside className={`${styles.sidebar}${sidebarOpen ? ` ${styles.mobileSidebarOpen}` : ''}`}>
        <Box className={styles.brand}>
          <Box className={styles.brandMark}>
            <Zap size={18} />
          </Box>
          <Box>
            <Box className={styles.brandTitle}>{NAVIGATION_LABELS.APP_NAME}</Box>
            <Box className={styles.brandSub}>{NAVIGATION_LABELS.APP_TAGLINE}</Box>
          </Box>
        </Box>
        <Box className={styles.navScroll}>
          {SIDEBAR_GROUPS.map((group) => (
            <Box key={group.label}>
              <Box className={styles.sectionTitle}>{group.label}</Box>
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.key}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={({ isActive }) =>
                      `${styles.navItem}${isActive ? ` ${styles.navItemActive}` : ''}`
                    }
                  >
                    <Icon size={16} />
                    <span>{item.label}</span>
                    {item.badge && <span className={styles.navBadge}>{item.badge}</span>}
                  </NavLink>
                );
              })}
            </Box>
          ))}
        </Box>
        <Box className={styles.sidebarFooter}>
          <Box className={styles.userCard}>
            <Box className={styles.userAvatar}>X</Box>
            <Box>
              <Typography fontWeight={800} fontSize={12}>
                Xts
              </Typography>
              <Typography color="text.secondary" fontSize={11}>
                Ash
              </Typography>
            </Box>
          </Box>
          <button className={styles.signOut} onClick={() => navigate(ROUTES.LOGIN)}>
            <LogOut size={14} /> Sign out
          </button>
        </Box>
      </aside>

      <Box className={styles.main}>
        <Box className={styles.topbar}>
          <Box className={styles.statusGroup}>
            <button
              className={styles.mobileMenuButton}
              aria-label={NAVIGATION_LABELS.OPEN_MENU}
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={18} />
            </button>
            <span className={`${styles.statusPill} ${styles.statusPillLive}`}>
              <span className={styles.dot} /> RB2B live
            </span>
            <span className={styles.statusPill}>
              <span className={styles.dot} /> Clay enrichment online
            </span>
          </Box>
          <Box className={styles.statusGroup}>
            <Search size={16} />
            <HelpCircle size={16} />
          </Box>
        </Box>
        <Outlet />
      </Box>

      <Box className={styles.assistButtons}>
        <Box className={styles.assistButton}>T</Box>
        <Box className={styles.assistButton}>
          <Bot size={19} />
        </Box>
      </Box>
      <Box className={styles.toolbarBubble}>
        <Activity size={14} />
        <Typography fontSize={14}>T</Typography>
        <Link2 size={14} />
        <CheckCircle2 size={14} />
        <X size={14} />
      </Box>
    </Box>
  );
}

export default LeadRouteLayout;
