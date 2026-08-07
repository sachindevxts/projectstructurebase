import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import {
  Activity,
  BarChart3,
  Bot,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  FileText,
  HelpCircle,
  Inbox,
  Link2,
  ListChecks,
  LogOut,
  Mail,
  Menu,
  Megaphone,
  Search,
  Send,
  Settings,
  ShieldCheck,
  X,
  Zap,
} from 'lucide-react';
import { ROUTES } from '@/constants/route.constants';
import styles from './LeadRouteApp.module.scss';

const navGroups = [
  {
    label: 'MAIN',
    items: [
      { path: ROUTES.DASHBOARD, label: 'Dashboard', icon: ListChecks },
      { path: ROUTES.VERIFICATION_QUEUE, label: 'Verification Queue', icon: ClipboardCheck, badge: '11' },
      { path: ROUTES.APPROVALS, label: 'Approvals', icon: ShieldCheck },
      { path: ROUTES.AUDIT_LOG, label: 'Audit Log', icon: Clock3 },
    ],
  },
  {
    label: 'OUTBOUND',
    items: [
      { path: ROUTES.PERFORMANCE, label: 'Performance', icon: BarChart3 },
      { path: ROUTES.CAMPAIGNS, label: 'Campaigns', icon: Megaphone },
      { path: ROUTES.SEQUENCE_BUILDER, label: 'Sequence Builder', icon: Link2 },
      { path: ROUTES.TEMPLATES, label: 'Templates', icon: FileText },
      { path: ROUTES.ACTIVE_SEQUENCES, label: 'Active Sequences', icon: Send },
    ],
  },
  {
    label: 'INFRASTRUCTURE',
    items: [
      { path: ROUTES.CONNECTED_INBOXES, label: 'Connected Inboxes', icon: Inbox },
      { path: ROUTES.INBOX_HUB, label: 'Inbox Hub', icon: Mail },
      { path: ROUTES.SETTINGS, label: 'Settings', icon: Settings },
    ],
  },
] as const;

export function LeadRouteLayout() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Box className={styles.shell}>
      <button
        className={`${styles.mobileBackdrop}${sidebarOpen ? ` ${styles.mobileBackdropVisible}` : ''}`}
        aria-label="Close navigation"
        onClick={() => setSidebarOpen(false)}
      />
      <aside className={`${styles.sidebar}${sidebarOpen ? ` ${styles.mobileSidebarOpen}` : ''}`}>
        <Box className={styles.brand}>
          <Box className={styles.brandMark}>
            <Zap size={18} />
          </Box>
          <Box>
            <Box className={styles.brandTitle}>LearnRoute</Box>
            <Box className={styles.brandSub}>INTENT · AUTOMATION</Box>
          </Box>
        </Box>
        <Box className={styles.navScroll}>
          {navGroups.map((group) => (
            <Box key={group.label}>
              <Box className={styles.sectionTitle}>{group.label}</Box>
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={({ isActive }) =>
                      `${styles.navItem}${isActive ? ` ${styles.navItemActive}` : ''}`
                    }
                  >
                    <Icon size={16} />
                    <span>{item.label}</span>
                    {'badge' in item && <span className={styles.navBadge}>{item.badge}</span>}
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
              aria-label="Open navigation"
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
        <Box className={styles.assistButton}>文</Box>
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
