import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  ButtonGroup,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import {
  Add as AddIcon,
  Assessment as AssessmentIcon,
  ContentCopy as DuplicateIcon,
  Dashboard as DashboardIcon,
  DeleteOutline as DeleteIcon,
  Edit as EditIcon,
  ExpandMore as ExpandMoreIcon,
  Groups as GroupsIcon,
  Info as InfoIcon,
  Lock as LockIcon,
  Search as SearchIcon,
  WarningAmber as WarningAmberIcon,
  AccountTree as AllocationIcon,
} from '@mui/icons-material';
import { ReusableTable, type TableColumn } from '@/components/common';
import { unwrapApiData, type ApiEnvelope } from '@/api/apiResponse';
import { api } from '@/api/client/apiClient';
import { userService, type UserSummary } from '@/api/services/user.service';
import { API_ENDPOINTS } from '@/constants/api.constants';
import { useAppSelector } from '@/hooks';
import { hasPermission } from '@/utils/permission.utils';
import styles from './RolesPage.module.scss';

interface RoleRow {
  id: string;
  name: string;
  tag: 'System' | 'Custom';
  description: string;
  users: number;
  permissions: string;
  featured?: boolean;
  status: 'Active' | 'Inactive';
  permissionGroups: PermissionGroup[];
  assignedUserIds?: string[];
}

interface PermissionRow {
  name: string;
  detail?: string;
  checked: boolean[];
  warning?: string;
  locked?: string;
  highlight?: boolean;
}

interface PermissionGroup {
  title: string;
  action?: string;
  rows: PermissionRow[];
}

type RoleTemplate = 'hr-admin' | 'resource-manager' | 'project-manager' | 'viewer';
type RoleDialogMode = 'create' | 'edit';

interface RoleForm {
  name: string;
  description: string;
  status: 'Active' | 'Inactive';
  template: RoleTemplate;
}

interface PermissionCatalog {
  headers: string[];
  actions: string[];
  groups: PermissionGroup[];
}

const defaultRoles: RoleRow[] = [
  {
    id: 'super-admin',
    name: 'Super Admin',
    tag: 'System',
    description: 'Full platform access including org setup, audit logs',
    users: 2,
    permissions: 'All (48)',
    status: 'Active',
    permissionGroups: [],
  },
  {
    id: 'hr-admin',
    name: 'HR Admin',
    tag: 'Custom',
    description: 'Manage employees, departments, designations',
    users: 5,
    permissions: '32',
    status: 'Active',
    permissionGroups: [],
  },
];

const groupIcons: Record<string, React.ReactNode> = {
  Dashboard: <DashboardIcon fontSize="small" />,
  Employees: <GroupsIcon fontSize="small" />,
  Allocations: <AllocationIcon fontSize="small" />,
  Reports: <AssessmentIcon fontSize="small" />,
  'Sales & Revenue': <AssessmentIcon fontSize="small" />,
  Administration: <LockIcon fontSize="small" />,
};

const roleTemplates: Record<RoleTemplate, { label: string; description: string }> = {
  'hr-admin': {
    label: 'HR Admin',
    description: 'Employee, department, designation and report access',
  },
  'resource-manager': {
    label: 'Resource Manager',
    description: 'Allocation, bench, capacity and release access',
  },
  'project-manager': {
    label: 'Project Manager',
    description: 'Project staffing and team visibility access',
  },
  viewer: {
    label: 'Management Viewer',
    description: 'Read-only dashboard and reports access',
  },
};

const clonePermissionGroups = (groups: PermissionGroup[]): PermissionGroup[] =>
  groups.map((group) => ({
    ...group,
    rows: group.rows.map((row) => ({ ...row, checked: [...row.checked] })),
  }));

const hasValidPermissionGroups = (groups?: PermissionGroup[]) =>
  Array.isArray(groups) &&
  groups.length > 0 &&
  groups.every(
    (group) =>
      group &&
      typeof group.title === 'string' &&
      Array.isArray(group.rows) &&
      group.rows.every((row) => row && typeof row.name === 'string' && Array.isArray(row.checked)),
  );

const normalizeRole = (role: RoleRow, fallbackGroups: PermissionGroup[] = []): RoleRow => ({
  ...role,
  assignedUserIds: role.assignedUserIds ?? [],
  users: role.assignedUserIds?.length ?? role.users ?? 0,
  permissionGroups: hasValidPermissionGroups(role.permissionGroups)
    ? clonePermissionGroups(role.permissionGroups)
    : clonePermissionGroups(fallbackGroups),
});

const buildPermissionGroups = (template: RoleTemplate, sourceGroups: PermissionGroup[]): PermissionGroup[] => {
  const groups = clonePermissionGroups(sourceGroups);

  if (template === 'viewer') {
    return groups.map((group) => ({
      ...group,
      rows: group.rows?.map((row) => ({ ...row, checked: row.checked.map((_, index) => index === 0) })),
    }));
  }

  if (template === 'project-manager') {
    return groups.map((group) => ({
      ...group,
      rows: group.rows?.map((row) => ({
        ...row,
        checked:
          group.title === 'Allocations'
            ? row.checked.map((_, index) => index <= 2)
            : row.checked.map((checked, index) => checked || index === 0),
      })),
    }));
  }

  if (template === 'hr-admin') {
    return groups.map((group) => ({
      ...group,
      rows: group.rows?.map((row) => ({
        ...row,
        checked:
          group.title === 'Employees'
            ? row.checked.map((_, index) => index <= 3 || index === 4)
            : row.checked,
      })),
    }));
  }

  return groups;
};

const countEnabledPermissions = (groups: PermissionGroup[]) =>
  groups.reduce(
    (total, group) =>
      total + group.rows?.reduce((rowTotal, row) => rowTotal + row.checked.filter(Boolean).length, 0),
    0,
  );

const getApiErrorMessage = (error: unknown, fallback: string) =>
  typeof error === 'object' &&
  error !== null &&
  'response' in error &&
  typeof (error as { response?: { data?: { message?: string } } }).response?.data?.message ===
    'string'
    ? (error as { response: { data: { message: string } } }).response.data.message
    : fallback;

const RolesPage = () => {
  const user = useAppSelector((state) => state.auth.user);
  const canCreateRole = hasPermission(user, ['roles:create']);
  const canUpdateRole = hasPermission(user, ['roles:update']);
  const canDeleteRole = hasPermission(user, ['roles:delete']);
  const canAssignUsers = canUpdateRole && hasPermission(user, ['users:update']);
  const [roles, setRoles] = useState<RoleRow[]>([]);
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [permissionHeaders, setPermissionHeaders] = useState<string[]>([]);
  const [permissionGroups, setPermissionGroups] = useState<PermissionGroup[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState('');
  const [draftPermissionGroups, setDraftPermissionGroups] = useState<PermissionGroup[]>([]);
  const [permissionSearch, setPermissionSearch] = useState('');
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [roleDialogMode, setRoleDialogMode] = useState<RoleDialogMode>('create');
  const [roleForm, setRoleForm] = useState<RoleForm>({
    name: '',
    description: '',
    status: 'Active',
    template: 'resource-manager',
  });
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [assignUserIds, setAssignUserIds] = useState<string[]>([]);
  const [deleteRoleId, setDeleteRoleId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const selectedRole = useMemo(
    () => roles.find((role) => role.id === selectedRoleId) ?? roles[0],
    [roles, selectedRoleId],
  );

  const assignedUsers = useMemo(
    () => users.filter((user) => selectedRole?.assignedUserIds?.includes(user.id)),
    [selectedRole?.assignedUserIds, users],
  );

  const selectedPermissionGroups = draftPermissionGroups.length
    ? draftPermissionGroups
    : selectedRole?.permissionGroups?.length
      ? selectedRole.permissionGroups
      : permissionGroups;

  const enabledPermissionCount = countEnabledPermissions(selectedPermissionGroups);

  const filteredPermissionGroups = useMemo(() => {
    const query = permissionSearch.trim().toLowerCase();
    if (!query) return selectedPermissionGroups;

    return selectedPermissionGroups
      .map((group) => ({
        ...group,
        rows: group.rows?.filter((row) =>
          [group.title, row.name, row.detail, row.warning, row.locked]
            .filter(Boolean)
            .some((value) => value!.toLowerCase().includes(query)),
        ),
      }))
      .filter((group) => group.rows?.length > 0);
  }, [permissionSearch, selectedPermissionGroups]);

  useEffect(() => {
    const loadRoles = async () => {
      const [catalogResponse, rolesResponse] = await Promise.all([
        api.get<ApiEnvelope<PermissionCatalog>>(`${API_ENDPOINTS.ROLES}/permission-catalog`),
        api.get<ApiEnvelope<RoleRow[]>>(API_ENDPOINTS.ROLES),
      ]);
      const catalog = unwrapApiData(catalogResponse.data);
      setPermissionHeaders(catalog.headers);
      setPermissionGroups(clonePermissionGroups(catalog.groups));
      setExpandedGroups(
        catalog.groups.reduce((acc, group) => ({ ...acc, [group.title]: true }), {}),
      );

      const data = unwrapApiData(rolesResponse.data);
      const normalized = data.length
        ? data.map((role) => normalizeRole(role, catalog.groups))
        : defaultRoles.map((role) => normalizeRole({ ...role, permissionGroups: catalog.groups }, catalog.groups));
      setRoles(normalized);
      setSelectedRoleId(normalized[0]?.id ?? '');
    };

    loadRoles().catch(() => setFeedback({ type: 'error', message: 'Failed to load roles' }));
    userService
      .getUsers()
      .then(setUsers)
      .catch(() => setFeedback({ type: 'error', message: 'Failed to load users for role assignment' }));
  }, []);

  useEffect(() => {
    const groups = selectedRole?.permissionGroups?.length
      ? selectedRole.permissionGroups
      : permissionGroups;
    setDraftPermissionGroups(clonePermissionGroups(groups));
    setPermissionSearch('');
  }, [permissionGroups, selectedRole?.id, selectedRole?.permissionGroups]);

  const updateRoleInState = (updated: RoleRow) => {
    setRoles((current) =>
      current.map((role) =>
        role.id === updated.id ? normalizeRole(updated, permissionGroups) : role,
      ),
    );
  };

  const toggleGroup = (groupTitle: string) => {
    setExpandedGroups((prev) => ({ ...prev, [groupTitle]: !prev[groupTitle] }));
  };

  const openCreateRole = () => {
    if (!canCreateRole) return;
    setRoleDialogMode('create');
    setRoleForm({
      name: '',
      description: '',
      status: 'Active',
      template: 'resource-manager',
    });
    setRoleDialogOpen(true);
  };

  const openEditRole = (role: RoleRow) => {
    if (!canUpdateRole) return;
    setSelectedRoleId(role.id);
    setRoleDialogMode('edit');
    setRoleForm({
      name: role.name,
      description: role.description,
      status: role.status,
      template: 'resource-manager',
    });
    setRoleDialogOpen(true);
  };

  const openAssignUsers = (role: RoleRow) => {
    if (!canAssignUsers) return;
    setSelectedRoleId(role.id);
    setAssignUserIds(role.assignedUserIds ?? []);
    setAssignDialogOpen(true);
  };

  const saveRole = async () => {
    if ((roleDialogMode === 'create' && !canCreateRole) || (roleDialogMode === 'edit' && !canUpdateRole)) {
      setFeedback({ type: 'error', message: 'You do not have permission to save this role' });
      return;
    }

    if (!roleForm.name.trim() || !roleForm.description.trim()) {
      setFeedback({ type: 'error', message: 'Role name and description are required' });
      return;
    }

    setSaving(true);
    try {
      if (roleDialogMode === 'create') {
        const seededPermissionGroups = buildPermissionGroups(roleForm.template, permissionGroups);
        const response = await api.post<ApiEnvelope<RoleRow>>(API_ENDPOINTS.ROLES, {
          name: roleForm.name.trim(),
          tag: 'Custom',
          description: roleForm.description.trim(),
          users: 0,
          permissions: `${countEnabledPermissions(seededPermissionGroups)}`,
          featured: false,
          status: roleForm.status,
          permissionGroups: seededPermissionGroups,
          assignedUserIds: [],
        });
        const created = unwrapApiData(response.data);
        setRoles((prev) => [normalizeRole(created, permissionGroups), ...prev]);
        setSelectedRoleId(created.id);
        setFeedback({ type: 'success', message: 'Role created successfully' });
      } else if (selectedRole) {
        const response = await api.patch<ApiEnvelope<RoleRow>>(
          `${API_ENDPOINTS.ROLES}/${selectedRole.id}`,
          {
            name: roleForm.name.trim(),
            description: roleForm.description.trim(),
            status: roleForm.status,
          },
        );
        updateRoleInState(unwrapApiData(response.data));
        setFeedback({ type: 'success', message: 'Role updated successfully' });
      }
      setRoleDialogOpen(false);
    } catch (error) {
      setFeedback({ type: 'error', message: getApiErrorMessage(error, 'Unable to save role') });
    } finally {
      setSaving(false);
    }
  };

  const duplicateRole = async () => {
    if (!canCreateRole) return;
    if (!selectedRole) return;
    setSaving(true);
    try {
      const clonedGroups = clonePermissionGroups(selectedPermissionGroups);
      const response = await api.post<ApiEnvelope<RoleRow>>(API_ENDPOINTS.ROLES, {
        name: `${selectedRole.name} Copy`,
        tag: 'Custom',
        description: selectedRole.description,
        users: 0,
        permissions: `${countEnabledPermissions(clonedGroups)}`,
        featured: false,
        status: 'Active',
        permissionGroups: clonedGroups,
        assignedUserIds: [],
      });
      const created = unwrapApiData(response.data);
      setRoles((prev) => [normalizeRole(created, permissionGroups), ...prev]);
      setSelectedRoleId(created.id);
      setFeedback({ type: 'success', message: 'Role duplicated successfully' });
    } catch (error) {
      setFeedback({ type: 'error', message: getApiErrorMessage(error, 'Unable to duplicate role') });
    } finally {
      setSaving(false);
    }
  };

  const saveAssignedUsers = async () => {
    if (!canAssignUsers) {
      setFeedback({ type: 'error', message: 'You do not have permission to assign users' });
      return;
    }
    if (!selectedRole) return;

    setSaving(true);
    try {
      const response = await api.patch<ApiEnvelope<RoleRow>>(
        `${API_ENDPOINTS.ROLES}/${selectedRole.id}`,
        { assignedUserIds: assignUserIds },
      );
      updateRoleInState(unwrapApiData(response.data));
      setAssignDialogOpen(false);
      setFeedback({ type: 'success', message: 'Role users assigned successfully' });
    } catch {
      setFeedback({ type: 'error', message: 'Unable to update assigned users' });
    } finally {
      setSaving(false);
    }
  };

  const confirmDeleteRole = async () => {
    if (!canDeleteRole) {
      setFeedback({ type: 'error', message: 'You do not have permission to delete roles' });
      return;
    }
    if (!deleteRoleId) return;
    setSaving(true);
    try {
      await api.delete(`${API_ENDPOINTS.ROLES}/${deleteRoleId}`);
      setRoles((prev) => {
        const next = prev.filter((role) => role.id !== deleteRoleId);
        if (selectedRoleId === deleteRoleId) setSelectedRoleId(next[0]?.id ?? '');
        return next;
      });
      setDeleteRoleId(null);
      setFeedback({ type: 'success', message: 'Role deleted successfully' });
    } catch {
      setFeedback({ type: 'error', message: 'Unable to delete role' });
    } finally {
      setSaving(false);
    }
  };

  const togglePermission = (groupTitle: string, rowName: string, permissionIndex: number) => {
    if (!canUpdateRole) return;
    setDraftPermissionGroups((current) =>
      current.map((group) =>
        group.title !== groupTitle
          ? group
          : {
              ...group,
              rows: group.rows?.map((row) =>
                row.name !== rowName
                  ? row
                  : {
                      ...row,
                      checked: row.checked.map((checked, index) =>
                        index === permissionIndex ? !checked : checked,
                      ),
                    },
              ),
            },
      ),
    );
  };

  const selectAllGroup = (groupTitle: string) => {
    if (!canUpdateRole) return;
    setDraftPermissionGroups((current) =>
      current.map((group) =>
        group.title !== groupTitle
          ? group
          : {
              ...group,
              rows: group.rows?.map((row) => ({ ...row, checked: row.checked.map(() => true) })),
            },
      ),
    );
  };

  const cancelPermissionChanges = () => {
    const groups = selectedRole?.permissionGroups?.length
      ? selectedRole.permissionGroups
      : permissionGroups;
    setDraftPermissionGroups(clonePermissionGroups(groups));
  };

  const savePermissions = async () => {
    if (!canUpdateRole) {
      setFeedback({ type: 'error', message: 'You do not have permission to update permissions' });
      return;
    }
    if (!selectedRole) return;
    setSaving(true);
    try {
      const response = await api.patch<ApiEnvelope<RoleRow>>(
        `${API_ENDPOINTS.ROLES}/${selectedRole.id}`,
        {
          permissions: `${enabledPermissionCount}`,
          permissionGroups: selectedPermissionGroups,
        },
      );
      updateRoleInState(unwrapApiData(response.data));
      setFeedback({ type: 'success', message: 'Permissions saved successfully' });
    } catch {
      setFeedback({ type: 'error', message: 'Unable to save permissions' });
    } finally {
      setSaving(false);
    }
  };

  const roleColumns: TableColumn<RoleRow>[] = [
    {
      id: 'name',
      label: 'Role Name',
      renderCell: (role) => (
        <>
          <Typography className={role.featured ? styles.linkRole : styles.roleName}>
            {role.name}
          </Typography>
          <Chip
            label={role.tag}
            size="small"
            className={role.tag === 'System' ? styles.systemTag : styles.customTag}
          />
        </>
      ),
    },
    { id: 'description', label: 'Description', field: 'description' },
    { id: 'users', label: 'Users', field: 'users' },
    { id: 'permissions', label: 'Permissions', field: 'permissions' },
    {
      id: 'actions',
      label: 'Actions',
      renderCell: (role) => (
        <Stack direction="row" spacing={1.25}>
          <Button variant="text" className={styles.textAction} onClick={() => setSelectedRoleId(role.id)}>
            Select
          </Button>
          {canUpdateRole && (
            <Button variant="text" className={styles.textAction} onClick={() => openEditRole(role)}>
              Edit
            </Button>
          )}
          {canAssignUsers && (
            <Button variant="text" className={styles.secondaryAction} onClick={() => openAssignUsers(role)}>
              Assign Users
            </Button>
          )}
          {canDeleteRole && role.tag === 'Custom' && (
            <Button
              variant="text"
              className={styles.dangerAction}
              onClick={() => setDeleteRoleId(role.id)}
              disabled={role.users > 0}
            >
              Delete
            </Button>
          )}
        </Stack>
      ),
    },
  ];

  return (
    <Box className={styles.page}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        alignItems={{ xs: 'stretch', sm: 'flex-start' }}
        justifyContent="space-between"
        spacing={2}
        className={styles.header}
      >
        <Box>
          <Typography variant="h4" className={styles.title}>
            Roles & Permissions
          </Typography>
          <Typography variant="body2" className={styles.subtitle}>
            Manage role-based access control across the platform
          </Typography>
        </Box>
        {canCreateRole && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            className={styles.createButton}
            onClick={openCreateRole}
          >
            Create Role
          </Button>
        )}
      </Stack>

      <ReusableTable rows={roles} columns={roleColumns} getRowId={(role) => role.id} />

      <Paper elevation={0} className={styles.roleEditor}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'stretch', md: 'flex-start' }}
          spacing={2}
        >
          <Box>
            <Stack direction="row" spacing={1.25} alignItems="center" flexWrap="wrap">
              <Typography variant="h5" className={styles.editorTitle}>
                {selectedRole?.name ?? 'Role'}
              </Typography>
              <Chip label={`${selectedRole?.tag ?? 'Custom'} Role`} size="small" className={styles.customTag} />
              <Chip label={selectedRole?.status ?? 'Active'} size="small" className={styles.activeTag} />
            </Stack>
            <Typography variant="body2" className={styles.editorSubtitle}>
              {selectedRole?.description ?? 'Select a role to manage permissions.'}
            </Typography>
            <Stack direction="row" spacing={0.75} flexWrap="wrap" className={styles.assignedUsers}>
              {assignedUsers.length ? (
                assignedUsers.map((user) => (
                  <Chip key={user.id} label={user.email} size="small" className={styles.userChip} />
                ))
              ) : (
                <Typography variant="body2" className={styles.enabledText}>
                  No users assigned to this role
                </Typography>
              )}
            </Stack>
            <Stack direction="row" spacing={1.5} alignItems="center" className={styles.searchRow}>
              <TextField
                size="small"
                placeholder="Search permissions..."
                className={styles.searchInput}
                value={permissionSearch}
                onChange={(event) => setPermissionSearch(event.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
              <Typography variant="body2" className={styles.enabledText}>
                {enabledPermissionCount} permissions enabled
              </Typography>
            </Stack>
          </Box>
          {(canUpdateRole || canCreateRole) && (
            <ButtonGroup variant="outlined" className={styles.editGroup}>
              {canUpdateRole && (
                <Button
                  variant="contained"
                  startIcon={<EditIcon />}
                  onClick={() => selectedRole && openEditRole(selectedRole)}
                >
                  Edit
                </Button>
              )}
              {canCreateRole && (
                <Button startIcon={<DuplicateIcon />} onClick={duplicateRole} disabled={!selectedRole || saving}>
                  Duplicate
                </Button>
              )}
            </ButtonGroup>
          )}
        </Stack>
      </Paper>

      <TableContainer component={Paper} elevation={0} className={styles.permissionsTable}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Permission</TableCell>
              {permissionHeaders.map((header) => (
                <TableCell key={header} align="center">
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPermissionGroups.map((group) => {
              const isExpanded = expandedGroups[group.title] !== false;

              return (
                <React.Fragment key={group.title}>
                  <TableRow
                    className={styles.groupRow}
                    onClick={() => toggleGroup(group.title)}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={1.25}>
                        <Box className={styles.groupIcon}>{groupIcons[group.title] ?? <InfoIcon fontSize="small" />}</Box>
                        <Typography className={styles.groupTitle}>{group.title}</Typography>
                        <Chip
                          label={`${group.rows?.length} permissions`}
                          size="small"
                          variant="outlined"
                          sx={{ ml: 1, height: 20, fontSize: '0.65rem' }}
                        />
                      </Stack>
                    </TableCell>
                    <TableCell colSpan={permissionHeaders.length} align="right">
                      <Stack direction="row" spacing={1.25} justifyContent="flex-end" alignItems="center">
                        {canUpdateRole && group.action && (
                          <Button
                            variant="text"
                            className={styles.selectAll}
                            onClick={(event) => {
                              event.stopPropagation();
                              selectAllGroup(group.title);
                            }}
                          >
                            {group.action}
                          </Button>
                        )}
                        <ExpandMoreIcon
                          fontSize="small"
                          className={`${styles.expandIcon} ${isExpanded ? styles.expanded : ''}`}
                          sx={{
                            transition: 'transform 0.25s ease',
                            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                          }}
                        />
                      </Stack>
                    </TableCell>
                  </TableRow>

                  {isExpanded &&
                    group.rows?.map((row) => (
                      <TableRow
                        key={`${group.title}-${row.name}`}
                        className={row.highlight ? styles.highlightRow : undefined}
                      >
                        <TableCell>
                          <Typography className={styles.permissionName}>{row.name}</Typography>
                          {row.detail && (
                            <Typography variant="caption" className={styles.permissionDetail}>
                              {row.detail}
                            </Typography>
                          )}
                          {row.warning && (
                            <Stack direction="row" spacing={0.5} alignItems="center" className={styles.warningText}>
                              <WarningAmberIcon fontSize="inherit" />
                              <Typography variant="caption">{row.warning}</Typography>
                            </Stack>
                          )}
                          {row.locked && (
                            <Stack direction="row" spacing={0.5} alignItems="center" className={styles.lockedText}>
                              <LockIcon fontSize="inherit" />
                              <Typography variant="caption">{row.locked}</Typography>
                            </Stack>
                          )}
                        </TableCell>
                        {row.checked.map((checked, index) => (
                          <TableCell key={`${row.name}-${permissionHeaders[index]}`} align="center">
                            <Checkbox
                              size="small"
                              checked={checked}
                              onChange={() => togglePermission(group.title, row.name, index)}
                              disabled={!canUpdateRole}
                              className={row.highlight && index === 5 ? styles.overrideCheck : styles.permissionCheck}
                            />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                </React.Fragment>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Paper elevation={0} className={styles.saveBar}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'stretch', sm: 'center' }}
          spacing={2}
        >
          <Stack direction="row" spacing={1} alignItems="center" className={styles.saveHint}>
            <InfoIcon fontSize="small" />
            <Typography variant="body2">
              Changes will affect all users assigned to the {selectedRole?.name ?? 'selected'} role ({selectedRole?.users ?? 0} users).
            </Typography>
          </Stack>
          {canUpdateRole && (
            <Stack direction="row" spacing={1.5} justifyContent="flex-end">
              <Button variant="outlined" className={styles.cancelButton} onClick={cancelPermissionChanges}>
                Cancel
              </Button>
              <Button
                variant="contained"
                className={styles.saveButton}
                onClick={savePermissions}
                disabled={!selectedRole || saving}
              >
                {saving ? 'Saving...' : 'Save Permissions'}
              </Button>
            </Stack>
          )}
        </Stack>
      </Paper>

      <Dialog
        open={roleDialogOpen}
        onClose={() => !saving && setRoleDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>{roleDialogMode === 'create' ? 'Create role' : 'Edit role'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} className={styles.dialogContent}>
            <TextField
              label="Role name"
              value={roleForm.name}
              onChange={(event) => setRoleForm((prev) => ({ ...prev, name: event.target.value }))}
              fullWidth
              required
            />
            <TextField
              label="Description"
              value={roleForm.description}
              onChange={(event) => setRoleForm((prev) => ({ ...prev, description: event.target.value }))}
              fullWidth
              multiline
              minRows={3}
              required
            />
            {roleDialogMode === 'create' && (
              <>
                <FormControl fullWidth>
                  <InputLabel id="role-template-label">Access template</InputLabel>
                  <Select
                    labelId="role-template-label"
                    label="Access template"
                    value={roleForm.template}
                    onChange={(event) =>
                      setRoleForm((prev) => ({ ...prev, template: event.target.value as RoleTemplate }))
                    }
                  >
                    {Object.entries(roleTemplates).map(([value, template]) => (
                      <MenuItem key={value} value={value}>
                        {template.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Typography className={styles.templateDescription}>
                  {roleTemplates[roleForm.template].description}
                </Typography>
              </>
            )}
            <FormControl fullWidth>
              <InputLabel id="role-status-label">Status</InputLabel>
              <Select
                labelId="role-status-label"
                label="Status"
                value={roleForm.status}
                onChange={(event) =>
                  setRoleForm((prev) => ({ ...prev, status: event.target.value as RoleForm['status'] }))
                }
              >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRoleDialogOpen(false)} disabled={saving}>
            Cancel
          </Button>
          <Button variant="contained" onClick={saveRole} disabled={saving}>
            {saving ? 'Saving...' : roleDialogMode === 'create' ? 'Create role' : 'Save role'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={assignDialogOpen}
        onClose={() => !saving && setAssignDialogOpen(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Assign users</DialogTitle>
        <DialogContent>
          <Stack spacing={2} className={styles.dialogContent}>
            <Typography className={styles.templateDescription}>
              Assign or remove users for {selectedRole?.name ?? 'this role'}.
            </Typography>
            <FormControl fullWidth>
              <InputLabel id="assign-users-label">Users</InputLabel>
              <Select
                labelId="assign-users-label"
                label="Users"
                multiple
                value={assignUserIds}
                onChange={(event) => {
                  const value = event.target.value;
                  setAssignUserIds(typeof value === 'string' ? value.split(',') : value);
                }}
                renderValue={(selected) =>
                  selected
                    .map((id) => users.find((user) => user.id === id)?.email)
                    .filter(Boolean)
                    .join(', ')
                }
              >
                {users.map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    <Checkbox checked={assignUserIds.includes(user.id)} />
                    <Typography>{user.email}</Typography>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {!users.length && <Alert severity="info">No users are available to assign yet.</Alert>}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAssignDialogOpen(false)} disabled={saving}>
            Cancel
          </Button>
          <Button variant="contained" onClick={saveAssignedUsers} disabled={saving}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={Boolean(deleteRoleId)}
        onClose={() => !saving && setDeleteRoleId(null)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Delete role</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this role? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteRoleId(null)} disabled={saving}>
            Cancel
          </Button>
          <Button
            color="error"
            variant="contained"
            startIcon={<DeleteIcon />}
            onClick={confirmDeleteRole}
            disabled={saving}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={Boolean(feedback)}
        autoHideDuration={4000}
        onClose={() => setFeedback(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert severity={feedback?.type ?? 'success'} variant="filled" onClose={() => setFeedback(null)}>
          {feedback?.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default RolesPage;
