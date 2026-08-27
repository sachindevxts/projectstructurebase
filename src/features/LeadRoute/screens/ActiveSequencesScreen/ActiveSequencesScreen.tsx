import { Box, Button, TextField, Typography } from '@mui/material';
import { Send, Sparkles, X } from 'lucide-react';
import { useState } from 'react';
import sharedStyles from '../../LeadRouteApp.module.scss';
import screenStyles from './ActiveSequencesScreen.module.scss';
const styles = { ...sharedStyles, ...screenStyles };
import { PageHeader, Tag, cx } from '../LeadRouteScreenShared';

export function ActiveSequencesScreen() {
  const [replyOpen, setReplyOpen] = useState(false);

  return (
    <main className={styles.content}>
      <PageHeader
        title="Active Sequences"
        subtitle="One panel per prospect. Switch any individual's follow-up between a preloaded template or AI-generated copy, simulate inbound replies, and see at a glance how each contact entered the funnel."
      />
      <Typography color="text.secondary" mb={2}>
        <Send size={14} /> 1 prospects in flight
      </Typography>
      <Box className={cx(styles.panel, styles.panelPad)} sx={{ maxWidth: 560 }}>
        <Box display="flex" justifyContent="space-between">
          <Box>
            <Typography fontWeight={800}>
              Priya Raman <Tag tone="yellow">Uploaded</Tag> <Tag>Not sent yet</Tag>
            </Typography>
            <Typography color="text.secondary" fontSize={12}>
              Decision Maker / Notion
            </Typography>
            <Typography color="text.secondary" fontSize={12}>
              Sticky sender: -- / Step 0 of 1
            </Typography>
          </Box>
          <Tag tone="blue">In Sequence</Tag>
        </Box>
        <Box className={styles.bodyPreview} mt={2}>
          <Box display="flex" justifyContent="space-between">
            <Typography fontSize={12}>Follow-up plan for Priya</Typography>
            <Box className={styles.buttonRow}>
              <Button size="small" variant="outlined">
                Use templates for all
              </Button>
              <Button size="small" variant="outlined">
                Use AI for all
              </Button>
            </Box>
          </Box>
          <TextField fullWidth size="small" placeholder="Pick a template..." sx={{ mt: 2 }} />
        </Box>
        {replyOpen ? (
          <Box mt={2}>
            <Button
              variant="outlined"
              startIcon={<X size={14} />}
              onClick={() => setReplyOpen(false)}
            >
              Cancel
            </Button>
            <TextField
              fullWidth
              multiline
              minRows={3}
              sx={{ mt: 1 }}
              placeholder="Paste the reply body. The classifier auto-detects OOO, parental leave, and no longer with the company responses so the sequence only halts for genuine replies."
            />
            <Box textAlign="right" mt={1}>
              <Button variant="contained">Classify & apply</Button>
            </Box>
          </Box>
        ) : (
          <Button
            variant="outlined"
            startIcon={<Sparkles size={14} />}
            sx={{ mt: 2 }}
            onClick={() => setReplyOpen(true)}
          >
            Simulate inbound reply
          </Button>
        )}
      </Box>
    </main>
  );
}

