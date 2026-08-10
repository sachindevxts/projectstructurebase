import React from 'react';
import { Box, Chip, IconButton, Tooltip, Typography } from '@mui/material';
import { DeleteOutline, Edit, Visibility } from '@mui/icons-material';
import { CLIENT_HEALTH_COLORS } from '../../constants/client.constants';
import type { Client } from '../../types/client.types';
import { ReusableTable, type TableColumn } from '@/components/common';
import styles from './ClientTable.module.scss';

interface ClientTableProps {
  clients: Client[];
  loading?: boolean;
  onView?: (client: Client) => void;
  onEdit?: (client: Client) => void;
  onDelete?: (id: string) => void;
}

export const ClientTable = ({ clients, loading = false, onView, onEdit, onDelete }: ClientTableProps) => {
  const columns: TableColumn<Client>[] = [
    {
      id: 'client',
      label: 'Client',
      renderCell: (client) => (
        <>
          <Typography variant="body2" fontWeight={600}>
            {client.name}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            {client.location} - {client.startDate}
          </Typography>
        </>
      ),
    },
    {
      id: 'industry',
      label: 'Industry',
      renderCell: (client) => <Chip label={client.industry} size="small" variant="outlined" />,
    },
    { id: 'accountManager', label: 'Account Manager', field: 'accountManager' },
    {
      id: 'projects',
      label: 'Projects',
      align: 'center',
      renderCell: (client) => `${client.activeProjects}/${client.projects}`,
    },
    { id: 'allocated', label: 'Allocated', align: 'center', field: 'employeesAllocated' },
    {
      id: 'health',
      label: 'Health',
      renderCell: (client) => (
        <Chip
          label={client.health}
          size="small"
          color={CLIENT_HEALTH_COLORS[client.health] ?? 'default'}
        />
      ),
    },
    {
      id: 'status',
      label: 'Status',
      renderCell: (client) => (
        <Chip
          label={client.status}
          size="small"
          color={client.status === 'Active' ? 'success' : 'default'}
        />
      ),
    },
    {
      id: 'actions',
      label: 'Actions',
      align: 'center',
      renderCell: (client) => (
        <Box className={styles.actions}>
          <Tooltip title="View">
            <IconButton
              size="small"
              onClick={() => onView?.(client)}
              color="primary"
              aria-label={`View ${client.name}`}
            >
              <Visibility fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit">
            <IconButton
              size="small"
              onClick={() => onEdit?.(client)}
              color="secondary"
              aria-label={`Edit ${client.name}`}
            >
              <Edit fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              size="small"
              onClick={() => onDelete?.(client.id)}
              color="error"
              aria-label={`Delete ${client.name}`}
            >
              <DeleteOutline fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <ReusableTable
      rows={clients}
      columns={columns}
      getRowId={(client) => client.id}
      loading={loading}
      emptyState={{
        title: 'No Clients Found',
        description: 'Try adjusting filters or add a new client.',
      }}
    />
  );
};

