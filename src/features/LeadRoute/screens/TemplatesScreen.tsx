import { Box, Button, IconButton, Typography } from '@mui/material';
import { FileText, Link2, Plus, Trash2 } from 'lucide-react';
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

export function TemplatesScreen({ openDialog }: { openDialog: (dialog: DialogName) => void }) {
  return (
    <main className={styles.content}>
      <PageHeader
        title="Outreach Templates"
        subtitle="Reusable baselines. Supports deep merge tag mapping for AI + static sends."
        action={
          <Button
            variant="contained"
            startIcon={<Plus size={16} />}
            onClick={() => openDialog('templateCreate')}
          >
            New Template
          </Button>
        }
      />
      <Box className={cx(styles.panel, styles.templateCard)}>
        <Box className={styles.templateHead}>
          <Box className={styles.templateIdentity}>
            <Box className={styles.iconTile}>
              <FileText size={17} />
            </Box>
            <Box>
              <Typography fontWeight={800}>1st</Typography>
              <Typography color="text.secondary" fontSize={12}>
                1st
              </Typography>
            </Box>
          </Box>
          <Box className={styles.buttonRow}>
            <IconButton onClick={() => openDialog('templateEdit')}>
              <Link2 size={16} />
            </IconButton>
            <IconButton>
              <Trash2 size={16} />
            </IconButton>
          </Box>
        </Box>
        <Box className={styles.label}>SUBJECT</Box>
        <Typography>1st</Typography>
        <Box className={styles.label}>BODY</Box>
        <Box className={styles.bodyPreview}>1st</Box>
      </Box>
      <Box className={styles.mergeBox} mt={3}>
        <Typography fontWeight={800}>Supported merge tags</Typography>
        <Box className={styles.buttonRow} mt={2}>
          {[
            '{{first_name}}',
            '{{last_name}}',
            '{{company_name}}',
            '{{clay_social_hook}}',
            '{{linkedin_url}}',
          ].map((tag) => (
            <Tag tone="blue" key={tag}>
              {tag}
            </Tag>
          ))}
        </Box>
      </Box>
    </main>
  );
}
