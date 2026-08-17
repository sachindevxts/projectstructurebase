import React, { useMemo, useState } from 'react';
import {
  Avatar,
  Box,
  Chip,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { DeleteOutline, Edit, MoreVert, Visibility } from '@mui/icons-material';
import type { ChipProps } from '@mui/material/Chip';
import type { Employee } from '../../Types/employee.types';
import {
  ReusableTable,
  type TableColumn,
  type TableRowId,
  type TableSortModel,
} from '@/components/common/ReusableTable';
import styles from './EmployeeTable.module.scss';

interface EmployeeTableProps {
  employees: Employee[];
  selectedRows: string[];
  loading?: boolean;
  onToggleSelection: (id: string) => void;
  onToggleAll: (ids: string[]) => void;
  onView: (employee: Employee) => void;
  onEdit?: (employee: Employee) => void;
  onDelete?: (id: string) => void;
}

interface AllocationSegment {
  label: string;
  percent: number;
}

const TOTAL_EMPLOYEES_LABEL = 147;

const getStatusColor = (status: Employee['status']): ChipProps['color'] => {
  switch (status) {
    case 'Active':
      return 'success';
    case 'On Leave':
    case 'Releasing Soon':
      return 'warning';
    case 'Overallocated':
      return 'error';
    default:
      return 'default';
  }
};

const getInitials = (name: string) =>
  name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

const getAllocationSegments = (employee: Employee): AllocationSegment[] => {
  if (employee.allocation <= 0) {
    return [];
  }

  if (employee.name === 'Aditi Mehra') {
    return [
      { label: 'NovaBank', percent: 70 },
      { label: 'Internal', percent: 30 },
    ];
  }

  if (employee.name === 'Neha Joshi') {
    return [
      { label: 'HealthBridge', percent: 80 },
      { label: 'Internal', percent: 50 },
    ];
  }

  if (employee.name === 'Rahul Verma') {
    return [{ label: 'BrightRetail', percent: 100 }];
  }

  if (employee.name === 'Karan Malhotra') {
    return [{ label: 'Internal HR', percent: 100 }];
  }

  return [{ label: 'HealthBridge', percent: employee.allocation }];
};

const formatEmployeeId = (id: string) => id.replace('-', '-\n');

const AllocationCell = ({ employee }: { employee: Employee }) => {
  const segments = getAllocationSegments(employee);
  const isOverallocated = employee.allocation > 100 || employee.status === 'Overallocated';

  if (!segments.length) {
    return (
      <Box className={styles.noAllocation}>
        <Typography variant="caption">No active allocation</Typography>
        <Box className={styles.emptyAllocationTrack} />
      </Box>
    );
  }

  return (
    <Box className={styles.allocationCell}>
      <Stack direction="row" spacing={0.75} className={styles.allocationLabels}>
        {segments.map((segment) => (
          <Typography key={segment.label} variant="caption">
            {segment.label} <strong>{segment.percent}%</strong>
          </Typography>
        ))}
      </Stack>
      <Box className={styles.allocationTrack}>
        {segments.map((segment) => (
          <Box
            key={segment.label}
            className={isOverallocated ? styles.allocationSegmentDanger : styles.allocationSegment}
            sx={{ width: `${Math.min(segment.percent, 100)}%` }}
          />
        ))}
      </Box>
      {isOverallocated && (
        <Typography variant="caption" className={styles.overallocatedText}>
          {employee.allocation}% - Overallocated
        </Typography>
      )}
    </Box>
  );
};

export const EmployeeTable = ({
  employees,
  selectedRows,
  loading = false,
  onToggleSelection,
  onToggleAll,
  onView,
  onEdit,
  onDelete,
}: EmployeeTableProps) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [sortModel, setSortModel] = useState<TableSortModel>({
    columnId: 'employee',
    direction: 'asc',
  });
  const displayedEmployees = useMemo(
    () => employees.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [employees, page, rowsPerPage],
  );

  const handleSelectionChange = (ids: TableRowId[]) => {
    const nextIds = ids.map(String);
    const changedId =
      nextIds.find((id) => !selectedRows.includes(id)) ??
      selectedRows.find((id) => !nextIds.includes(id));

    if (changedId && Math.abs(nextIds.length - selectedRows.length) === 1) {
      onToggleSelection(changedId);
      return;
    }

    onToggleAll(displayedEmployees.map((employee) => employee.id));
  };

  const columns: TableColumn<Employee>[] = [
    {
      id: 'employee',
      label: 'Employee',
      sortable: true,
      renderCell: (employee) => (
        <Box className={styles.employeeName}>
          <Avatar className={styles.employeeAvatar}>{getInitials(employee.name)}</Avatar>
          <Box className={styles.employeeIdentity}>
            <Typography variant="body2" className={styles.employeeTitle}>
              {employee.name}
            </Typography>
            <Typography variant="caption" className={styles.employeeEmail}>
              {employee.email}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      id: 'employeeId',
      label: 'Emp ID',
      renderCell: (employee) => (
        <Typography variant="body2" className={styles.employeeId}>
          {formatEmployeeId(employee.id)}
        </Typography>
      ),
    },
    { id: 'department', label: 'Department', field: 'department' },
    { id: 'designation', label: 'Designation', field: 'designation' },
    { id: 'manager', label: 'Manager', field: 'manager' },
    {
      id: 'type',
      label: 'Type',
      renderCell: (employee) => (
        <Chip
          label={employee.type}
          size="small"
          className={employee.type === 'Full-Time' ? styles.typeChip : styles.contractChip}
        />
      ),
    },
    { id: 'joined', label: 'Joined', field: 'joined', sortable: true },
    {
      id: 'allocation',
      label: 'Allocation',
      renderCell: (employee) => <AllocationCell employee={employee} />,
    },
    {
      id: 'billability',
      label: 'Billability',
      renderCell: (employee) => (
        <Chip
          label={employee.billability}
          size="small"
          className={employee.billability === 'Billable' ? styles.billableChip : styles.nonBillableChip}
        />
      ),
    },
    {
      id: 'status',
      label: 'Status',
      renderCell: (employee) => (
        <Chip
          label={employee.status}
          size="small"
          color={getStatusColor(employee.status)}
          className={employee.status === 'Active' ? styles.activeChip : undefined}
        />
      ),
    },
    {
      id: 'actions',
      label: 'Actions',
      align: 'center',
      renderCell: (employee) => (
        <Box className={styles.actions}>
          <Tooltip title="View employee">
            <IconButton size="small" onClick={() => onView(employee)} aria-label={`View ${employee.name}`}>
              <Visibility fontSize="small" />
            </IconButton>
          </Tooltip>
          {onEdit && (
            <Tooltip title="Edit employee">
              <IconButton size="small" onClick={() => onEdit(employee)} aria-label={`Edit ${employee.name}`}>
                <Edit fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          {onDelete && (
            <Tooltip title="Delete employee">
              <IconButton size="small" onClick={() => onDelete(employee.id)} aria-label={`Delete ${employee.name}`}>
                <DeleteOutline fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title="More actions">
            <IconButton size="small" aria-label={`More actions for ${employee.name}`}>
              <MoreVert fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'stretch', sm: 'center' }}
        spacing={1.5}
        className={styles.tableToolbar}
      >
        <Typography variant="body2" className={styles.resultText}>
          Showing <strong>1-15</strong> of {TOTAL_EMPLOYEES_LABEL}
        </Typography>
        <Stack direction="row" spacing={1} alignItems="center" className={styles.densityControl}>
          <Typography variant="body2">Density:</Typography>
          <Chip label="Compact" size="small" className={styles.activeDensity} />
          <Chip label="Default" size="small" variant="outlined" className={styles.defaultDensity} />
        </Stack>
      </Stack>

      <ReusableTable
        rows={displayedEmployees}
        columns={columns}
        getRowId={(employee) => employee.id}
        loading={loading}
        sortModel={sortModel}
        onSortChange={setSortModel}
        selection={{
          selectedRowIds: selectedRows,
          onSelectionChange: handleSelectionChange,
          mode: 'multiple',
        }}
        emptyState={{
          title: 'No Employees Found',
          description: 'Try adjusting your filters or add a new employee.',
        }}
        pagination={{
          page,
          rowsPerPage,
          totalRows: TOTAL_EMPLOYEES_LABEL,
          rowsPerPageOptions: [15, 25, 50],
          onPageChange: setPage,
          onRowsPerPageChange: (nextRowsPerPage) => {
            setRowsPerPage(nextRowsPerPage);
            setPage(0);
          },
          formatResultCount: ({ from, to, total }) => `Showing ${from}-${to} of ${total} employees`,
        }}
      />
    </>
  );
};

