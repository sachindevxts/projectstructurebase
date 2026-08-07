import { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import { Search, Upload, X } from 'lucide-react';
import { ActiveSequencesScreen } from './screens/ActiveSequencesScreen';
import { ApprovalsScreen } from './screens/ApprovalsScreen';
import { AuditScreen } from './screens/AuditScreen';
import { CampaignsScreen } from './screens/CampaignsScreen';
import { ConnectedInboxesScreen } from './screens/ConnectedInboxesScreen';
import { DashboardScreen } from './screens/DashboardScreen';
import { InboxHubScreen } from './screens/InboxHubScreen';
import { PerformanceScreen } from './screens/PerformanceScreen';
import { SequenceScreen } from './screens/SequenceScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { TemplatesScreen } from './screens/TemplatesScreen';
import { VerificationQueueScreen } from './screens/VerificationQueueScreen';

type DialogName =
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

function LeadRouteDialog({ dialog, close }: { dialog: DialogName; close: () => void }) {
  const title = {
    templateCreate: 'Create Template',
    templateEdit: 'Edit Template',
    salesImport: 'Import from Sales Navigator',
    csvUpload: 'CSV Import Wizard - Untitled Campaign',
    csvMap: 'CSV Import Wizard - Untitled Campaign',
    csvPreview: 'CSV Import Wizard - Untitled Campaign',
    addContacts: 'Add contacts to Untitled Campaign',
    connectInbox: 'Connect Email Account',
    prospectImport: 'Import Prospects',
  }[dialog || 'templateCreate'];

  return (
    <Dialog open={Boolean(dialog)} onClose={close} maxWidth={dialog?.startsWith('csv') ? 'md' : 'sm'} fullWidth>
      <DialogTitle display="flex" alignItems="center" justifyContent="space-between">
        <span>{title}</span>
        <IconButton onClick={close}>
          <X size={18} />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {(dialog === 'templateCreate' || dialog === 'templateEdit') && (
          <Box>
            <TextField
              label="Title"
              size="small"
              defaultValue={dialog === 'templateEdit' ? '1st' : ''}
              placeholder="e.g. Problem-Centric"
              autoFocus
              sx={{ mb: 2, width: '100%' }}
            />
            <TextField
              label="Value Prop Focus"
              size="small"
              defaultValue={dialog === 'templateEdit' ? '1st' : ''}
              placeholder="One-line angle"
              sx={{ mb: 2, width: '100%' }}
            />
            <TextField
              label="Subject"
              size="small"
              defaultValue={dialog === 'templateEdit' ? '1st' : ''}
              sx={{ mb: 2, width: '100%' }}
            />
            <TextField
              label="Body"
              multiline
              minRows={9}
              defaultValue={dialog === 'templateEdit' ? '1st' : ''}
              sx={{ width: '100%' }}
            />
          </Box>
        )}
        {dialog === 'salesImport' && (
          <Box>
            <TextField
              fullWidth
              label="Sales Navigator URL"
              size="small"
              defaultValue="https://www.linkedin.com/sales/lists/people/123456789  ·  /sales/search/people?keywords=..."
              autoFocus
            />
            <Typography color="text.secondary" fontSize={12} mt={1}>
              Paste a saved list URL, a people search URL, or an account list URL.
            </Typography>
            <Box display="flex" gap={2} mt={3}>
              <TextField label="Leads to fetch" size="small" defaultValue="25" />
              <Button variant="contained">Fetch leads</Button>
            </Box>
          </Box>
        )}
        {dialog === 'csvUpload' && (
          <Box>
            <Box display="flex" gap={1} mb={2}>
              <Typography color="text.secondary">1 Upload</Typography>
              <Typography color="text.secondary">2 Map columns</Typography>
              <Typography color="text.secondary">3 Validate & preview</Typography>
            </Box>
            <Box sx={{ border: '1px dashed #4285f4', borderRadius: 2, p: 3, textAlign: 'center' }}>
              <Upload size={34} />
              <Typography fontWeight={800} mt={1}>Drop a CSV or click to browse</Typography>
              <Typography color="text.secondary" fontSize={12}>
                We'll auto-detect common columns and let you remap on the next step.
              </Typography>
            </Box>
          </Box>
        )}
        {dialog === 'csvMap' && (
          <Box>
            {['Email *', 'First name', 'Last name', 'Company', 'Job title', 'LinkedIn URL'].map((field) => (
              <Box
                key={field}
                display="grid"
                gridTemplateColumns="150px 1fr 180px"
                gap={2}
                alignItems="center"
                py={1}
                borderBottom="1px solid var(--color-border)"
              >
                <Typography>{field}</Typography>
                <TextField
                  select
                  size="small"
                  defaultValue={field === 'LinkedIn URL' ? 'not' : field.toUpperCase().replace(' *', '').replace(' ', '')}
                >
                  <MenuItem value="EMAIL">EMAIL</MenuItem>
                  <MenuItem value="FIRSTNAME">FIRSTNAME</MenuItem>
                  <MenuItem value="LASTNAME">LASTNAME</MenuItem>
                  <MenuItem value="COMPANY">COMPANY</MenuItem>
                  <MenuItem value="TITLE">TITLE</MenuItem>
                  <MenuItem value="not">-- Not mapped --</MenuItem>
                </TextField>
                <Typography color="text.secondary" fontSize={12}>sample: Sherry</Typography>
              </Box>
            ))}
          </Box>
        )}
        {dialog === 'csvPreview' && (
          <Box>
            <Typography color="text.secondary">Preview step placeholder.</Typography>
          </Box>
        )}
        {dialog === 'addContacts' && (
          <Box>
            <TextField
              fullWidth
              size="small"
              placeholder="Search by name, company, email, title..."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={15} />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        )}
        {dialog === 'connectInbox' && (
          <Box>
            <TextField select fullWidth size="small" label="Provider" defaultValue="gmail">
              <MenuItem value="gmail">Gmail / Google Workspace</MenuItem>
              <MenuItem value="outlook">Outlook</MenuItem>
              <MenuItem value="smtp">SMTP / IMAP</MenuItem>
            </TextField>
            <TextField fullWidth label="Email address" size="small" placeholder="name@yourdomain.com" sx={{ mt: 2 }} />
            <TextField fullWidth label="Daily sending limit" size="small" defaultValue="50" sx={{ mt: 2 }} />
          </Box>
        )}
        {dialog === 'prospectImport' && (
          <Box>
            <Box sx={{ border: '1px dashed #4285f4', borderRadius: 2, p: 3, textAlign: 'center' }}>
              <Upload size={34} />
              <Typography fontWeight={800} mt={1}>Upload CSV or Excel</Typography>
              <Typography color="text.secondary" fontSize={12}>
                .csv, .xlsx, .xls - columns: name, email, company (LinkedIn URL optional)
              </Typography>
            </Box>
            <TextField
              fullWidth
              multiline
              minRows={5}
              defaultValue={`https://linkedin.com/in/jane-doe\nJohn Smith, john@acme.com, Acme Inc`}
              sx={{ mt: 2 }}
            />
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={close}>Cancel</Button>
        {dialog === 'csvUpload' && <Button variant="contained">Next</Button>}
        {dialog === 'csvMap' && <Button variant="contained">Validate & preview</Button>}
        {dialog === 'csvPreview' && <Button variant="contained">Import 870</Button>}
        {dialog === 'connectInbox' && <Button variant="contained">Authorize with Gmail</Button>}
        {dialog === 'prospectImport' && <Button variant="contained">Ingest</Button>}
        {(dialog === 'templateCreate' || dialog === 'templateEdit') && <Button variant="contained">Save</Button>}
        {dialog === 'addContacts' && <Button variant="contained" disabled>Add contacts</Button>}
      </DialogActions>
    </Dialog>
  );
}

export function LeadRouteApp() {
  return <DashboardScreen />;
}

export function LearnRouteDashboardPage() {
  return <DashboardScreen />;
}

export function LearnRouteVerificationQueuePage() {
  const [dialog, setDialog] = useState<DialogName>(null);

  return (
    <>
      <VerificationQueueScreen openDialog={setDialog} />
      <LeadRouteDialog dialog={dialog} close={() => setDialog(null)} />
    </>
  );
}

export function LearnRouteApprovalsPage() {
  return <ApprovalsScreen />;
}

export function LearnRouteAuditLogPage() {
  return <AuditScreen />;
}

export function LearnRoutePerformancePage() {
  return <PerformanceScreen />;
}

export function LearnRouteCampaignsPage() {
  const [dialog, setDialog] = useState<DialogName>(null);

  return (
    <>
      <CampaignsScreen openDialog={setDialog} />
      <LeadRouteDialog dialog={dialog} close={() => setDialog(null)} />
    </>
  );
}

export function LearnRouteSequenceBuilderPage() {
  return <SequenceScreen />;
}

export function LearnRouteTemplatesPage() {
  const [dialog, setDialog] = useState<DialogName>(null);

  return (
    <>
      <TemplatesScreen openDialog={setDialog} />
      <LeadRouteDialog dialog={dialog} close={() => setDialog(null)} />
    </>
  );
}

export function LearnRouteActiveSequencesPage() {
  return <ActiveSequencesScreen />;
}

export function LearnRouteConnectedInboxesPage() {
  const [dialog, setDialog] = useState<DialogName>(null);

  return (
    <>
      <ConnectedInboxesScreen openDialog={setDialog} />
      <LeadRouteDialog dialog={dialog} close={() => setDialog(null)} />
    </>
  );
}

export function LearnRouteInboxHubPage() {
  return <InboxHubScreen />;
}

export function LearnRouteSettingsPage() {
  return <SettingsScreen />;
}

export default LeadRouteApp;
