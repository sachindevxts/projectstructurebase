import { Box } from '@mui/material';
import type { ReactNode } from 'react';
import styles from '../LeadRouteApp.module.scss';

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
