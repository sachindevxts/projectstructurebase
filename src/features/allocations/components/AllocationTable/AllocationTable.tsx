import React from 'react';
import { Box, Chip, IconButton, Tooltip, Typography } from '@mui/material';
import type { ChipProps } from '@mui/material/Chip';
import { Block, Edit, MoreVert } from '@mui/icons-material';
import type { Allocation } from '../../Types/allocation.types';
import { CapacityBar } from '@/features/Shared';
import { ReusableTable, type TableColumn } from '@/components/common';
import styles from './AllocationTable.module.scss';

interface AllocationTableProps {
  allocations: Allocation[];
  loading?: boolean;
  canUpdate?: boolean;
  canRelease?: boolean;
}

export const AllocationTable = ({
  allocations,
  loading = false,
  canUpdate = false,
  canRelease = false,
}: AllocationTableProps) => {
  const getStatusColor = (status: string): ChipProps['color'] => {
    switch (status) {
      case 'Active':
        return 'success';
      case 'Overallocated':
        return 'error';
      case 'Releasing Soon':
        return 'warning';
      case 'Completed':
        return 'info';
      default:
        return 'default';
    }
  };

  const getBillabilityColor = (billability: string): ChipProps['color'] =>
    billability === 'Billable' ? 'success' : 'default';

  const columns: TableColumn<Allocation>[] = [
    {
      id: 'employee',
      label: 'Employee',
      renderCell: (allocation) => (
        <Box className={styles.employeeName}>
          <Box className={styles.employeeAvatar}>
            {allocation.employee
              .split(' ')
              .map((name) => name[0])
              .join('')}
          </Box>
          <Typography variant="body2" fontWeight={500}>
            {allocation.employee}
          </Typography>
        </Box>
      ),
    },
    { id: 'project', label: 'Project', field: 'project' },
    { id: 'role', label: 'Role', field: 'role' },
    { id: 'start', label: 'Start', field: 'start' },
    { id: 'end', label: 'End', field: 'end' },
    {
      id: 'allocation',
      label: 'Allocation',
      align: 'center',
      renderCell: (allocation) => (
        <Box className={styles.allocationCell}>
          <CapacityBar value={allocation.allocation} showLabel={false} />
          <Typography variant="caption" fontWeight={600}>
            {allocation.allocation}%
          </Typography>
        </Box>
      ),
    },
    {
      id: 'billability',
      label: 'Billability',
      renderCell: (allocation) => (
        <Chip
          label={allocation.billability}
          size="small"
          color={getBillabilityColor(allocation.billability)}
          variant={allocation.billability === 'Billable' ? 'filled' : 'outlined'}
        />
      ),
    },
    {
      id: 'status',
      label: 'Status',
      renderCell: (allocation) => (
        <Chip label={allocation.status} size="small" color={getStatusColor(allocation.status)} />
      ),
    },
    {
      id: 'actions',
      label: 'Actions',
      align: 'center',
      renderCell: () => (
        <Box className={styles.actions}>
          {canUpdate && (
            <Tooltip title="Edit">
              <IconButton size="small" color="primary" aria-label="Edit allocation">
                <Edit fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          {canRelease && (
            <Tooltip title="Release">
              <IconButton size="small" color="warning" aria-label="Release allocation">
                <Block fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          {(canUpdate || canRelease) && (
            <Tooltip title="More">
              <IconButton size="small" aria-label="More allocation actions">
                <MoreVert fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      ),
    },
  ];

  return (
    <ReusableTable
      rows={allocations}
      columns={columns}
      getRowId={(allocation) => allocation.id}
      loading={loading}
      emptyState={{
        title: 'No Allocations Found',
        description: 'No allocations match your search criteria.',
      }}
    />
  );
};

