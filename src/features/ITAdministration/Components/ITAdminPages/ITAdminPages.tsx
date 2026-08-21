import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  FormControl,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip as ChartTooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  Box as BoxIcon,
  CalendarDays,
  Clock,
  Flame,
  KeyRound,
  Laptop,
  PackageCheck,
  Plus,
  Ticket,
  UserX,
  Zap,
} from 'lucide-react';
import { ReusableTable, type TableColumn } from '@/components/common';
import { PageSkeleton } from '@/components/common/Skeleton/PageSkeleton';
import { ROUTES } from '@/constants/route.constants';
import {
  itAdminService,
  type ITAsset,
  type ITConfiguration,
  type ITDashboard,
  type ITSetupRequest,
  type ITSoftwareLicence,
  type ITTicket,
  type TicketCategory,
  type TicketPriority,
  type TicketStatus,
} from '../../services/itAdminService';
import styles from './ITAdminPages.module.scss';

const categories: TicketCategory[] = [
  'HARDWARE',
  'SOFTWARE',
  'NETWORK_VPN',
  'EMAIL_ACCOUNT_ACCESS',
  'PASSWORD_ACCESS_REQUEST',
  'APPLICATION_ISSUE',
  'SECURITY_INCIDENT',
  'DEVICE_REQUEST',
  'OTHER',
];
const priorities: TicketPriority[] = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
const statuses: TicketStatus[] = ['OPEN', 'ASSIGNED', 'IN_PROGRESS', 'WAITING_FOR_USER', 'RESOLVED', 'CLOSED'];
const dateRanges = [
  { label: 'Last 7 Days', value: '7d' },
  { label: 'Last 30 Days', value: '30d' },
  { label: 'Last 90 Days', value: '90d' },
  { label: 'This Month', value: 'month' },
  { label: 'This Quarter', value: 'quarter' },
];
const statusColors = ['#4b55bf', '#e18418', '#319b91', '#667085', '#ef4444', '#8b5cf6'];

const formatLabel = (value: string) => value.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (c: string) => c.toUpperCase());

const Header = ({ title, subtitle, action }: { title: string; subtitle: string; action?: React.ReactNode }) => (
  <Box className={styles.header}>
    <Box>
      <Typography variant="h4" className={styles.title}>{title}</Typography>
      <Typography variant="body2" className={styles.subtitle}>{subtitle}</Typography>
    </Box>
    {action}
  </Box>
);

export const ITDashboardPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const range = searchParams.get('range') ?? '30d';
  const [data, setData] = useState<ITDashboard | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    setError('');
    setData(null);
    void itAdminService
      .getDashboard({ range })
      .then((value) => {
        if (active) setData(value);
      })
      .catch(() => {
        if (active) setError('Unable to load IT dashboard.');
      });
    return () => {
      active = false;
    };
  }, [range]);

  const goTickets = (params: Record<string, string>) =>
    navigate(`${ROUTES.IT_TICKETS}?${new URLSearchParams(params).toString()}`);
  const goAssets = (params: Record<string, string>) =>
    navigate(`${ROUTES.IT_ASSETS}?${new URLSearchParams(params).toString()}`);

  if (error) {
    return (
      <Box className={styles.page}>
        <Alert severity="error" action={<Button onClick={() => setSearchParams({ range })}>Retry</Button>}>
          {error}
        </Alert>
      </Box>
    );
  }

  if (!data) return <PageSkeleton />;

  const primary = [
    { label: 'Open Tickets', value: data.ticketMetrics.open, note: `${data.ticketMetrics.openTrendPercentage}% vs last period`, icon: <Ticket size={18} />, tone: 'indigo', onClick: () => goTickets({ status: 'OPEN' }) },
    { label: 'Unassigned', value: data.ticketMetrics.unassigned, note: 'Action required', icon: <UserX size={18} />, tone: 'orange', onClick: () => goTickets({ assignedAgentUserId: 'unassigned' }) },
    { label: 'Critical', value: data.ticketMetrics.critical, note: 'Response time tracked', icon: <Flame size={18} />, tone: 'red', onClick: () => goTickets({ priority: 'CRITICAL' }) },
    { label: 'SLA Breached', value: data.ticketMetrics.slaBreached, note: 'High priority monitored', icon: <Clock size={18} />, tone: 'redStrong', onClick: () => goTickets({ status: 'overdue' }) },
    { label: 'Avg Res. Time', value: `${data.ticketMetrics.averageResolutionHours}h`, note: `${data.ticketMetrics.resolutionTrendPercentage}% improvement`, icon: <Zap size={18} />, tone: 'teal' },
  ];
  const secondary = [
    { label: 'Assets Assigned', value: data.assetMetrics.assigned.toLocaleString(), icon: <Laptop size={22} />, note: '', onClick: () => goAssets({ status: 'ASSIGNED' }) },
    { label: 'Available Stock', value: data.assetMetrics.available.toLocaleString(), icon: <BoxIcon size={22} />, note: 'Healthy', onClick: () => goAssets({ status: 'AVAILABLE' }) },
    { label: 'Pending Onboarding', value: data.onboardingMetrics.pending, icon: <PackageCheck size={22} />, note: `${data.onboardingMetrics.dueThisWeek} due this week`, onClick: () => navigate(`${ROUTES.IT_SETUP}?status=PENDING`) },
    { label: 'Licences Expiring', value: data.licenceMetrics.expiringWithin30Days, icon: <KeyRound size={22} />, note: 'Within 30 days', onClick: () => navigate(`${ROUTES.IT_SOFTWARE}?expiring=30d`) },
  ];

  return (
    <Box className={`${styles.page} ${styles.opsDashboard}`}>
      <Header
        title="IT Operations Dashboard"
        subtitle="Real-time health of IT services, assets, and infrastructure."
        action={(
          <Stack direction="row" gap={1.5}>
            <FormControl size="small">
              <Select
                value={range}
                onChange={(event) => setSearchParams({ range: event.target.value })}
                className={styles.rangeSelect}
                renderValue={(value) => (
                  <Stack direction="row" gap={1} alignItems="center">
                    <CalendarDays size={14} />
                    {dateRanges.find((item) => item.value === value)?.label}
                  </Stack>
                )}
              >
                {dateRanges.map((item) => <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>)}
              </Select>
            </FormControl>
            <Button variant="contained" startIcon={<Plus size={16} />} onClick={() => navigate(ROUTES.IT_TICKET_NEW)}>
              Create Ticket
            </Button>
          </Stack>
        )}
      />
      <Box className={styles.primaryGrid}>
        {primary.map((item) => (
          <Paper key={item.label} elevation={0} tabIndex={0} role={item.onClick ? 'button' : undefined} onClick={item.onClick} onKeyDown={(event) => { if (event.key === 'Enter') item.onClick?.(); }} className={`${styles.kpiCard} ${styles[item.tone]}`}>
            <Box className={styles.kpiHead}>
              <Typography className={styles.kpiLabel}>{item.label}</Typography>
              <span className={styles.kpiIcon}>{item.icon}</span>
            </Box>
            <Typography className={styles.kpiValue}>{item.value}</Typography>
            <Typography className={styles.kpiNote}>{item.note}</Typography>
          </Paper>
        ))}
      </Box>
      <Box className={styles.secondaryGrid}>
        {secondary.map((item) => (
          <Paper key={item.label} elevation={0} tabIndex={0} role="button" onClick={item.onClick} onKeyDown={(event) => { if (event.key === 'Enter') item.onClick(); }} className={styles.secondaryCard}>
            <span className={styles.secondaryIcon}>{item.icon}</span>
            <Box>
              <Typography className={styles.kpiLabel}>{item.label}</Typography>
              <Typography className={styles.secondaryValue}>{item.value}</Typography>
              {item.note && <Typography className={styles.kpiNote}>{item.note}</Typography>}
            </Box>
          </Paper>
        ))}
      </Box>
      <Box className={styles.chartGrid}>
        <Paper elevation={0} className={styles.chartWide}>
          <Typography variant="h6">Ticket Volume & SLA Compliance</Typography>
          <ResponsiveContainer width="100%" height={230}>
            <LineChart data={data.ticketVolumeAndSla}>
              <CartesianGrid stroke="#edf1f7" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis yAxisId="left" tick={{ fontSize: 11 }} />
              <YAxis yAxisId="right" orientation="right" domain={[0, 100]} tick={{ fontSize: 11 }} />
              <ChartTooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="volume" name="Volume" stroke="#4b55bf" strokeWidth={3} />
              <Line yAxisId="right" type="monotone" dataKey="slaCompliancePercentage" name="SLA %" stroke="#319b91" strokeDasharray="4 4" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </Paper>
        <Paper elevation={0} className={styles.chartCard}>
          <Typography variant="h6">Tickets by Status</Typography>
          <ResponsiveContainer width="100%" height={230}>
            <PieChart>
              <Pie data={data.ticketsByStatus} dataKey="count" nameKey="status" innerRadius={58} outerRadius={86} onClick={(entry) => goTickets({ status: entry.status })}>
                {data.ticketsByStatus.map((entry, index) => <Cell key={entry.status} fill={statusColors[index % statusColors.length]} />)}
              </Pie>
              <ChartTooltip formatter={(value, name) => [value, formatLabel(String(name))]} />
              <Legend formatter={(value) => formatLabel(String(value))} />
            </PieChart>
          </ResponsiveContainer>
        </Paper>
        <Paper elevation={0} className={styles.chartCard}>
          <Typography variant="h6">Asset Distribution</Typography>
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={data.assetsByType}>
              <CartesianGrid stroke="#edf1f7" />
              <XAxis dataKey="assetType" tick={{ fontSize: 11 }} tickFormatter={formatLabel} />
              <YAxis tick={{ fontSize: 11 }} />
              <ChartTooltip labelFormatter={(label) => formatLabel(String(label))} />
              <Bar dataKey="count" fill="#6b73c9" onClick={(entry) => goAssets({ type: entry.assetType })} />
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      </Box>
      <Box className={styles.lowerGrid}>
        <Paper elevation={0} className={styles.tableCard}>
          <Box className={styles.cardHeader}>
            <Typography variant="h6">Critical & Overdue Tickets</Typography>
            <Button size="small" onClick={() => goTickets({ priority: 'CRITICAL', status: 'overdue' })}>View All</Button>
          </Box>
          <Box className={styles.ticketTable}>
            <Box className={styles.ticketHeader}><span>Ticket</span><span>Requester</span><span>Priority</span><span>Status</span><span>Due</span></Box>
            {data.criticalAndOverdueTickets.length ? data.criticalAndOverdueTickets.map((ticket) => (
              <Box key={ticket.id} role="button" tabIndex={0} className={styles.ticketRow} onClick={() => navigate(`/it-admin/tickets/${ticket.id}`)} onKeyDown={(event) => { if (event.key === 'Enter') navigate(`/it-admin/tickets/${ticket.id}`); }}>
                <Tooltip title={ticket.title}><span><b>{ticket.ticketNumber}</b><small>{ticket.title}</small></span></Tooltip>
                <span className={styles.requester}><Avatar src={ticket.requester.avatarUrl ?? undefined}>{ticket.requester.name.charAt(0).toUpperCase()}</Avatar>{ticket.requester.name}</span>
                <Chip size="small" label={formatLabel(ticket.priority)} className={styles[`chip${ticket.priority}`]} />
                <Chip size="small" label={formatLabel(ticket.status)} className={styles.statusChip} />
                <b className={styles.overdue}>{ticket.overdueMinutes ? `${Math.round(ticket.overdueMinutes / 60)}h overdue` : 'Due soon'}</b>
              </Box>
            )) : <Typography className={styles.empty}>No critical or overdue tickets.</Typography>}
          </Box>
        </Paper>
        <Paper elevation={0} className={styles.sideCard}>
          <Typography variant="h6">Expiring Licences</Typography>
          <Stack spacing={1.25} mt={2}>
            {data.expiringLicences.length ? data.expiringLicences.map((licence) => (
              <Box key={licence.id} className={styles.licenceItem} onClick={() => navigate(`${ROUTES.IT_SOFTWARE}?licenceId=${licence.id}`)}>
                <span className={styles.productIcon}><KeyRound size={16} /></span>
                <span><b>{licence.name}</b><small>{licence.plan}</small></span>
                <b className={styles.overdue}>{licence.daysRemaining <= 0 ? 'Expired' : `${licence.daysRemaining} days`}</b>
              </Box>
            )) : <Typography className={styles.empty}>No licences expiring soon.</Typography>}
          </Stack>
          <Typography className={styles.sectionMini}>Inventory Alerts</Typography>
          <Stack spacing={1} mt={1}>
            {data.inventoryAlerts.length ? data.inventoryAlerts.map((alert) => (
              <Box key={alert.assetTypeId} className={styles.alertItem} onClick={() => goAssets({ type: alert.assetTypeId })}>
                <span>{alert.name}</span>
                <Chip size="small" color={alert.severity === 'CRITICAL' ? 'error' : 'warning'} label={`Low: ${alert.available} left`} />
              </Box>
            )) : <Typography className={styles.empty}>No inventory alerts.</Typography>}
          </Stack>
        </Paper>
      </Box>
      <Typography className={styles.updated}>Last updated {new Date(data.generatedAt).toLocaleString()}</Typography>
    </Box>
  );
};

export const ITTicketsPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [rows, setRows] = useState<ITTicket[]>([]);
  const [page, setPage] = useState(0);
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const result = await itAdminService.getTickets(page + 1, 20, Object.fromEntries(searchParams.entries()));
      setRows(result.data);
      setTotalRows(result.totalRecords);
    } finally {
      setLoading(false);
    }
  }, [page, searchParams]);

  useEffect(() => { void load(); }, [load]);

  const columns: TableColumn<ITTicket>[] = [
    { id: 'number', label: 'Ticket', field: 'ticketNumber' },
    { id: 'subject', label: 'Subject', field: 'subject' },
    { id: 'requester', label: 'Requester', field: 'requesterEmail' },
    { id: 'priority', label: 'Priority', renderCell: (row) => <Chip size="small" label={row.priority} /> },
    { id: 'status', label: 'Status', renderCell: (row) => <Chip size="small" label={formatLabel(row.status)} /> },
    {
      id: 'actions',
      label: 'Actions',
      renderCell: (row) => <Button size="small" onClick={() => navigate(`/it-admin/tickets/${row.id}`)}>View</Button>,
    },
  ];

  return (
    <Box className={styles.page}>
      <Header
        title="IT Tickets"
        subtitle="Create, assign, update and resolve support tickets."
        action={<Button variant="contained" onClick={() => navigate(ROUTES.IT_TICKET_NEW)}>Create Ticket</Button>}
      />
      <ReusableTable
        rows={rows}
        columns={columns}
        getRowId={(row) => row.id}
        loading={loading}
        pagination={{ page, rowsPerPage: 20, totalRows, onPageChange: setPage, showRowsPerPage: false }}
      />
    </Box>
  );
};

export const ITCreateTicketPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    subject: '',
    description: '',
    category: 'HARDWARE' as TicketCategory,
    priority: 'MEDIUM' as TicketPriority,
    department: '',
  });

  const submit = async () => {
    try {
      setError('');
      const ticket = await itAdminService.createTicket(form);
      navigate(`/it-admin/tickets/${ticket.id}`);
    } catch {
      setError('Unable to create ticket. Check required fields and try again.');
    }
  };

  return (
    <Box className={styles.page}>
      <Header title="Create IT Ticket" subtitle="Raise hardware, software, network, access or application support requests." />
      {error && <Alert severity="error">{error}</Alert>}
      <Box className={styles.form}>
        <TextField label="Subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
        <TextField select label="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as TicketCategory })}>
          {categories.map((item) => <MenuItem key={item} value={item}>{formatLabel(item)}</MenuItem>)}
        </TextField>
        <TextField select label="Priority" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value as TicketPriority })}>
          {priorities.map((item) => <MenuItem key={item} value={item}>{formatLabel(item)}</MenuItem>)}
        </TextField>
        <TextField label="Department" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} />
        <TextField className={styles.wide} multiline minRows={5} label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <Box className={`${styles.formActions} ${styles.wide}`}>
          <Button variant="contained" onClick={submit}>Submit Ticket</Button>
        </Box>
      </Box>
    </Box>
  );
};

export const ITTicketDetailPage = () => {
  const { ticketId } = useParams();
  const [ticket, setTicket] = useState<ITTicket | null>(null);
  const [comment, setComment] = useState('');
  const [status, setStatus] = useState<TicketStatus>('OPEN');

  const load = useCallback(async () => {
    if (!ticketId) return;
    const value = await itAdminService.getTicket(ticketId);
    setTicket(value);
    setStatus(value.status);
  }, [ticketId]);

  useEffect(() => { void load(); }, [load]);

  if (!ticket) return <PageSkeleton />;

  const updateStatus = async () => {
    if (!ticketId) return;
    setTicket(await itAdminService.updateTicket(ticketId, { status }));
  };

  const addComment = async () => {
    if (!ticketId || !comment.trim()) return;
    setTicket(await itAdminService.addTicketComment(ticketId, { body: comment }));
    setComment('');
  };

  return (
    <Box className={styles.page}>
      <Header title={`${ticket.ticketNumber}: ${ticket.subject}`} subtitle={`${formatLabel(ticket.category)} - SLA due ${new Date(ticket.slaDueAt).toLocaleString()}`} />
      <Paper elevation={0} className={styles.card}>
        <Stack spacing={1.5}>
          <Typography>{ticket.description}</Typography>
          <Stack direction="row" gap={1} flexWrap="wrap">
            <Chip label={ticket.priority} />
            <Chip label={formatLabel(ticket.status)} />
            <Chip label={ticket.requesterEmail} />
          </Stack>
        </Stack>
      </Paper>
      <Box className={styles.form}>
        <TextField select label="Status" value={status} onChange={(e) => setStatus(e.target.value as TicketStatus)}>
          {statuses.map((item) => <MenuItem key={item} value={item}>{formatLabel(item)}</MenuItem>)}
        </TextField>
        <Box className={styles.formActions}><Button variant="contained" onClick={updateStatus}>Update Status</Button></Box>
        <TextField className={styles.wide} label="Comment" value={comment} onChange={(e) => setComment(e.target.value)} />
        <Box className={`${styles.formActions} ${styles.wide}`}><Button onClick={addComment}>Add Comment</Button></Box>
      </Box>
      <Paper elevation={0} className={styles.card}>
        <Typography variant="h6">Comments</Typography>
        <Stack spacing={1} mt={2}>
          {ticket.comments.map((item) => <Typography key={item.id} variant="body2"><b>{item.authorEmail}</b>: {item.body}</Typography>)}
        </Stack>
      </Paper>
    </Box>
  );
};

export const ITAssetsPage = () => {
  const [searchParams] = useSearchParams();
  const [rows, setRows] = useState<ITAsset[]>([]);
  const [page, setPage] = useState(0);
  const [totalRows, setTotalRows] = useState(0);
  const [form, setForm] = useState({ assetTag: '', serialNumber: '', type: 'LAPTOP', brand: '', model: '' });
  const [assignEmployeeId, setAssignEmployeeId] = useState('');

  const load = useCallback(async () => {
    const result = await itAdminService.getAssets(page + 1, 20, Object.fromEntries(searchParams.entries()));
    setRows(result.data);
    setTotalRows(result.totalRecords);
  }, [page, searchParams]);

  useEffect(() => { void load(); }, [load]);

  const create = async () => {
    await itAdminService.createAsset(form);
    setForm({ assetTag: '', serialNumber: '', type: 'LAPTOP', brand: '', model: '' });
    await load();
  };

  const columns: TableColumn<ITAsset>[] = [
    { id: 'tag', label: 'Asset Tag', field: 'assetTag' },
    { id: 'type', label: 'Type', field: 'type' },
    { id: 'model', label: 'Brand / Model', renderCell: (row) => `${row.brand} ${row.model}` },
    { id: 'status', label: 'Status', renderCell: (row) => <Chip size="small" label={formatLabel(row.status)} /> },
    { id: 'assigned', label: 'Assigned Employee', field: 'assignedEmployeeId' },
    {
      id: 'actions',
      label: 'Actions',
      renderCell: (row) => (
        <Box className={styles.actions}>
          <Button size="small" disabled={!assignEmployeeId || row.status === 'ASSIGNED'} onClick={async () => { await itAdminService.assignAsset(row.id, { employeeId: assignEmployeeId }); await load(); }}>Assign</Button>
          <Button size="small" disabled={row.status !== 'ASSIGNED'} onClick={async () => { await itAdminService.returnAsset(row.id); await load(); }}>Return</Button>
        </Box>
      ),
    },
  ];

  return (
    <Box className={styles.page}>
      <Header title="IT Assets" subtitle="Manage laptops, desktops, monitors, mobiles, printers and accessories." />
      <Box className={styles.form}>
        {(['assetTag', 'serialNumber', 'brand', 'model'] as const).map((key) => (
          <TextField key={key} label={formatLabel(key)} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
        ))}
        <TextField label="Type" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} />
        <TextField label="Assign Employee ID" value={assignEmployeeId} onChange={(e) => setAssignEmployeeId(e.target.value)} />
        <Box className={styles.formActions}><Button variant="contained" onClick={create}>Add Asset</Button></Box>
      </Box>
      <ReusableTable rows={rows} columns={columns} getRowId={(row) => row.id} pagination={{ page, rowsPerPage: 20, totalRows, onPageChange: setPage, showRowsPerPage: false }} />
    </Box>
  );
};

export const ITSetupPage = () => {
  const [rows, setRows] = useState<ITSetupRequest[]>([]);
  const [page, setPage] = useState(0);
  const [totalRows, setTotalRows] = useState(0);
  const [form, setForm] = useState({ employeeId: '', employeeName: '', type: 'ONBOARDING' as const });

  const load = useCallback(async () => {
    const result = await itAdminService.getSetupRequests(page + 1, 20);
    setRows(result.data);
    setTotalRows(result.totalRecords);
  }, [page]);

  useEffect(() => { void load(); }, [load]);

  const create = async () => {
    await itAdminService.createSetupRequest({
      ...form,
      checklist: ['Laptop/device assignment', 'Official email', 'Required applications', 'VPN', 'Repository access', 'Project tools', 'Shared drive', 'ID/access card', 'Security policies acknowledged'].map((label) => ({ id: label, label, status: 'PENDING' })),
    });
    setForm({ employeeId: '', employeeName: '', type: 'ONBOARDING' });
    await load();
  };

  const columns: TableColumn<ITSetupRequest>[] = [
    { id: 'employee', label: 'Employee', field: 'employeeName' },
    { id: 'type', label: 'Type', field: 'type' },
    { id: 'status', label: 'Status', renderCell: (row) => <Chip size="small" label={formatLabel(row.status)} /> },
    { id: 'items', label: 'Checklist', renderCell: (row) => `${row.checklist.filter((item) => item.status === 'COMPLETED').length}/${row.checklist.length}` },
  ];

  return (
    <Box className={styles.page}>
      <Header title="System Setup Requests" subtitle="Track onboarding and offboarding access, device and policy work." />
      <Box className={styles.form}>
        <TextField label="Employee ID" value={form.employeeId} onChange={(e) => setForm({ ...form, employeeId: e.target.value })} />
        <TextField label="Employee Name" value={form.employeeName} onChange={(e) => setForm({ ...form, employeeName: e.target.value })} />
        <TextField select label="Type" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as 'ONBOARDING' })}>
          <MenuItem value="ONBOARDING">Onboarding</MenuItem>
          <MenuItem value="OFFBOARDING">Offboarding</MenuItem>
        </TextField>
        <Box className={styles.formActions}><Button variant="contained" onClick={create}>Create Setup</Button></Box>
      </Box>
      <ReusableTable rows={rows} columns={columns} getRowId={(row) => row.id} pagination={{ page, rowsPerPage: 20, totalRows, onPageChange: setPage, showRowsPerPage: false }} />
    </Box>
  );
};

export const ITSoftwarePage = () => {
  const [rows, setRows] = useState<ITSoftwareLicence[]>([]);
  const [page, setPage] = useState(0);
  const [totalRows, setTotalRows] = useState(0);
  const [form, setForm] = useState({ name: '', vendor: '', category: '', licenceCount: 1 });
  const [employeeId, setEmployeeId] = useState('');

  const load = useCallback(async () => {
    const result = await itAdminService.getSoftware(page + 1, 20);
    setRows(result.data);
    setTotalRows(result.totalRecords);
  }, [page]);

  useEffect(() => { void load(); }, [load]);

  const create = async () => {
    await itAdminService.createSoftware(form);
    setForm({ name: '', vendor: '', category: '', licenceCount: 1 });
    await load();
  };

  const columns: TableColumn<ITSoftwareLicence>[] = [
    { id: 'name', label: 'Software', field: 'name' },
    { id: 'vendor', label: 'Vendor', field: 'vendor' },
    { id: 'count', label: 'Licences', renderCell: (row) => `${row.assignedCount}/${row.licenceCount}` },
    { id: 'available', label: 'Available', field: 'availableCount' },
    { id: 'actions', label: 'Actions', renderCell: (row) => <Button size="small" disabled={!employeeId || row.availableCount <= 0} onClick={async () => { await itAdminService.assignSoftware(row.id, { employeeId }); await load(); }}>Assign</Button> },
  ];

  return (
    <Box className={styles.page}>
      <Header title="Software & Licences" subtitle="Manage software catalogue, licence counts and assignments." />
      <Box className={styles.form}>
        <TextField label="Software" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <TextField label="Vendor" value={form.vendor} onChange={(e) => setForm({ ...form, vendor: e.target.value })} />
        <TextField label="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
        <TextField type="number" label="Licence Count" value={form.licenceCount} onChange={(e) => setForm({ ...form, licenceCount: Number(e.target.value) })} />
        <TextField label="Assign Employee ID" value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} />
        <Box className={styles.formActions}><Button variant="contained" onClick={create}>Add Software</Button></Box>
      </Box>
      <ReusableTable rows={rows} columns={columns} getRowId={(row) => row.id} pagination={{ page, rowsPerPage: 20, totalRows, onPageChange: setPage, showRowsPerPage: false }} />
    </Box>
  );
};

export const ITConfigurationPage = () => {
  const [rows, setRows] = useState<ITConfiguration[]>([]);
  const [form, setForm] = useState({ key: 'ticket-categories', label: 'Ticket Categories', values: '' });

  const load = useCallback(async () => setRows(await itAdminService.getConfiguration()), []);
  useEffect(() => { void load(); }, [load]);

  const save = async () => {
    await itAdminService.upsertConfiguration({
      key: form.key,
      label: form.label,
      values: form.values.split(',').map((value) => value.trim()).filter(Boolean),
    });
    setForm({ key: '', label: '', values: '' });
    await load();
  };

  const columns: TableColumn<ITConfiguration>[] = [
    { id: 'key', label: 'Key', field: 'key' },
    { id: 'label', label: 'Label', field: 'label' },
    { id: 'values', label: 'Values', renderCell: (row) => row.values.join(', ') },
  ];

  return (
    <Box className={styles.page}>
      <Header title="IT Configuration" subtitle="Maintain SLA, category, location, vendor and template configuration." />
      <Box className={styles.form}>
        <TextField label="Key" value={form.key} onChange={(e) => setForm({ ...form, key: e.target.value })} />
        <TextField label="Label" value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} />
        <TextField className={styles.wide} label="Values (comma separated)" value={form.values} onChange={(e) => setForm({ ...form, values: e.target.value })} />
        <Box className={`${styles.formActions} ${styles.wide}`}><Button variant="contained" onClick={save}>Save Configuration</Button></Box>
      </Box>
      <ReusableTable rows={rows} columns={columns} getRowId={(row) => row.id} />
    </Box>
  );
};
