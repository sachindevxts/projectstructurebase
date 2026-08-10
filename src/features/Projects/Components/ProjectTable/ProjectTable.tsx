import React from 'react';
import { Box, Chip, IconButton, Tooltip, Typography } from '@mui/material';
import type { ChipProps } from '@mui/material/Chip';
import { Visibility } from '@mui/icons-material';
import type { Project } from '../../Types/project.types';
import { ReusableTable, type TableColumn } from '@/components/common';
import styles from './ProjectTable.module.scss';

interface ProjectTableProps {
  projects: Project[];
  loading?: boolean;
  onView: (project: Project) => void;
}

export const ProjectTable = ({ projects, loading = false, onView }: ProjectTableProps) => {
  const getStatusColor = (status: string): ChipProps['color'] => {
    switch (status) {
      case 'Active':
        return 'success';
      case 'At Risk':
        return 'error';
      case 'Completed':
        return 'info';
      case 'On Hold':
        return 'warning';
      default:
        return 'default';
    }
  };

  const columns: TableColumn<Project>[] = [
    {
      id: 'project',
      label: 'Project',
      renderCell: (project) => (
        <Box>
          <Typography variant="body2" fontWeight={600}>
            {project.name}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            {project.id}
          </Typography>
        </Box>
      ),
    },
    { id: 'client', label: 'Client', field: 'client' },
    {
      id: 'manager',
      label: 'Manager',
      renderCell: (project) => (
        <Box className={styles.manager}>
          <Box className={styles.managerAvatar}>{project.manager.charAt(0)}</Box>
          <Typography variant="body2">{project.manager}</Typography>
        </Box>
      ),
    },
    { id: 'start', label: 'Start Date', field: 'start' },
    { id: 'end', label: 'End Date', field: 'end' },
    {
      id: 'team',
      label: 'Team',
      align: 'center',
      renderCell: (project) => <Chip label={project.team} size="small" color="primary" />,
    },
    {
      id: 'billable',
      label: 'Billable',
      align: 'center',
      renderCell: (project) => (
        <Chip label={project.billable} size="small" color="success" variant="outlined" />
      ),
    },
    {
      id: 'status',
      label: 'Status',
      renderCell: (project) => (
        <Chip label={project.status} size="small" color={getStatusColor(project.status)} />
      ),
    },
    {
      id: 'actions',
      label: 'Actions',
      align: 'center',
      renderCell: (project) => (
        <Tooltip title="View Details">
          <IconButton
            size="small"
            onClick={() => onView(project)}
            color="primary"
            aria-label={`View ${project.name}`}
          >
            <Visibility fontSize="small" />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  return (
    <ReusableTable
      rows={projects}
      columns={columns}
      getRowId={(project) => project.id}
      loading={loading}
      emptyState={{
        title: 'No Projects Found',
        description: 'Try adjusting your search or add a new project.',
      }}
    />
  );
};

