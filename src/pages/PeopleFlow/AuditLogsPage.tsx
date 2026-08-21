import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
import {
  auditLogService,
  type AuditAction,
  type AuditLogItem,
} from '@/api/services/auditLog.service';
import { ReusableTable, type TableColumn } from '@/components/common';
import { PageSkeleton } from '@/components/common/Skeleton/PageSkeleton';
import { useAppSelector } from '@/hooks';
import { hasPermission } from '@/utils/permission.utils';
import styles from './AuditLogsPage.module.scss';

const actionLabel: Record<AuditAction, string> = {
  CREATE: 'Created',
  UPDATE: 'Updated',
  DELETE: 'Deleted',
  LOGIN: 'Login',
  LOGOUT: 'Logout',
  PASSWORD_CHANGE: 'Password Change',
};

const actionClass: Record<AuditAction, string> = {
  CREATE: styles.createdChip,
  UPDATE: styles.updatedChip,
  DELETE: styles.statusChip,
  LOGIN: styles.createdChip,
  LOGOUT: styles.statusChip,
  PASSWORD_CHANGE: styles.overrideChip,
};

const entityOptions = [
  'employee',
  'user',
  'role',
  'client',
  'skill',
  'department',
  'designation',
  'project',
  'allocation',
];

const formatDateTime = (value: string) => {
  const date = new Date(value);
  return {
    date: date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }),
    time: date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }),
  };
};

const titleCase = (value: string) =>
  value
    .split(/[-_\s]/)
    .filter(Boolean)
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join(' ');

const getInitials = (name: string) =>
  name
    .split('@')[0]
    .split(/[.\s_-]/)
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

const formatJson = (value: unknown) => JSON.stringify(value ?? null, null, 2);

const DetailRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <Stack direction="row" justifyContent="space-between" spacing={2} className={styles.detailRow}>
    <Typography variant="body2">{label}</Typography>
    <Typography variant="body2" className={styles.detailValue}>
      {value}
    </Typography>
  </Stack>
);

const AuditLogsPage = () => {
  const user = useAppSelector((state) => state.auth.user);
  const canExportAuditLogs = hasPermission(user, ['audit-logs:export']);
  const [selectedLog, setSelectedLog] = useState<AuditLogItem | null>(null);
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [page, setPage] = useState(0);
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [entityFilter, setEntityFilter] = useState('All');
  const [actionFilter, setActionFilter] = useState('All');

  const loadAuditLogs = useCallback(async () => {
    try {
      setLoading(true);
      const result = await auditLogService.getAuditLogs(page + 1, 15);
      setLogs(result.data);
      setTotalRows(result.totalRecords);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    void loadAuditLogs();
  }, [loadAuditLogs]);

  const filteredLogs = useMemo(() => {
    const query = search.trim().toLowerCase();
    return logs.filter((log) => {
      const actor = log.metadata?.actorEmail ?? 'system';
      const entityName = log.metadata?.entityName ?? '';
      const message = log.metadata?.message ?? '';
      const matchesSearch =
        !query ||
        actor.toLowerCase().includes(query) ||
        log.entityType.toLowerCase().includes(query) ||
        log.entityId.toLowerCase().includes(query) ||
        entityName.toLowerCase().includes(query) ||
        message.toLowerCase().includes(query) ||
        actionLabel[log.action].toLowerCase().includes(query);
      const matchesEntity = entityFilter === 'All' || log.entityType === entityFilter;
      const matchesAction = actionFilter === 'All' || log.action === actionFilter;
      return matchesSearch && matchesEntity && matchesAction;
    });
  }, [actionFilter, entityFilter, logs, search]);

  const columns: TableColumn<AuditLogItem>[] = [
    {
      id: 'date',
      label: 'Date & Time',
      renderCell: (log) => {
        const timestamp = formatDateTime(log.createdAt);
        return (
          <>
            <Typography className={styles.dateText}>{timestamp.date}</Typography>
            <Typography variant="caption" className={styles.timeText}>
              {timestamp.time}
            </Typography>
          </>
        );
      },
    },
    {
      id: 'user',
      label: 'User',
      renderCell: (log) => {
        const actor = log.metadata?.actorEmail ?? 'system';
        return (
          <Stack direction="row" spacing={1.25} alignItems="center">
            <Avatar className={styles.avatar}>{getInitials(actor)}</Avatar>
            <Typography className={styles.userName}>{actor}</Typography>
          </Stack>
        );
      },
    },
    {
      id: 'entity',
      label: 'Entity',
      renderCell: (log) => (
        <>
          <Typography className={styles.entityText}>{titleCase(log.entityType)}</Typography>
          <Typography variant="caption" className={styles.entityId}>
            {log.entityId}
          </Typography>
        </>
      ),
    },
    {
      id: 'action',
      label: 'Action',
      renderCell: (log) => (
        <Chip label={actionLabel[log.action]} size="small" className={actionClass[log.action]} />
      ),
    },
    {
      id: 'summary',
      label: 'Summary',
      renderCell: (log) => (
        <Typography variant="body2">
          {log.metadata?.message ?? `${titleCase(log.entityType)} was ${actionLabel[log.action].toLowerCase()}.`}
        </Typography>
      ),
    },
    {
      id: 'reason',
      label: 'Reason',
      renderCell: () => <Typography variant="body2">Business change</Typography>,
    },
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

  const selectedTimestamp = selectedLog ? formatDateTime(selectedLog.createdAt) : null;

  if (loading && !logs.length) return <PageSkeleton />;

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
            value={search}
            onChange={(event) => setSearch(event.target.value)}
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
            <Select
              size="small"
              value={entityFilter}
              onChange={(event) => setEntityFilter(event.target.value)}
              className={styles.select}
            >
              <MenuItem value="All">All</MenuItem>
              {entityOptions.map((entity) => (
                <MenuItem key={entity} value={entity}>
                  {titleCase(entity)}
                </MenuItem>
              ))}
            </Select>
          </Box>
          <Box className={styles.selectWrap}>
            <Typography variant="caption">Action</Typography>
            <Select
              size="small"
              value={actionFilter}
              onChange={(event) => setActionFilter(event.target.value)}
              className={styles.select}
            >
              <MenuItem value="All">All</MenuItem>
              {Object.entries(actionLabel).map(([value, label]) => (
                <MenuItem key={value} value={value}>
                  {label}
                </MenuItem>
              ))}
            </Select>
          </Box>
          <Button
            variant="text"
            className={styles.clearButton}
            onClick={() => {
              setSearch('');
              setEntityFilter('All');
              setActionFilter('All');
            }}
          >
            Clear
          </Button>
        </Stack>
      </Paper>

      <ReusableTable
        rows={filteredLogs}
        columns={columns}
        getRowId={(log) => log.id}
        loading={loading}
        pagination={{
          page,
          rowsPerPage: 15,
          totalRows,
          showRowsPerPage: false,
          onPageChange: setPage,
          formatResultCount: ({ from, to, total }) =>
            `Showing ${from}-${to} of ${total} entries`,
        }}
      />

      <Drawer
        anchor="right"
        open={Boolean(selectedLog)}
        onClose={() => setSelectedLog(null)}
        PaperProps={{ className: styles.drawerPaper }}
      >
        {selectedLog && selectedTimestamp && (
          <>
            <Box className={styles.drawerHeader}>
              <Box>
                <Typography variant="h6" className={styles.drawerTitle}>
                  Audit Detail
                </Typography>
                <Typography variant="caption" className={styles.drawerTimestamp}>
                  {selectedTimestamp.date} - {selectedTimestamp.time}
                </Typography>
              </Box>
              <IconButton size="small" onClick={() => setSelectedLog(null)}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>

            <Box className={styles.drawerContent}>
              <Paper elevation={0} className={styles.metaCard}>
                <DetailRow label="Entity" value={<strong>{titleCase(selectedLog.entityType)}</strong>} />
                <DetailRow label="Record ID" value={selectedLog.entityId} />
                <DetailRow label="Changed By" value={<strong>{selectedLog.metadata?.actorEmail ?? 'system'}</strong>} />
                <DetailRow label="Actor Role" value={selectedLog.metadata?.actorRole ?? '-'} />
                <DetailRow label="Timestamp" value={`${selectedTimestamp.date} - ${selectedTimestamp.time} IST`} />
                <DetailRow
                  label="Action"
                  value={
                    <Chip
                      label={actionLabel[selectedLog.action]}
                      size="small"
                      className={actionClass[selectedLog.action]}
                    />
                  }
                />
              </Paper>

              <Typography variant="subtitle2" className={styles.sectionTitle}>
                Summary
              </Typography>
              <Paper elevation={0} className={styles.reasonBox}>
                {selectedLog.metadata?.message ?? 'Business change recorded.'}
              </Paper>

              <Typography variant="subtitle2" className={styles.sectionTitle}>
                Previous Snapshot
              </Typography>
              <Paper component="pre" elevation={0} className={styles.snapshot}>
                {formatJson(selectedLog.metadata?.before)}
              </Paper>

              <Typography variant="subtitle2" className={styles.sectionTitle}>
                New Snapshot
              </Typography>
              <Paper component="pre" elevation={0} className={styles.snapshot}>
                {formatJson(selectedLog.metadata?.after)}
              </Paper>
            </Box>
          </>
        )}
      </Drawer>
    </Box>
  );
};

export default AuditLogsPage;
