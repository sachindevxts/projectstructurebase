import { Alert, Box, Button, Divider, Stack, Switch, TextField, Typography } from '@mui/material';
import { Building2, Plus, Trash2, Upload, User } from 'lucide-react';
import { useState } from 'react';
import styles from '../LeadRouteApp.module.scss';
import { PageHeader, Tag, cx } from './LeadRouteScreenShared';

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

export function CampaignsScreen({ openDialog }: { openDialog: (dialog: DialogName) => void }) {
  const [toast, setToast] = useState(false);

  return (
    <main className={styles.content}>
      {toast && (
        <Alert
          severity="success"
          sx={{ position: 'fixed', top: 20, right: 24, zIndex: 20, minWidth: 320 }}
          onClose={() => setToast(false)}
        >
          Campaign created.
        </Alert>
      )}
      <PageHeader
        title="Campaigns"
        subtitle="Create a campaign, bulk-add or CSV-import contacts, schedule sends, and track analytics - all from one window."
        icon={<Building2 color="#4285f4" />}
      />
      <Box className={styles.campaignShell}>
        <Box className={cx(styles.panel, styles.campaignList)}>
          <Box display="flex" gap={1}>
            <TextField size="small" placeholder="New campaign name" fullWidth />
            <Button variant="contained" onClick={() => setToast(true)}>
              <Plus size={16} />
            </Button>
          </Box>
          <Stack mt={2} gap={1}>
            {[1, 2].map((item) => (
              <Box
                className={cx(styles.campaignTile, item === 1 && styles.campaignTileActive)}
                key={item}
              >
                <Box display="flex" justifyContent="space-between">
                  <Typography fontWeight={700}>Untitled Campaign</Typography>
                  <Tag>Draft</Tag>
                </Box>
                <Typography color="text.secondary" fontSize={12}>
                  0 · {item + 1} steps
                </Typography>
              </Box>
            ))}
          </Stack>
        </Box>
        <Box className={cx(styles.panel, styles.panelPad)}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography fontWeight={800}>Untitled Campaign</Typography>
            <Box className={styles.buttonRow}>
              <Typography fontSize={12}>Stop on reply</Typography>
              <Switch defaultChecked size="small" />
              <Typography fontSize={12}>Draft</Typography>
              <Switch size="small" />
              <Trash2 size={16} />
            </Box>
          </Box>
          <TextField
            fullWidth
            size="small"
            placeholder="Campaign description / target audience..."
            sx={{ mt: 2 }}
          />
          <Box className={styles.tabs} sx={{ mt: 2 }}>
            {['Contacts (0)', 'Sequence (2)', 'Templates', 'Schedule', 'Analytics'].map(
              (tab, index) => (
                <button className={cx(styles.tab, index === 0 && styles.tabActive)} key={tab}>
                  {tab}
                </button>
              ),
            )}
          </Box>
          <Typography color="text.secondary" fontSize={12} mt={2}>
            Bulk-pick from your prospect pool, import a CSV, or pull a list directly from LinkedIn
            Sales Navigator.
          </Typography>
          <Box className={styles.buttonRow} mt={2}>
            <Button
              variant="outlined"
              startIcon={<Building2 size={14} />}
              onClick={() => openDialog('salesImport')}
            >
              Sales Navigator
            </Button>
            <Button
              variant="outlined"
              startIcon={<Upload size={14} />}
              onClick={() => openDialog('csvUpload')}
            >
              Import CSV
            </Button>
            <Button
              variant="contained"
              startIcon={<User size={14} />}
              onClick={() => openDialog('addContacts')}
            >
              Add contacts
            </Button>
          </Box>
          <Typography color="text.secondary" fontSize={11} mt={2}>
            CSV columns supported: email (required), first_name, last_name, company, title,
            linkedin_url.
          </Typography>
          <Box className={styles.bodyPreview} mt={2} textAlign="center" py={3}>
            No contacts yet. Click Add contacts or Import CSV.
          </Box>
          <Divider sx={{ my: 2 }} />
          <Typography color="text.secondary" fontSize={12}>
            Campaign uses 1 available templates from your Templates library. Sticky-sender routing
            kicks in once a contact gets their first send.
          </Typography>
        </Box>
      </Box>
    </main>
  );
}
