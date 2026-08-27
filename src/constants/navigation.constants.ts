import {
  BarChart3,
  ClipboardCheck,
  Clock3,
  FileText,
  Inbox,
  Link2,
  ListChecks,
  Mail,
  Megaphone,
  Send,
  Settings,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react';
import { ROUTES } from './route.constants';

export const NAVIGATION_LABELS = {
  APP_NAME: 'LearnRoute',
  APP_TAGLINE: 'INTENT / AUTOMATION',
  MAIN: 'MAIN',
  OUTBOUND: 'OUTBOUND',
  INFRASTRUCTURE: 'INFRASTRUCTURE',
  DASHBOARD: 'Dashboard',
  VERIFICATION_QUEUE: 'Verification Queue',
  APPROVALS: 'Approvals',
  AUDIT_LOG: 'Audit Log',
  PERFORMANCE: 'Performance',
  CAMPAIGNS: 'Campaigns',
  SEQUENCE_BUILDER: 'Sequence Builder',
  TEMPLATES: 'Templates',
  ACTIVE_SEQUENCES: 'Active Sequences',
  CONNECTED_INBOXES: 'Connected Inboxes',
  INBOX_HUB: 'Inbox Hub',
  SETTINGS: 'Settings',
  CLOSE_MENU: 'Close navigation menu',
  OPEN_MENU: 'Open navigation menu',
} as const;

export interface SidebarItem {
  key: string;
  path: string;
  label: string;
  icon: LucideIcon;
  badge?: string;
}

export interface SidebarGroup {
  label: string;
  items: SidebarItem[];
}

export const SIDEBAR_GROUPS: SidebarGroup[] = [
  {
    label: NAVIGATION_LABELS.MAIN,
    items: [
      { key: 'dashboard', path: ROUTES.DASHBOARD, label: NAVIGATION_LABELS.DASHBOARD, icon: ListChecks },
      {
        key: 'verification',
        path: ROUTES.VERIFICATION_QUEUE,
        label: NAVIGATION_LABELS.VERIFICATION_QUEUE,
        icon: ClipboardCheck,
        badge: '11',
      },
      { key: 'approvals', path: ROUTES.APPROVALS, label: NAVIGATION_LABELS.APPROVALS, icon: ShieldCheck },
      { key: 'audit', path: ROUTES.AUDIT_LOG, label: NAVIGATION_LABELS.AUDIT_LOG, icon: Clock3 },
    ],
  },
  {
    label: NAVIGATION_LABELS.OUTBOUND,
    items: [
      { key: 'performance', path: ROUTES.PERFORMANCE, label: NAVIGATION_LABELS.PERFORMANCE, icon: BarChart3 },
      { key: 'campaigns', path: ROUTES.CAMPAIGNS, label: NAVIGATION_LABELS.CAMPAIGNS, icon: Megaphone },
      { key: 'sequence', path: ROUTES.SEQUENCE_BUILDER, label: NAVIGATION_LABELS.SEQUENCE_BUILDER, icon: Link2 },
      { key: 'templates', path: ROUTES.TEMPLATES, label: NAVIGATION_LABELS.TEMPLATES, icon: FileText },
      { key: 'active', path: ROUTES.ACTIVE_SEQUENCES, label: NAVIGATION_LABELS.ACTIVE_SEQUENCES, icon: Send },
    ],
  },
  {
    label: NAVIGATION_LABELS.INFRASTRUCTURE,
    items: [
      { key: 'inboxes', path: ROUTES.CONNECTED_INBOXES, label: NAVIGATION_LABELS.CONNECTED_INBOXES, icon: Inbox },
      { key: 'hub', path: ROUTES.INBOX_HUB, label: NAVIGATION_LABELS.INBOX_HUB, icon: Mail },
      { key: 'settings', path: ROUTES.SETTINGS, label: NAVIGATION_LABELS.SETTINGS, icon: Settings },
    ],
  },
];
