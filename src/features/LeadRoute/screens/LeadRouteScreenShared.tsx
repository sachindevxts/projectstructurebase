import { Box, Typography } from '@mui/material';
import type { ReactNode } from 'react';
import styles from '../LeadRouteApp.module.scss';
import { Building2, Inbox, Link2, Mail, Search, Send, Sparkles } from 'lucide-react';

export const prospects = [
  ['James O’Brien', 'Ramp'],
  ['Elena Park', 'Retool'],
  ['Diego Alvarez', 'Clay'],
  ['Karen Wu', 'Mercury'],
  ['Robert Singh', 'PostHog'],
  ['Megan Flores', 'Brex'],
  ['Tom Becker', 'Anthropic'],
  ['Lina Hoffmann', 'Loom'],
  ['Jordan Pham', 'Figma'],
  ['Ava Nakamura', 'Webflow'],
];

export const integrations = [
  ['R2B2', 'Anonymous visitor -> LinkedIn match', 'LEAD SOURCES', Link2, '#ede9fe'],
  ['LinkedIn Sales Navigator', 'Import leads & saved lists', 'LEAD SOURCES', Building2, '#e0f2fe'],
  ['Clay', 'Social listening + funding signals', 'ENRICHMENT', Sparkles, '#d1fae5'],
  ['ZoomInfo', 'Work email + direct dial', 'ENRICHMENT', Inbox, '#e0f2fe'],
  ['Lusha', 'B2B email & phone enrichment', 'ENRICHMENT', Mail, '#ffedd5'],
  ['Apollo.io', 'Email + mobile + intent signals', 'ENRICHMENT', Send, '#f3e8ff'],
  ['Hunter.io', 'Email finder & verifier', 'ENRICHMENT', Search, '#fef3c7'],
  ['HubSpot', 'Sync contacts & deals to your CRM', 'CRM', Inbox, '#fee2e2'],
];

export const auditRows = [
  ['08/07/2026', '15:52:38', 'APPROVED', 'Priya Raman', 'Pending', 'Approved'],
  ['08/07/2026', '15:37:15', 'REJECTED', 'Marcus Bell', 'Approved', 'Rejected'],
  ['08/07/2026', '15:36:47', 'RE-QUEUED', 'Marcus Bell', 'Rejected', 'Pending'],
  ['08/07/2026', '15:36:45', 'REJECTED', 'Marcus Bell', 'Approved', 'Rejected'],
  ['08/07/2026', '15:36:44', 'APPROVED', 'Marcus Bell', 'Pending', 'Approved'],
  ['08/07/2026', '15:36:42', 'REJECTED', 'Sarah Chen', 'Approved', 'Rejected'],
  ['08/07/2026', '15:36:41', 'APPROVED', 'Sarah Chen', 'Pending', 'Approved'],
  ['08/07/2026', '15:35:37', 'RE-QUEUED', 'Marcus Bell', 'Rejected', 'Pending'],
];

export function cx(...names: Array<string | false | undefined>) {
  return names.filter(Boolean).join(' ');
}

export function Tag({ children, tone = 'default' }: { children: ReactNode; tone?: string }) {
  return (
    <span
      className={cx(
        styles.tag,
        tone === 'blue' && styles.tagBlue,
        tone === 'green' && styles.tagGreen,
        tone === 'red' && styles.tagRed,
        tone === 'yellow' && styles.tagYellow,
      )}
    >
      {children}
    </span>
  );
}

export function PageHeader({
  title,
  subtitle,
  icon,
  action,
}: {
  title: string;
  subtitle: string;
  icon?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <Box className={styles.pageHeader}>
      <Box>
        <Box className={styles.titleRow}>
          {icon}
          <h1 className={styles.pageTitle}>{title}</h1>
        </Box>
        <p className={styles.pageSubtitle}>{subtitle}</p>
      </Box>
      {action}
    </Box>
  );
}
