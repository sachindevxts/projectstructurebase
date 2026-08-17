import React, { useCallback, useMemo, useState } from 'react';
import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  Add as AddIcon,
  Business,
  Close,
  Code,
  DeleteOutline,
  DesignServices,
  EditOutlined,
  GridView,
  List,
  People,
  Search,
  Sort,
  Storage,
  WorkOutline,
} from '@mui/icons-material';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { PfPageHeader } from '@/features/Shared/Components/PfPageHeader/PfPageHeader';
import { CapacityBar } from '@/features/Shared/Components/CapacityBar/CapacityBar';
import { ReusableTable, type TableColumn } from '@/components/common';
import { radius } from '@/styles/theme';
import { useAppSelector } from '@/hooks';
import { hasPermission } from '@/utils/permission.utils';
import type { Department } from '../../types/department.types';
import { DepartmentStats } from '../DepartmentStats/DepartmentStats';
import { useDepartments } from '../../hooks/useDepartments';
import styles from './DepartmentsPage.module.scss';

type ViewMode = 'grid' | 'list';
type SortMode = 'headcount-desc' | 'headcount-asc' | 'billability-desc' | 'bench-desc';

const departmentColors: Record<string, string> = {
  Engineering: 'var(--color-primary)',
  Backend: 'var(--color-text-muted)',
  Design: 'var(--color-warning)',
  QA: 'var(--color-success)',
  Product: 'var(--color-accent-purple)',
  DevOps: 'var(--color-warning)',
};

const departmentIcons: Record<string, React.ReactNode> = {
  Engineering: <Code />,
  Backend: <Storage />,
  Design: <DesignServices />,
  QA: <Search />,
  Product: <Business />,
  DevOps: <WorkOutline />,
};

const emptyDepartment: Omit<Department, 'id'> = {
  name: '',
  code: '',
  head: '',
  employees: 0,
  billable: 0,
  bench: 0,
  billability: 0,
  skills: [],
  status: 'Active',
  description: '',
};

const avatarColors = ['var(--color-primary)', 'var(--color-success)', 'var(--color-warning)', 'var(--color-accent-purple)'];

export const DepartmentsPage = () => {
  const user = useAppSelector((state) => state.auth.user);
  const canCreateDepartment = hasPermission(user, ['departments:create']);
  const canUpdateDepartment = hasPermission(user, ['departments:update']);
  const canDeleteDepartment = hasPermission(user, ['departments:delete']);
  const { departments, loading, stats, createDepartment, deleteDepartment } = useDepartments();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<'All' | Department['status']>('All');
  const [sortMode, setSortMode] = useState<SortMode>('headcount-desc');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [form, setForm] = useState<Omit<Department, 'id'>>(emptyDepartment);
  const [skillsInput, setSkillsInput] = useState('');

  const filteredDepartments = useMemo(() => {
    const searchLower = search.trim().toLowerCase();

    return departments
      .filter((department) => {
        const matchesSearch =
          !searchLower ||
          [department.name, department.code, department.head, department.description ?? '', ...department.skills]
            .join(' ')
            .toLowerCase()
            .includes(searchLower);
        const matchesStatus = status === 'All' || department.status === status;
        return matchesSearch && matchesStatus;
      })
      .sort((first, second) => {
        if (sortMode === 'headcount-asc') return first.employees - second.employees;
        if (sortMode === 'billability-desc') return second.billability - first.billability;
        if (sortMode === 'bench-desc') return second.bench - first.bench;
        return second.employees - first.employees;
      });
  }, [departments, search, sortMode, status]);

  const billabilitySplit = useMemo(() => {
    const billable = filteredDepartments.reduce((sum, department) => sum + department.billable, 0);
    const nonBillable = filteredDepartments.reduce(
      (sum, department) => sum + Math.max(0, department.employees - department.billable),
      0,
    );

    return [
      { name: 'Billable', value: billable, color: 'var(--color-primary)' },
      { name: 'Non-Billable', value: nonBillable, color: 'var(--color-border)' },
    ];
  }, [filteredDepartments]);

  const headcountData = useMemo(
    () =>
      filteredDepartments.map((department) => ({
        name: department.name,
        employees: department.employees,
        color: departmentColors[department.name] ?? 'var(--color-primary)',
      })),
    [filteredDepartments],
  );

  const handleDelete = useCallback(
    async (department: Department) => {
      if (window.confirm(`Are you sure you want to delete ${department.name}?`)) {
        await deleteDepartment(department.id);
      }
    },
    [deleteDepartment],
  );

  const handleOpenAdd = () => {
    if (!canCreateDepartment) return;
    setForm(emptyDepartment);
    setSkillsInput('');
    setIsAddOpen(true);
  };

  const handleCreate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canCreateDepartment) return;
    const employees = Number(form.employees);
    const billable = Number(form.billable);
    const created = await createDepartment({
      ...form,
      employees,
      billable,
      bench: Number(form.bench),
      billability: employees > 0 ? Math.round((billable / employees) * 100) : 0,
      skills: skillsInput
        .split(',')
        .map((skill) => skill.trim())
        .filter(Boolean),
    });

    if (created) {
      setIsAddOpen(false);
    }
  };

  const tableColumns: TableColumn<Department>[] = [
    {
      id: 'department',
      label: 'Department',
      renderCell: (department) => (
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Avatar
            className={styles.tableIcon}
            sx={{
              bgcolor: `color-mix(in srgb, ${departmentColors[department.name] ?? 'var(--color-primary)'} 14%, transparent)`,
            }}
          >
            {departmentIcons[department.name] ?? <Business />}
          </Avatar>
          <Box>
            <Typography variant="body2" fontWeight={700}>
              {department.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {department.code}
            </Typography>
          </Box>
        </Stack>
      ),
    },
    { id: 'head', label: 'Department Head', field: 'head' },
    { id: 'employees', label: 'Employees', field: 'employees', align: 'center' },
    { id: 'billable', label: 'Billable', field: 'billable', align: 'center' },
    { id: 'bench', label: 'On Bench', field: 'bench', align: 'center' },
    {
      id: 'billability',
      label: 'Billability',
      renderCell: (department) => (
        <Box className={styles.tableProgress}>
          <Typography variant="body2" fontWeight={700}>
            {department.billability}%
          </Typography>
          <CapacityBar value={department.billability} showLabel={false} />
        </Box>
      ),
    },
    {
      id: 'status',
      label: 'Status',
      renderCell: (department) => (
        <Chip label={department.status} size="small" color={department.status === 'Active' ? 'success' : 'default'} />
      ),
    },
    {
      id: 'actions',
      label: 'Actions',
      align: 'right',
      renderCell: (department) => (
        <Stack direction="row" spacing={0.25} justifyContent="flex-end">
          {canUpdateDepartment && (
            <Tooltip title="Edit">
              <IconButton size="small" aria-label={`Edit ${department.name}`}>
                <EditOutlined fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          {canDeleteDepartment && (
            <Tooltip title="Delete">
              <IconButton size="small" aria-label={`Delete ${department.name}`} onClick={() => handleDelete(department)}>
                <DeleteOutline fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Stack>
      ),
    },
  ];

  return (
    <Box className={styles.page}>
      <PfPageHeader title="Departments" subtitle="Manage organisational structure, headcount, and billability by department.">
        <Stack direction="row" spacing={1}>
          <Button
            variant={viewMode === 'grid' ? 'contained' : 'outlined'}
            startIcon={<GridView />}
            onClick={() => setViewMode('grid')}
          >
            Grid
          </Button>
          <Button
            variant={viewMode === 'list' ? 'contained' : 'outlined'}
            startIcon={<List />}
            onClick={() => setViewMode('list')}
          >
            List
          </Button>
        </Stack>
        {canCreateDepartment && (
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenAdd}>
            Add Department
          </Button>
        )}
      </PfPageHeader>

      <DepartmentStats stats={stats} />

      <Grid container spacing={2} className={styles.analyticsGrid}>
        <Grid item xs={12} lg={8}>
          <Paper elevation={0} className={styles.chartPanel}>
            <Box className={styles.panelHeader}>
              <Typography variant="subtitle2" fontWeight={700}>
                Headcount by Department
              </Typography>
              <Chip label="All employees" size="small" variant="outlined" />
            </Box>
            <Box className={styles.chartBox}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={headcountData} margin={{ top: 8, right: 16, bottom: 0, left: -20 }}>
                  <CartesianGrid stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }} axisLine={false} tickLine={false} />
                  <RechartsTooltip cursor={{ fill: 'rgba(69, 100, 232, 0.08)' }} />
                  <Bar dataKey="employees" radius={[radius.sm, radius.sm, 0, 0]} barSize={48}>
                    {headcountData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} lg={4}>
          <Paper elevation={0} className={styles.chartPanel}>
            <Typography variant="subtitle2" fontWeight={700}>
              Billability Split
            </Typography>
            <Box className={styles.donutBox}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={billabilitySplit} dataKey="value" nameKey="name" innerRadius={52} outerRadius={82} paddingAngle={1}>
                    {billabilitySplit.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend iconType="square" verticalAlign="bottom" wrapperStyle={{ fontSize: 12 }} />
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Box className={styles.toolbar}>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          <FormControl size="small" className={styles.compactSelect}>
            <InputLabel>All Status</InputLabel>
            <Select value={status} label="All Status" onChange={(event) => setStatus(event.target.value as typeof status)}>
              <MenuItem value="All">All Status</MenuItem>
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" className={styles.sortSelect}>
            <InputLabel>Sort</InputLabel>
            <Select value={sortMode} label="Sort" onChange={(event) => setSortMode(event.target.value as SortMode)} startAdornment={<Sort fontSize="small" />}>
              <MenuItem value="headcount-desc">Headcount high to low</MenuItem>
              <MenuItem value="headcount-asc">Headcount low to high</MenuItem>
              <MenuItem value="billability-desc">Billability high to low</MenuItem>
              <MenuItem value="bench-desc">Bench high to low</MenuItem>
            </Select>
          </FormControl>
          <TextField
            size="small"
            placeholder="Search departments..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className={styles.searchField}
          />
        </Stack>
        <Typography variant="caption" color="text.secondary">
          {filteredDepartments.length} departments
        </Typography>
      </Box>

      {viewMode === 'list' ? (
        <ReusableTable
          rows={filteredDepartments}
          columns={tableColumns}
          getRowId={(department) => department.id}
          loading={loading}
          emptyState={{
            title: 'No Departments Found',
            description: 'Try changing the search or filters.',
          }}
        />
      ) : (
        <Grid container spacing={2}>
          {filteredDepartments.map((department) => {
            const accent = departmentColors[department.name] ?? 'var(--color-primary)';
            const nonBillable = Math.max(0, department.employees - department.billable);

            return (
              <Grid item xs={12} md={6} xl={4} key={department.id}>
                <Card elevation={0} className={styles.departmentCard}>
                  <CardContent className={styles.cardContent}>
                    <Box className={styles.cardHeader}>
                      <Stack direction="row" spacing={1.5} alignItems="flex-start">
                        <Avatar
                          className={styles.cardIcon}
                          sx={{
                            bgcolor: `color-mix(in srgb, ${accent} 14%, transparent)`,
                            color: accent,
                          }}
                        >
                          {departmentIcons[department.name] ?? <Business />}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" fontWeight={800}>
                            {department.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Head: {department.head}
                          </Typography>
                        </Box>
                      </Stack>
                      {(canUpdateDepartment || canDeleteDepartment) && (
                        <Stack direction="row" spacing={0.25}>
                          {canUpdateDepartment && (
                            <Tooltip title="Edit">
                              <IconButton size="small" aria-label={`Edit ${department.name}`}>
                                <EditOutlined fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                          {canDeleteDepartment && (
                            <Tooltip title="Delete">
                              <IconButton size="small" aria-label={`Delete ${department.name}`} onClick={() => handleDelete(department)}>
                                <DeleteOutline fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Stack>
                      )}
                    </Box>

                    <Box className={styles.metrics}>
                      <Box className={styles.metric}>
                        <Typography variant="subtitle1" fontWeight={800}>
                          {department.employees}
                        </Typography>
                        <Typography variant="caption">Employees</Typography>
                      </Box>
                      <Box className={styles.metric}>
                        <Typography variant="subtitle1" fontWeight={800} color={accent}>
                          {department.billability}%
                        </Typography>
                        <Typography variant="caption">Billable</Typography>
                      </Box>
                      <Box className={styles.metric}>
                        <Typography variant="subtitle1" fontWeight={800} color={department.bench > 4 ? 'error.main' : 'warning.main'}>
                          {department.bench}
                        </Typography>
                        <Typography variant="caption">On Bench</Typography>
                      </Box>
                    </Box>

                    <Box className={styles.billabilitySection}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="caption" color="text.secondary">
                          Billability
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {department.billability}%
                        </Typography>
                      </Stack>
                      <CapacityBar value={department.billability} showLabel={false} />
                    </Box>

                    <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap className={styles.skills}>
                      {department.skills.slice(0, 3).map((skill) => (
                        <Chip key={skill} label={skill} size="small" variant="outlined" />
                      ))}
                      {department.skills.length > 3 && <Chip label={`+${department.skills.length - 3}`} size="small" />}
                    </Stack>

                    <Box className={styles.cardFooter}>
                      <AvatarGroup max={4} className={styles.avatarGroup}>
                        {avatarColors.map((color, index) => (
                          <Avatar key={color} sx={{ bgcolor: color }}>
                            {department.name.charAt(0)}
                            {index + 1}
                          </Avatar>
                        ))}
                      </AvatarGroup>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography variant="caption" color="text.secondary">
                          {nonBillable} non-billable
                        </Typography>
                        <Chip label={department.status} size="small" color={department.status === 'Active' ? 'success' : 'default'} />
                      </Stack>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      <Dialog open={isAddOpen} onClose={() => setIsAddOpen(false)} maxWidth="sm" fullWidth>
        <Box component="form" onSubmit={handleCreate}>
          <DialogTitle className={styles.dialogTitle}>
            <Box>
              <Typography variant="h6" fontWeight={700}>
                Add Department
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Create a new department and assign its head.
              </Typography>
            </Box>
            <IconButton aria-label="Close add department dialog" onClick={() => setIsAddOpen(false)}>
              <Close />
            </IconButton>
          </DialogTitle>
          <DialogContent className={styles.dialogContent}>
            <Stack spacing={2}>
              <TextField
                label="Department Name"
                placeholder="e.g. Engineering, Design, QA..."
                value={form.name}
                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                required
                fullWidth
              />
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Department Code"
                    placeholder="e.g. ENG, DES"
                    value={form.code}
                    onChange={(event) => setForm((prev) => ({ ...prev, code: event.target.value.toUpperCase() }))}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Cost Centre"
                    placeholder="e.g. CC-1001"
                    fullWidth
                  />
                </Grid>
              </Grid>
              <TextField
                label="Department Head"
                placeholder="Select employee..."
                value={form.head}
                onChange={(event) => setForm((prev) => ({ ...prev, head: event.target.value }))}
                required
                fullWidth
              />
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Employees"
                    type="number"
                    value={form.employees}
                    onChange={(event) => setForm((prev) => ({ ...prev, employees: Number(event.target.value) }))}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Billable"
                    type="number"
                    value={form.billable}
                    onChange={(event) => setForm((prev) => ({ ...prev, billable: Number(event.target.value) }))}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="On Bench"
                    type="number"
                    value={form.bench}
                    onChange={(event) => setForm((prev) => ({ ...prev, bench: Number(event.target.value) }))}
                    fullWidth
                  />
                </Grid>
              </Grid>
              <TextField
                label="Top Skills"
                helperText="Separate skills with commas"
                value={skillsInput}
                onChange={(event) => setSkillsInput(event.target.value)}
                fullWidth
              />
              <TextField
                label="Description"
                placeholder="Brief description..."
                value={form.description}
                onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
                multiline
                rows={2}
                fullWidth
              />
              <Stack direction="row" alignItems="center" spacing={1}>
                <Checkbox
                  size="small"
                  checked={form.status === 'Active'}
                  onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.checked ? 'Active' : 'Inactive' }))}
                />
                <Typography variant="body2">Mark as Active</Typography>
              </Stack>
            </Stack>
          </DialogContent>
          <DialogActions className={styles.dialogActions}>
            <Button variant="outlined" onClick={() => setIsAddOpen(false)}>
              Cancel
            </Button>
            <Button variant="contained" type="submit">
              Save Department
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
};

export default DepartmentsPage;

