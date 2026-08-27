import { Box, Button, InputAdornment, MenuItem, TextField, Typography } from '@mui/material';
import { Building2, Check, Search, Sparkles, Upload, X } from 'lucide-react';
import { prospects } from '../../data/leadRouteDemoData';
import sharedStyles from '../../LeadRouteApp.module.scss';
import screenStyles from './VerificationQueueScreen.module.scss';
const styles = { ...sharedStyles, ...screenStyles };
import { cx, Tag } from '../LeadRouteScreenShared';

export type DialogName =
  | 'templateCreate'
  | 'templateEdit'
  | 'salesImport'
  | 'csvUpload'
  | 'csvMap'
  | 'csvPreview'
  | 'addContacts'
  | 'connectInbox'
  | 'prospectImport'
  | null;

export function VerificationQueueScreen({
  openDialog,
}: {
  openDialog: (dialog: DialogName) => void;
}) {
  const selectedProspect = prospects[0];

  return (
    <main className={cx(styles.content, styles.contentWide)}>
      <Box className={styles.queueLayout}>
        <Box className={styles.queueList}>
          <Box className={styles.queueHeader}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography fontWeight={800}>Verification Queue</Typography>
                <Typography color="text.secondary" fontSize={12}>
                  11 pending approval
                </Typography>
              </Box>
              <Button
                variant="contained"
                startIcon={<Upload size={14} />}
                onClick={() => openDialog('prospectImport')}
              >
                Import
              </Button>
            </Box>
            <TextField
              select
              fullWidth
              size="small"
              value="all"
              sx={{ mt: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={15} />
                  </InputAdornment>
                ),
              }}
            >
              <MenuItem value="all">All sources</MenuItem>
              <MenuItem value="r2b2">R2B2 webhook</MenuItem>
              <MenuItem value="bulk">Bulk upload</MenuItem>
            </TextField>
          </Box>
          {prospects.map((prospect, index) => (
            <Box className={cx(styles.queueItem, index === 0 && styles.queueItemActive)} key={prospect.email}>
              <Box display="flex" justifyContent="space-between">
                <Box>
                  <Typography fontWeight={700}>{prospect.name}</Typography>
                  <Typography color="text.secondary" fontSize={12}>
                    {prospect.title} / {prospect.company}
                  </Typography>
                </Box>
                <Tag>Bulk</Tag>
              </Box>
              <Box className={styles.buttonRow} mt={1}>
                <Tag tone="green">+ Clay Enriched</Tag>
                <Tag tone="blue">HubSpot: Synced</Tag>
              </Box>
            </Box>
          ))}
        </Box>
        <Box className={styles.detailStack}>
          <Box className={cx(styles.panel, styles.panelPad)}>
            <Box display="flex" justifyContent="space-between">
              <Box>
                <Box className={styles.buttonRow}>
                  <Tag>Bulk upload</Tag>
                  <Tag tone="green">Clay Enriched</Tag>
                  <Tag tone="blue">HubSpot: Synced</Tag>
                </Box>
                <Typography fontSize={28} fontWeight={800} mt={1}>
                  {selectedProspect.name}
                </Typography>
                <Typography color="text.secondary">
                  {selectedProspect.title} / {selectedProspect.company}
                </Typography>
              </Box>
              <Box className={styles.buttonRow}>
                <Button variant="outlined" startIcon={<Building2 size={14} />}>
                  LinkedIn
                </Button>
                <Button variant="outlined" startIcon={<Building2 size={14} />}>
                  Company
                </Button>
              </Box>
            </Box>
            <Box className={cx(styles.grid, styles.grid3)} mt={3}>
              <Box>
                <Typography color="text.secondary" fontSize={12}>
                  Email
                </Typography>
                <Typography>{selectedProspect.email}</Typography>
              </Box>
              <Box>
                <Typography color="text.secondary" fontSize={12}>
                  HubSpot Contact
                </Typography>
                <Typography>hs_p_178350367228_3</Typography>
              </Box>
              <Box>
                <Typography color="text.secondary" fontSize={12}>
                  HubSpot Company
                </Typography>
                <Typography>hsc_p_178350367228_3</Typography>
              </Box>
            </Box>
          </Box>
          <Box className={cx(styles.panel, styles.panelPad)}>
            <Typography fontWeight={800} mb={2}>
              Dual-Context Intel
            </Typography>
            <Box className={styles.tabs} sx={{ maxWidth: 420 }}>
              <button className={cx(styles.tab, styles.tabActive)}>Ingest Context</button>
              <button className={styles.tab}>Clay Social Listening</button>
            </Box>
            <Typography className={styles.label}>UPLOAD CONTEXT</Typography>
            <Box className={styles.bodyPreview}>Tag: Manual-Import-08/07/2026</Box>
          </Box>
          <Box className={cx(styles.panel, styles.panelPad)}>
            <Typography fontWeight={800}>Contact Enrichment</Typography>
            <Typography color="text.secondary" fontSize={13}>
              Append verified work email and direct dial from your connected vendor.
            </Typography>
            <Box className={cx(styles.grid, styles.grid2)} mt={3}>
              <Box>
                <Typography color="text.secondary" fontSize={12}>
                  Work email
                </Typography>
                <Typography fontStyle="italic">Not appended</Typography>
              </Box>
              <Box>
                <Typography color="text.secondary" fontSize={12}>
                  Direct dial
                </Typography>
                <Typography fontStyle="italic">Not appended</Typography>
              </Box>
            </Box>
          </Box>
          <Box className={cx(styles.panel, styles.panelPad)}>
            <Typography fontWeight={800} fontSize={18} mb={2}>
              Outreach Strategy
            </Typography>
            <Box className={styles.tabs}>
              <button className={cx(styles.tab, styles.tabActive)}>
                A / AI Hyper-Personalization
              </button>
              <button className={styles.tab}>B / Direct Template Load</button>
            </Box>
            <Box className={styles.formGrid} mt={2}>
              <TextField select label="AI Model" defaultValue="gpt-4o" size="small">
                <MenuItem value="gpt-4o">gpt-4o</MenuItem>
              </TextField>
              <TextField select label="Base Style" defaultValue="1st" size="small">
                <MenuItem value="1st">1st</MenuItem>
              </TextField>
              <Button
                className={styles.full}
                variant="contained"
                startIcon={<Sparkles size={16} />}
              >
                Generate AI Draft (Intent + Clay + OnDot rules)
              </Button>
              <TextField
                className={styles.full}
                label="Subject"
                size="small"
                placeholder="Subject line..."
              />
              <TextField
                className={styles.full}
                label="Body"
                multiline
                minRows={8}
                placeholder="Generated email body will appear here..."
              />
            </Box>
          </Box>
          <Box position="sticky" bottom={0} display="flex" justifyContent="flex-end" gap={2} py={2}>
            <Button variant="outlined" color="error" startIcon={<X size={16} />}>
              Reject
            </Button>
            <Button variant="contained" startIcon={<Check size={16} />}>
              Approve & Start Sequence
            </Button>
          </Box>
        </Box>
      </Box>
    </main>
  );
}

