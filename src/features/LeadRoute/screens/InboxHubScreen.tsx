import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import styles from '../LeadRouteApp.module.scss';
import { ROUTES } from '@/constants/route.constants';
import { PageHeader, cx } from './LeadRouteScreenShared';

export function InboxHubScreen() {
  const navigate = useNavigate();

  return (
    <main className={styles.content}>
      <PageHeader
        title="Inbox Hub"
        subtitle="Live sequences, sticky-sender locks, and prioritized manual follow-ups."
      />
      <Box className={styles.infoBand}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography fontWeight={800}>Active Sequences moved to its own workspace</Typography>
            <Typography color="text.secondary" fontSize={12}>
              1 prospect in flight · pick Template or AI per individual, see source +
              initial-outreach badges.
            </Typography>
          </Box>
          <Button variant="contained" onClick={() => navigate(ROUTES.ACTIVE_SEQUENCES)}>
            Open Active Sequences
          </Button>
        </Box>
      </Box>
      <Box className={cx(styles.panel, styles.panelPad)} mt={3}>
        <Box display="flex" justifyContent="space-between">
          <Typography fontWeight={800}>Replies / Manual Follow-up Needed</Typography>
          <Typography color="text.secondary" fontSize={12}>
            0 waiting
          </Typography>
        </Box>
        <Typography textAlign="center" color="text.secondary" py={4}>
          No replies pending.
        </Typography>
      </Box>
      <Box className={cx(styles.panel, styles.panelPad)} mt={3}>
        <Typography fontWeight={800}>Email Activity Log</Typography>
        <Box className={cx(styles.grid, styles.grid3)} mt={3}>
          {[
            'PROSPECT',
            'STEP',
            'SENDER (STICKY)',
            'METHOD',
            'GMAIL QUEUE · SCHEDULED',
            'STATUS',
            'HUBSPOT ENGAGEMENT',
          ].map((col) => (
            <Typography key={col} color="text.secondary" fontSize={11} fontWeight={800}>
              {col}
            </Typography>
          ))}
        </Box>
      </Box>
    </main>
  );
}
