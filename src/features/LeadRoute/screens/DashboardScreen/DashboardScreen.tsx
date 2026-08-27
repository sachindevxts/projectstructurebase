import { Box, Button, Divider, Stack, Typography } from '@mui/material';
import { Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/route.constants';
import { dashboardMetrics, ingestionPipelines } from '../../data/leadRouteDemoData';
import sharedStyles from '../../LeadRouteApp.module.scss';
import screenStyles from './DashboardScreen.module.scss';
const styles = { ...sharedStyles, ...screenStyles };
import { PageHeader, cx } from '../LeadRouteScreenShared';

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
        {dashboardMetrics.map(({ label, value, icon: Icon, background }) => (
          <Box className={cx(styles.panel, styles.metric)} key={label}>
            <Box>
              <Box className={styles.metricLabel}>{label}</Box>
              <Box className={styles.metricValue}>{value}</Box>
            </Box>
            <Box className={styles.iconTile} sx={{ background }}>
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
              <b>0 of 0</b> daily capacity used / click to manage
            </Typography>
          </Box>
          <Divider />
          <Box height={184} />
        </Box>
        <Box className={styles.panel}>
          <Box className={styles.panelPad}>
            <Typography fontWeight={800}>Ingestion Pipelines</Typography>
            <Stack gap={3} mt={3}>
              {ingestionPipelines.map(({ name, count, color }) => (
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

