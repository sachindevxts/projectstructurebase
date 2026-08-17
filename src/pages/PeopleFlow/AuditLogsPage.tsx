import React, { useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Chip,
  Drawer,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import {
  ChevronRight as ChevronRightIcon,
  Close as CloseIcon,
  Download as DownloadIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { ReusableTable, type TableColumn } from '@/components/common';
import { useAppSelector } from '@/hooks';
import { hasPermission } from '@/utils/permission.utils';
import styles from './AuditLogsPage.module.scss';

type AuditAction = 'Override' | 'Updated' | 'Created' | 'Status Change';

interface AuditLog {
  id: string;
  date: string;
  time: string;
  user: string;
  entity: string;
  action: AuditAction;
  summary: React.ReactNode;
  reason: string;
}

const auditLogs: AuditLog[] = [
  {
    id: 'ALLOC-0142',
    date: 'Jul 15, 2025',
    time: '14:32:08',
    user: 'Arjun Kapoor',
    entity: 'Allocation',
    action: 'Override',
    summary: (
      <>
        Created allocation for <strong>Neha Joshi</strong> on <strong>NovaBank Portal</strong> at 130%
      </>
    ),
    reason: 'Project deadline requires immediate additional capacity',
  },
  {
    id: 'EMP-001',
    date: 'Jul 14, 2025',
    time: '11:18:44',
    user: 'Arjun Kapoor',
    entity: 'Employee',
    action: 'Updated',
    summary: (
      <>
        Updated designation for <strong>Aditi Mehra</strong> from React Developer to Senior React Developer
      </>
    ),
    reason: 'Annual performance promotion',
  },
  {
    id: 'ALLOC-0140',
    date: 'Jul 14, 2025',
    time: '09:45:01',
    user: 'Vikram Sharma',
    entity: 'Allocation',
    action: 'Created',
    summary: (
      <>
        Allocated <strong>Meera Nair</strong> to <strong>HealthBridge Mobile</strong> at 50%
      </>
    ),
    reason: '-',
  },
  {
    id: 'PRJ-003',
    date: 'Jul 13, 2025',
    time: '16:22:33',
    user: 'Arjun Kapoor',
    entity: 'Project',
    action: 'Status Change',
    summary: (
      <>
        Changed project status for <strong>HealthBridge Mobile</strong> from Active to At Risk
      </>
    ),
    reason: 'Resource shortage and timeline slippage',
  },
  {
    id: 'EMP-013',
    date: 'Jul 12, 2025',
    time: '10:00:00',
    user: 'Vikram Sharma',
    entity: 'Employee',
    action: 'Created',
    summary: <>Added new employee <strong>Meera Nair</strong> to Engineering dept.</>,
    reason: 'New hire onboarding',
  },
  {
    id: 'ROLE-003',
    date: 'Jul 10, 2025',
    time: '14:55:21',
    user: 'Arjun Kapoor',
    entity: 'Role',
    action: 'Updated',
    summary: (
      <>
        Updated permission matrix for <strong>Resource Manager</strong> role - enabled Override permission
      </>
    ),
    reason: 'Operational requirement',
  },
];

const actionClass: Record<AuditAction, string> = {
  Override: styles.overrideChip,
  Updated: styles.updatedChip,
  Created: styles.createdChip,
  'Status Change': styles.statusChip,
};

const getInitials = (name: string) =>
  name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

const codeSnapshot = `{
  "employee_id": "EMP-005",
  "project_id": "PRJ-001",
  "allocation_pct": 30,
  "billability": "Billable",
  "start_date": "2025-07-15",
  "end_date": "2025-08-15",
  "override": true,
  "override_reason": "Deadline critical"
}`;

const DetailRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <Stack direction="row" justifyContent="space-between" spacing={2} className={styles.detailRow}>
    <Typography variant="body2">{label}</Typography>
    <Typography variant="body2" className={styles.detailValue}>{value}</Typography>
  </Stack>
);

const AuditLogsPage = () => {
  const user = useAppSelector((state) => state.auth.user);
  const canExportAuditLogs = hasPermission(user, ['audit-logs:export']);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [page, setPage] = useState(0);
  const columns: TableColumn<AuditLog>[] = [
    {
      id: 'date',
      label: 'Date & Time',
      renderCell: (log) => (
        <>
          <Typography className={styles.dateText}>{log.date}</Typography>
          <Typography variant="caption" className={styles.timeText}>
            {log.time}
          </Typography>
        </>
      ),
    },
    {
      id: 'user',
      label: 'User',
      renderCell: (log) => (
        <Stack direction="row" spacing={1.25} alignItems="center">
          <Avatar className={styles.avatar}>{getInitials(log.user)}</Avatar>
          <Typography className={styles.userName}>{log.user}</Typography>
        </Stack>
      ),
    },
    {
      id: 'entity',
      label: 'Entity',
      renderCell: (log) => (
        <>
          <Typography className={styles.entityText}>{log.entity}</Typography>
          <Typography variant="caption" className={styles.entityId}>
            {log.id}
          </Typography>
        </>
      ),
    },
    {
      id: 'action',
      label: 'Action',
      renderCell: (log) => <Chip label={log.action} size="small" className={actionClass[log.action]} />,
    },
    {
      id: 'summary',
      label: 'Summary',
      renderCell: (log) => <Typography variant="body2">{log.summary}</Typography>,
    },
    { id: 'reason', label: 'Reason', field: 'reason' },
    {
      id: 'details',
      label: 'Details',
      align: 'center',
      renderCell: (log) => (
        <Button
          variant="text"
          endIcon={<ChevronRightIcon />}
          className={styles.viewButton}
          onClick={() => setSelectedLog(log)}
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <Box className={styles.page}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'stretch', sm: 'flex-start' }}
        spacing={2}
        className={styles.header}
      >
        <Box>
          <Typography variant="h4" className={styles.title}>
            Audit Logs
          </Typography>
          <Typography variant="body2" className={styles.subtitle}>
            Immutable activity log - all changes are permanently recorded
          </Typography>
        </Box>
        {canExportAuditLogs && (
          <Button variant="outlined" startIcon={<DownloadIcon />} className={styles.exportButton}>
            Export CSV
          </Button>
        )}
      </Stack>

      <Paper elevation={0} className={styles.filtersCard}>
        <Stack direction="row" spacing={1.5} alignItems="flex-end" className={styles.filters}>
          <TextField
            size="small"
            placeholder="Search by user, entity, action..."
            className={styles.searchInput}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
          <Box className={styles.selectWrap}>
            <Typography variant="caption">Entity Type</Typography>
            <Select size="small" value="All" className={styles.select}>
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Allocation">Allocation</MenuItem>
              <MenuItem value="Employee">Employee</MenuItem>
              <MenuItem value="Project">Project</MenuItem>
              <MenuItem value="Role">Role</MenuItem>
            </Select>
          </Box>
          <Box className={styles.selectWrap}>
            <Typography variant="caption">Action</Typography>
            <Select size="small" value="All" className={styles.select}>
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Override">Override</MenuItem>
              <MenuItem value="Updated">Updated</MenuItem>
              <MenuItem value="Created">Created</MenuItem>
            </Select>
          </Box>
          <Box className={styles.selectWrap}>
            <Typography variant="caption">User</Typography>
            <Select size="small" value="All Users" className={styles.select}>
              <MenuItem value="All Users">All Users</MenuItem>
              <MenuItem value="Arjun Kapoor">Arjun Kapoor</MenuItem>
              <MenuItem value="Vikram Sharma">Vikram Sharma</MenuItem>
            </Select>
          </Box>
          <Box className={styles.dateWrap}>
            <Typography variant="caption">Date Range</Typography>
            <TextField size="small" type="date" value="2025-07-01" className={styles.dateInput} />
          </Box>
          <Button variant="text" className={styles.clearButton}>Clear</Button>
        </Stack>
      </Paper>

      <ReusableTable
        rows={auditLogs}
        columns={columns}
        getRowId={(log) => `${log.id}-${log.time}`}
        pagination={{
          page,
          rowsPerPage: 15,
          totalRows: 1248,
          showRowsPerPage: false,
          onPageChange: setPage,
          formatResultCount: () => 'Showing 1-6 of 1,248 entries',
        }}
      />

      <Drawer
        anchor="right"
        open={Boolean(selectedLog)}
        onClose={() => setSelectedLog(null)}
        PaperProps={{ className: styles.drawerPaper }}
      >
        <Box className={styles.drawerHeader}>
          <Box>
            <Typography variant="h6" className={styles.drawerTitle}>Audit Detail</Typography>
            <Typography variant="caption" className={styles.drawerTimestamp}>Jul 15, 2025 - 14:32:08</Typography>
          </Box>
          <IconButton size="small" onClick={() => setSelectedLog(null)}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        <Box className={styles.drawerContent}>
          <Paper elevation={0} className={styles.metaCard}>
            <DetailRow label="Entity" value={<strong>Allocation</strong>} />
            <DetailRow label="Record ID" value="ALLOC-0142" />
            <DetailRow label="Changed By" value={<strong>Arjun Kapoor</strong>} />
            <DetailRow label="Timestamp" value="Jul 15, 2025 - 14:32:08 IST" />
            <DetailRow label="Action" value={<Chip label="Override" size="small" className={styles.overrideChip} />} />
            <DetailRow label="IP Address" value="10.0.1.42" />
            <DetailRow label="Correlation ID" value="req_7f8a3c..." />
          </Paper>

          <Typography variant="subtitle2" className={styles.sectionTitle}>Override Reason</Typography>
          <Paper elevation={0} className={styles.reasonBox}>
            Project deadline requires immediate additional capacity. Approved by delivery manager.
          </Paper>

          <Typography variant="subtitle2" className={styles.sectionTitle}>Field Changes</Typography>
          <Paper elevation={0} className={styles.changesCard}>
            <Box className={styles.changeHead}>
              <span>Field</span>
              <span>Old Value</span>
              <span>New Value</span>
            </Box>
            <Box className={styles.changeRow}>
              <strong>Allocation %</strong>
              <span className={styles.oldValue}>30%</span>
              <span className={styles.newValue}>-</span>
            </Box>
            <Box className={styles.changeRow}>
              <strong>Status</strong>
              <span className={styles.oldValue}>Active</span>
              <span className={styles.newValue}>None</span>
            </Box>
            <Box className={styles.changeRow}>
              <strong>Total Allocation</strong>
              <span className={styles.oldValue}>130% △</span>
              <span className={styles.newValue}>100%</span>
            </Box>
          </Paper>

          <Typography variant="subtitle2" className={styles.sectionTitle}>Full Record Snapshot</Typography>
          <Paper component="pre" elevation={0} className={styles.snapshot}>
            {codeSnapshot}
          </Paper>
        </Box>
      </Drawer>
    </Box>
  );
};

export default AuditLogsPage;

