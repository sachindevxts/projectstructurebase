import { Box, Button, Chip, Switch, TextField, Typography } from '@mui/material';
import { Clock3, Link2, Plus, Trash2, Zap } from 'lucide-react';
import styles from '../LeadRouteApp.module.scss';
import { PageHeader, Tag, cx } from './LeadRouteScreenShared';

export function SequenceScreen() {
  return (
    <main className={styles.content}>
      <PageHeader
        title="Sequence Builder"
        subtitle="Build template-based drip cadences. Per-prospect AI follow-ups are managed in Active Sequences."
        action={
          <Button variant="contained" startIcon={<Plus size={16} />}>
            New Sequence
          </Button>
        }
      />
      <Box
        className={cx(styles.panel, styles.panelPad)}
        sx={{ bgcolor: '#edf4ff', borderColor: '#b8d3ff' }}
      >
        <Box display="flex" gap={2} alignItems="center">
          <Box className={styles.iconTile}>
            <Clock3 size={18} />
          </Box>
          <Box flex={1}>
            <Typography fontWeight={800}>Master follow-up cadence</Typography>
            <Typography color="text.secondary" fontSize={12}>
              Controls follow-up gaps across every active sequence. Step 1 is the initial send.
            </Typography>
          </Box>
          <Tag>0 active sequences</Tag>
          <Button variant="contained" startIcon={<Zap size={16} />}>
            Apply to all active
          </Button>
        </Box>
        <Box className={styles.buttonRow} mt={2}>
          {[
            'STEP 1 Initial Sends immediately on launch. Day 0',
            'STEP 2 3 Business Days after previous.',
            'STEP 3 4 Business Days after previous.',
          ].map((step) => (
            <Box
              className={cx(styles.panel, styles.panelPad)}
              sx={{ width: 160, minHeight: 86 }}
              key={step}
            >
              <Typography fontSize={11} color="text.secondary">
                {step}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
      {[1, 2].map((item) => (
        <Box className={cx(styles.panel, styles.panelPad)} mt={3} key={item}>
          <Box display="flex" justifyContent="space-between">
            <Box display="flex" gap={2}>
              <Box className={styles.iconTile}>
                <Link2 size={18} />
              </Box>
              <Box>
                <Typography fontWeight={800}>New Sequence</Typography>
                <Typography color="text.secondary" fontSize={12}>
                  {item === 1 ? '1 steps' : '3 steps'} · Draft
                </Typography>
              </Box>
            </Box>
            <Box className={styles.buttonRow}>
              <Typography fontSize={12}>Stop on genuine reply</Typography>
              <Switch defaultChecked size="small" />
              <Typography fontSize={12}>Active</Typography>
              <Switch size="small" />
              <Trash2 size={16} />
            </Box>
          </Box>
          <Button size="small" sx={{ mt: 1 }}>
            Hide steps
          </Button>
          <Box className={styles.bodyPreview}>
            <Box className={styles.buttonRow}>
              <Chip label="1" color="primary" />
              <Typography fontSize={12}>Delay</Typography>
              <TextField size="small" defaultValue="0" sx={{ width: 76 }} />
              <Typography fontSize={12}>business days</Typography>
              <Tag>Template</Tag>
              <Button color="error" sx={{ ml: 'auto' }}>
                Remove
              </Button>
            </Box>
            <TextField
              fullWidth
              size="small"
              placeholder="Pick a preloaded template..."
              sx={{ mt: 1 }}
            />
            <TextField fullWidth size="small" defaultValue="Step 1" sx={{ mt: 1 }} />
            <TextField
              fullWidth
              multiline
              minRows={4}
              defaultValue="Hi {{first_name}}..."
              sx={{ mt: 1 }}
            />
          </Box>
          <Button variant="outlined" size="small" startIcon={<Plus size={14} />} sx={{ mt: 1 }}>
            Add step
          </Button>
        </Box>
      ))}
    </main>
  );
}
