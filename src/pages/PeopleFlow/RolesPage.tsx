import React, { useState } from 'react';
import {
  Box,
  Button,
  ButtonGroup,
  Checkbox,
  Chip,
  InputAdornment,
  Paper,
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
  Dashboard as DashboardIcon,
  ExpandMore as ExpandMoreIcon,
  Groups as GroupsIcon,
  Info as InfoIcon,
  Lock as LockIcon,
  Search as SearchIcon,
  WarningAmber as WarningAmberIcon,
  AccountTree as AllocationIcon,
} from '@mui/icons-material';
import { ReusableTable, type TableColumn } from '@/components/common';
import styles from './RolesPage.module.scss';

interface RoleRow {
  name: string;
  tag: 'System' | 'Custom';
  description: string;
  users: number;
  permissions: string;
  featured?: boolean;
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
  icon: React.ReactNode;
  action?: string;
  rows: PermissionRow[];
}

const roles: RoleRow[] = [
  {
    name: 'Super Admin',
    tag: 'System',
    description: 'Full platform access including org setup, audit logs',
    users: 2,
    permissions: 'All (48)',
  },
  {
    name: 'HR Admin',
    tag: 'Custom',
    description: 'Manage employees, departments, designations',
    users: 5,
    permissions: '32',
  },
  {
    name: 'Resource Manager',
    tag: 'Custom',
    description: 'Manage allocations, capacity, bench, releases',
    users: 8,
    permissions: '28',
    featured: true,
  },
  {
    name: 'Project Manager',
    tag: 'Custom',
    description: 'View assigned projects, team, request resources',
    users: 14,
    permissions: '18',
  },
  {
    name: 'Management Viewer',
    tag: 'Custom',
    description: 'Read-only access to dashboard, reports, insights',
    users: 6,
    permissions: '12',
  },
  {
    name: 'Employee',
    tag: 'Custom',
    description: 'Limited Phase 1 access - self-service ready',
    users: 198,
    permissions: '4',
  },
];

const permissionHeaders = ['View', 'Create', 'Update', 'Delete', 'Export', 'Override'];

const permissionGroups: PermissionGroup[] = [
  {
    title: 'Dashboard',
    icon: <DashboardIcon fontSize="small" />,
    action: 'Select all',
    rows: [
      {
        name: 'Organization Dashboard',
        detail: 'View KPIs, charts, widgets',
        checked: [true, false, false, false, false, false],
      },
    ],
  },
  {
    title: 'Employees',
    icon: <GroupsIcon fontSize="small" />,
    rows: [
      {
        name: 'View Employees',
        detail: 'List and detail view',
        checked: [true, false, false, false, true, false],
      },
      {
        name: 'Manage Employees',
        detail: 'Create, update, status change',
        checked: [true, false, false, false, false, false],
      },
    ],
  },
  {
    title: 'Allocations',
    icon: <AllocationIcon fontSize="small" />,
    rows: [
      {
        name: 'View Allocations',
        detail: 'List and details',
        checked: [true, false, false, false, true, false],
      },
      {
        name: 'Create Allocations',
        detail: 'Assign employees to projects',
        checked: [true, true, true, false, false, false],
      },
      {
        name: 'Override Overallocation',
        warning: 'Requires override permission',
        checked: [true, true, true, false, false, true],
        highlight: true,
      },
      {
        name: 'Release Allocations',
        checked: [true, false, true, false, false, false],
      },
      {
        name: 'Extend Allocations',
        checked: [true, false, true, false, false, false],
      },
    ],
  },
  {
    title: 'Reports',
    icon: <AssessmentIcon fontSize="small" />,
    rows: [
      {
        name: 'Allocation Reports',
        checked: [true, false, false, false, true, false],
      },
      {
        name: 'Bench & Availability Reports',
        checked: [true, false, false, false, true, false],
      },
      {
        name: 'Financial Reports',
        locked: 'Sensitive access required',
        checked: [false, false, false, false, false, false],
      },
    ],
  },
];

const PermissionCheck = ({ checked, override }: { checked: boolean; override?: boolean }) => (
  <Checkbox
    size="small"
    defaultChecked={checked}
    className={override ? styles.overrideCheck : styles.permissionCheck}
  />
);

const RolesPage = () => {
  // State for expanded groups - all expanded by default
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    permissionGroups.forEach(group => {
      initial[group.title] = true;
    });
    return initial;
  });

  const toggleGroup = (groupTitle: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupTitle]: !prev[groupTitle]
    }));
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
      renderCell: () => (
        <Stack direction="row" spacing={1.25}>
          <Button variant="text" className={styles.textAction}>
            Edit
          </Button>
          <Button variant="text" className={styles.secondaryAction}>
            Assign Users
          </Button>
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
        <Button variant="contained" startIcon={<AddIcon />} className={styles.createButton}>
          Create Role
        </Button>
      </Stack>

      <ReusableTable
        rows={roles}
        columns={roleColumns}
        getRowId={(role) => role.name}
      />

      <Paper elevation={0} className={styles.roleEditor}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'stretch', md: 'flex-start' }}
          spacing={2}
          className={styles.editorHeader}
        >
          <Box>
            <Stack direction="row" spacing={1.25} alignItems="center" flexWrap="wrap">
              <Typography variant="h5" className={styles.editorTitle}>
                Resource Manager
              </Typography>
              <Chip label="Custom Role" size="small" className={styles.customTag} />
              <Chip label="Active" size="small" className={styles.activeTag} />
            </Stack>
            <Typography variant="body2" className={styles.editorSubtitle}>
              Manage allocations, capacity planning, bench employees, upcoming releases, and overallocations.
            </Typography>
            <Stack direction="row" spacing={1.5} alignItems="center" className={styles.searchRow}>
              <TextField
                size="small"
                placeholder="Search permissions..."
                className={styles.searchInput}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
              <Typography variant="body2" className={styles.enabledText}>
                28 permissions enabled
              </Typography>
            </Stack>
          </Box>
          <ButtonGroup variant="outlined" className={styles.editGroup}>
            <Button variant="contained">Edit</Button>
            <Button>Duplicate</Button>
          </ButtonGroup>
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
            {permissionGroups.map((group) => {
              const isExpanded = expandedGroups[group.title] !== false;

              return (
                <React.Fragment key={group.title}>
                  {/* Group Header - Clickable to toggle */}
                  <TableRow 
                    className={styles.groupRow}
                    onClick={() => toggleGroup(group.title)}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={1.25}>
                        <Box className={styles.groupIcon}>{group.icon}</Box>
                        <Typography className={styles.groupTitle}>{group.title}</Typography>
                        <Chip 
                          label={`${group.rows.length} permissions`} 
                          size="small" 
                          variant="outlined"
                          sx={{ ml: 1, height: 20, fontSize: '0.65rem' }}
                        />
                      </Stack>
                    </TableCell>
                    <TableCell colSpan={permissionHeaders.length} align="right">
                      <Stack direction="row" spacing={1.25} justifyContent="flex-end" alignItems="center">
                        {group.action && (
                          <Button 
                            variant="text" 
                            className={styles.selectAll}
                            onClick={(e) => e.stopPropagation()} // Prevent group toggle
                          >
                            {group.action}
                          </Button>
                        )}
                        <ExpandMoreIcon 
                          fontSize="small" 
                          className={`${styles.expandIcon} ${isExpanded ? styles.expanded : ''}`}
                          sx={{ 
                            transition: 'transform 0.25s ease',
                            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)'
                          }}
                        />
                      </Stack>
                    </TableCell>
                  </TableRow>

                  {/* Permission Rows - Only show if expanded */}
                  {isExpanded && group.rows.map((row) => (
                    <TableRow key={`${group.title}-${row.name}`} className={row.highlight ? styles.highlightRow : undefined}>
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
                          <PermissionCheck checked={checked} override={row.highlight && index === 5} />
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
              Changes will affect all users assigned to the Resource Manager role (8 users).
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1.5} justifyContent="flex-end">
            <Button variant="outlined" className={styles.cancelButton}>Cancel</Button>
            <Button variant="contained" className={styles.saveButton}>Save Permissions</Button>
          </Stack>
        </Stack>
      </Paper>
    </Box>
  );
};

export default RolesPage;
