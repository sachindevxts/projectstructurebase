import { Box, Button, Divider, Stack, Typography } from '@mui/material';
import { Activity, ClipboardCheck, Mail, ShieldCheck, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import styles from '../LeadRouteApp.module.scss';
import { ROUTES } from '@/constants/route.constants';
import { PageHeader, cx } from './LeadRouteScreenShared';

export function DashboardScreen() {
  const navigate = useNavigate();

  return (
    <main className={cx(styles.content, styles.contentWide)}>
      <PageHeader
        title="Dashboard"
        subtitle="Live intent capture, enrichment, and multi-inbox outreach health."
        action={
          <Button
            variant="contained"
            startIcon={<Sparkles size={16} />}
            onClick={() => navigate(ROUTES.VERIFICATION_QUEUE)}
          >
            Review Queue (11)
          </Button>
        }
      />
      <Box className={cx(styles.grid, styles.grid4)}>
        {[
          ['PENDING APPROVAL', '11', ClipboardCheck, '#fef3c7'],
          ['ACTIVE SEQUENCES', '1', Activity, '#eff6ff'],
          ['REPLIES THIS WEEK', '0', Mail, '#d1fae5'],
          ['PAUSED (STICKY)', '0', ShieldCheck, '#fee2e2'],
        ].map(([label, value, Icon, color]) => (
          <Box className={cx(styles.panel, styles.metric)} key={label as string}>
            <Box>
              <Box className={styles.metricLabel}>{label as string}</Box>
              <Box className={styles.metricValue}>{value as string}</Box>
            </Box>
            <Box className={styles.iconTile} sx={{ background: color as string }}>
              <Icon size={18} />
            </Box>
          </Box>
        ))}
      </Box>
      <Box className={cx(styles.grid, styles.grid2)} mt={3}>
        <Box className={styles.panel}>
          <Box className={styles.panelPad}>
            <Typography fontWeight={800}>Sender Pool Health</Typography>
            <Typography color="text.secondary" fontSize={12}>
              <b>0 of 0</b> daily capacity used · click to manage
            </Typography>
          </Box>
          <Divider />
          <Box height={184} />
        </Box>
        <Box className={styles.panel}>
          <Box className={styles.panelPad}>
            <Typography fontWeight={800}>Ingestion Pipelines</Typography>
            <Stack gap={3} mt={3}>
              {[
                ['R2B2 Webhook', '0', '#4285f4'],
                ['LinkedIn Bulk Upload', '14', '#94a3b8'],
                ['Clay Enriched', '14', '#10b981'],
                ['Synced to HubSpot', '14', '#f97316'],
              ].map(([name, count, color]) => (
                <Box display="flex" alignItems="center" gap={2} key={name}>
                  <Box width={7} height={7} borderRadius="50%" bgcolor={color} />
                  <Typography flex={1} fontSize={13}>
                    {name}
                  </Typography>
                  <Typography fontWeight={800}>{count}</Typography>
                </Box>
              ))}
            </Stack>
          </Box>
        </Box>
      </Box>
    </main>
  );
}
