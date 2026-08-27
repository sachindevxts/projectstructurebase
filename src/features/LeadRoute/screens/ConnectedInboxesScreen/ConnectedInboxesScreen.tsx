import { Box, Button, Typography } from '@mui/material';
import { Plus } from 'lucide-react';
import sharedStyles from '../../LeadRouteApp.module.scss';
import screenStyles from './ConnectedInboxesScreen.module.scss';
const styles = { ...sharedStyles, ...screenStyles };
import { PageHeader } from '../LeadRouteScreenShared';

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

export function ConnectedInboxesScreen({
  openDialog,
}: {
  openDialog: (dialog: DialogName) => void;
}) {
  return (
    <main className={styles.content}>
      <PageHeader
        title="Connected Inboxes"
        subtitle="Multi-provider sender pool - Gmail, Outlook, Yahoo, or any SMTP/IMAP server. Daily caps + sticky-sender threading enforced automatically."
        action={
          <Button
            variant="contained"
            startIcon={<Plus size={16} />}
            onClick={() => openDialog('connectInbox')}
          >
            Connect New Inbox
          </Button>
        }
      />
      <Typography color="text.secondary">No inboxes connected yet.</Typography>
    </main>
  );
}

