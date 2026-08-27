import { Box, Button, InputAdornment, TextField, Typography } from '@mui/material';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { prospects } from '../../data/leadRouteDemoData';
import sharedStyles from '../../LeadRouteApp.module.scss';
import screenStyles from './ApprovalsScreen.module.scss';
const styles = { ...sharedStyles, ...screenStyles };
import { PageHeader, Tag } from '../LeadRouteScreenShared';

const approvalRows = [
  { name: 'Sarah Chen', status: 'Rejected', meta: 'Decision Maker @ Linear / sarah@linear.app' },
  { name: 'Marcus Bell', status: 'Rejected', meta: 'Decision Maker @ Vercel / marcus@vercel.com' },
  { name: 'Priya Raman', status: 'Approved', meta: 'Decision Maker @ Notion / priya@notion.so' },
  ...prospects.slice(3).map((prospect) => ({
    name: prospect.name,
    status: 'Pending',
    meta: `${prospect.title} @ ${prospect.company} / ${prospect.email}`,
  })),
];

export function ApprovalsScreen() {
  const [filter, setFilter] = useState('All');
  const shown = filter === 'All' ? approvalRows : approvalRows.filter((row) => row.status === filter);

  return (
    <main className={styles.content}>
      <PageHeader
        title="Approvals & Rejections"
        subtitle="Audit every decision from the Verification Queue - reverse, re-queue, or flip status in one click."
        action={
          <TextField
            size="small"
            placeholder="Search name, company, email..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={15} />
                </InputAdornment>
              ),
            }}
          />
        }
      />
      <Box className={styles.buttonRow} mb={3}>
        {['Approved', 'Rejected', 'All'].map((tab) => (
          <Button
            key={tab}
            variant={filter === tab ? 'contained' : 'outlined'}
            onClick={() => setFilter(tab)}
          >
            {tab} ({tab === 'All' ? 14 : tab === 'Approved' ? 1 : 2})
          </Button>
        ))}
      </Box>
      <Box className={styles.panel}>
        {shown.map(({ name, status, meta }) => (
          <Box
            key={name}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            p={2}
            borderBottom="1px solid var(--color-border)"
          >
            <Box>
              <Typography fontWeight={800}>
                {name}{' '}
                <Tag
                  tone={status === 'Rejected' ? 'red' : status === 'Approved' ? 'blue' : 'default'}
                >
                  {status}
                </Tag>
              </Typography>
              <Typography color="text.secondary" fontSize={12}>
                {meta}
              </Typography>
            </Box>
            <Box className={styles.buttonRow}>
              {status === 'Pending' ? (
                <>
                  <Button color="success" variant="contained">
                    Approve
                  </Button>
                  <Button color="error" variant="contained">
                    Reject
                  </Button>
                </>
              ) : status === 'Approved' ? (
                <>
                  <Button variant="outlined">Send back to queue</Button>
                  <Button color="error" variant="contained">
                    Reject
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outlined">Re-queue</Button>
                  <Button color="success" variant="contained">
                    Approve instead
                  </Button>
                </>
              )}
            </Box>
          </Box>
        ))}
      </Box>
    </main>
  );
}

