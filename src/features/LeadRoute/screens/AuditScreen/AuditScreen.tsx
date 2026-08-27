import { Box, Button, InputAdornment, TextField, Typography } from '@mui/material';
import { Clock3, Search, Upload, User } from 'lucide-react';
import { useState } from 'react';
import { auditRows } from '../../data/leadRouteDemoData';
import sharedStyles from '../../LeadRouteApp.module.scss';
import screenStyles from './AuditScreen.module.scss';
const styles = { ...sharedStyles, ...screenStyles };
import { PageHeader, Tag, cx } from '../LeadRouteScreenShared';

const auditFilters = ['All Events', 'Approved', 'Rejected', 'Re-Queued', 'Status Changed'];

export function AuditScreen() {
  const [filter, setFilter] = useState('All Events');
  const rows =
    filter === 'All Events'
      ? auditRows
      : auditRows.filter((row) => row.action.replace('-', ' ') === filter.toUpperCase());

  return (
    <main className={styles.content}>
      <PageHeader
        title="Audit Log"
        subtitle="Full history of who approved or rejected each prospect, with before and after status and timestamps."
        icon={<Clock3 color="#4285f4" />}
        action={
          <Box className={styles.buttonRow}>
            <Button variant="outlined" startIcon={<User size={14} />}>
              Acting as ashetty@xtsworld.in
            </Button>
            <Button variant="outlined" startIcon={<Upload size={14} />}>
              Export CSV
            </Button>
          </Box>
        }
      />
      <Box display="flex" justifyContent="space-between" gap={2} mb={3}>
        <Box className={styles.buttonRow}>
          {auditFilters.map((item) => (
            <Button
              key={item}
              variant={filter === item ? 'contained' : 'outlined'}
              onClick={() => setFilter(item)}
            >
              {item} (
              {item === 'All Events'
                ? 20
                : item === 'Approved'
                  ? 7
                  : item === 'Rejected'
                    ? 6
                    : item === 'Re-Queued'
                      ? 7
                      : 0}
              )
            </Button>
          ))}
        </Box>
        <TextField
          size="small"
          placeholder="Search actor, prospect, note..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search size={15} />
              </InputAdornment>
            ),
          }}
        />
      </Box>
      <Box className={cx(styles.panel, styles.logTable)}>
        {(rows.length ? rows : auditRows).map((row) => (
          <Box className={styles.logRow} key={`${row.date}-${row.time}-${row.prospectName}`}>
            <Box>
              <Typography color="text.secondary" fontSize={12}>
                {row.date}
              </Typography>
              <Typography>{row.time}</Typography>
            </Box>
            <Box>
              <Tag
                tone={row.action === 'APPROVED' ? 'green' : row.action === 'REJECTED' ? 'red' : 'default'}
              >
                {row.action}
              </Tag>
              <Typography component="span" ml={1}>
                {row.actorEmail} changed {row.prospectName}
              </Typography>
              <Box className={styles.buttonRow} mt={1}>
                <Tag
                  tone={
                    row.previousStatus === 'Approved'
                      ? 'green'
                      : row.previousStatus === 'Rejected'
                        ? 'red'
                        : 'default'
                  }
                >
                  {row.previousStatus}
                </Tag>
                <Typography color="text.secondary">{'->'}</Typography>
                <Tag
                  tone={
                    row.nextStatus === 'Approved'
                      ? 'green'
                      : row.nextStatus === 'Rejected'
                        ? 'red'
                        : 'default'
                  }
                >
                  {row.nextStatus}
                </Tag>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
    </main>
  );
}

