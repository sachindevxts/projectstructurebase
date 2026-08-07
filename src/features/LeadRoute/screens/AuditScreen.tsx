import { Box, Button, InputAdornment, TextField, Typography } from '@mui/material';
import { Clock3, Search, Upload, User } from 'lucide-react';
import { useState } from 'react';
import styles from '../LeadRouteApp.module.scss';
import { PageHeader, Tag, auditRows } from './LeadRouteScreenShared';
import { cx } from './LeadRouteScreenShared';

export function AuditScreen() {
  const [filter, setFilter] = useState('All Events');
  const rows =
    filter === 'All Events'
      ? auditRows
      : auditRows.filter((row) => row[2].replace('-', ' ') === filter.toUpperCase());

  return (
    <main className={styles.content}>
      <PageHeader
        title="Audit Log"
        subtitle="Full history of who approved or rejected each prospect, with before -> after status and timestamps."
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
          {['All Events', 'Approved', 'Rejected', 'Re-Queued', 'Status Changed'].map((item) => (
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
        {(rows.length ? rows : auditRows).map(([date, time, action, name, before, after]) => (
          <Box className={styles.logRow} key={`${date}-${time}-${name}`}>
            <Box>
              <Typography color="text.secondary" fontSize={12}>
                {date}
              </Typography>
              <Typography>{time}</Typography>
            </Box>
            <Box>
              <Tag
                tone={action === 'APPROVED' ? 'green' : action === 'REJECTED' ? 'red' : 'default'}
              >
                {action}
              </Tag>
              <Typography component="span" ml={1}>
                ashetty@xtsworld.in changed {name}
              </Typography>
              <Box className={styles.buttonRow} mt={1}>
                <Tag
                  tone={before === 'Approved' ? 'green' : before === 'Rejected' ? 'red' : 'default'}
                >
                  {before}
                </Tag>
                <Typography color="text.secondary">{'->'}</Typography>
                <Tag
                  tone={after === 'Approved' ? 'green' : after === 'Rejected' ? 'red' : 'default'}
                >
                  {after}
                </Tag>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
    </main>
  );
}
