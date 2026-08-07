import { ROUTES } from './route.constants';

export const NAVIGATION_LABELS = {
  APP_NAME: 'LearnRoute',
  APP_TAGLINE: 'INTENT · AUTOMATION',
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

export const SIDEBAR_ITEMS = [
  {
    section: NAVIGATION_LABELS.MAIN,
    items: [
      ['dashboard', NAVIGATION_LABELS.DASHBOARD, ROUTES.DASHBOARD],
      ['verification', NAVIGATION_LABELS.VERIFICATION_QUEUE, ROUTES.VERIFICATION_QUEUE, '11'],
      ['approvals', NAVIGATION_LABELS.APPROVALS, ROUTES.APPROVALS],
      ['audit', NAVIGATION_LABELS.AUDIT_LOG, ROUTES.AUDIT_LOG],
    ],
  },
  {
    section: NAVIGATION_LABELS.OUTBOUND,
    items: [
      ['performance', NAVIGATION_LABELS.PERFORMANCE, ROUTES.PERFORMANCE],
      ['campaigns', NAVIGATION_LABELS.CAMPAIGNS, ROUTES.CAMPAIGNS],
      ['sequence', NAVIGATION_LABELS.SEQUENCE_BUILDER, ROUTES.SEQUENCE_BUILDER],
      ['templates', NAVIGATION_LABELS.TEMPLATES, ROUTES.TEMPLATES],
      ['active', NAVIGATION_LABELS.ACTIVE_SEQUENCES, ROUTES.ACTIVE_SEQUENCES],
    ],
  },
  {
    section: NAVIGATION_LABELS.INFRASTRUCTURE,
    items: [
      ['inboxes', NAVIGATION_LABELS.CONNECTED_INBOXES, ROUTES.CONNECTED_INBOXES],
      ['hub', NAVIGATION_LABELS.INBOX_HUB, ROUTES.INBOX_HUB],
      ['settings', NAVIGATION_LABELS.SETTINGS, ROUTES.SETTINGS],
    ],
  },
] as const;
