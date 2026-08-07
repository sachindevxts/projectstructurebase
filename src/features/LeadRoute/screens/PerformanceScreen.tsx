import { Box, Typography } from '@mui/material';
import { Activity, BarChart3, FileText, Mail, Sparkles } from 'lucide-react';
import styles from '../LeadRouteApp.module.scss';
import { PageHeader, cx } from './LeadRouteScreenShared';

export function PerformanceScreen() {
  return (
    <main className={styles.content}>
      <PageHeader
        title="Performance Metrics"
        subtitle="Reply, bounce, and volume breakdowns across templates, AI models, sender inboxes, and sequence steps."
        icon={<BarChart3 color="#4285f4" />}
      />
      <Box className={cx(styles.grid, styles.grid4)}>
        {[
          ['EMAILS SENT', '0', Mail],
          ['REPLY RATE', '0.0%', Activity],
          ['AI DRAFTS', '0', Sparkles],
          ['TEMPLATE DRAFTS', '0', FileText],
        ].map(([label, value, Icon]) => (
          <Box className={cx(styles.panel, styles.metric)} key={label as string}>
            <Box>
              <Box className={styles.metricLabel}>{label as string}</Box>
              <Box className={styles.metricValue}>{value as string}</Box>
            </Box>
            <Box className={styles.iconTile}>
              <Icon size={18} />
            </Box>
          </Box>
        ))}
      </Box>
      <Box className={cx(styles.grid, styles.grid2)} mt={3}>
        {[
          'Template Success Rate - Drilldown by Version',
          'Top-Performing Personalisation Signals',
          'AI Hyper-Personalisation Success Rate',
          'Sender Inbox Performance',
          'Per-Step Conversion',
        ].map((title) => (
          <Box className={cx(styles.panel, styles.panelPad)} key={title}>
            <Typography fontWeight={800}>{title}</Typography>
            <Typography color="text.secondary" fontSize={12} mt={2}>
              No data recorded yet.
            </Typography>
          </Box>
        ))}
      </Box>
      <Box className={styles.infoBand} mt={3}>
        Bounce alerts: 0 bounced sends recorded. Replies: 0/0. Numbers refresh live as the simulator
        runs steps and reply events fire.
      </Box>
    </main>
  );
}
