import React from 'react';
import { Box, Chip, IconButton, Tooltip, Typography } from '@mui/material';
import { DeleteOutline, Edit, Visibility } from '@mui/icons-material';
import { DESIGNATION_LEVEL_COLORS } from '../../constants/designation.constants';
import type { Designation } from '../../types/designation.types';
import { ReusableTable, type TableColumn } from '@/components/common';
import styles from './DesignationTable.module.scss';

interface DesignationTableProps {
  designations: Designation[];
  loading?: boolean;
  onView?: (designation: Designation) => void;
  onEdit?: (designation: Designation) => void;
  onDelete?: (id: string) => void;
}

export const DesignationTable = ({
  designations,
  loading = false,
  onView,
  onEdit,
  onDelete,
}: DesignationTableProps) => {
  const columns: TableColumn<Designation>[] = [
    {
      id: 'designation',
      label: 'Designation',
      renderCell: (designation) => (
        <>
          <Typography variant="body2" fontWeight={600}>
            {designation.name}
          </Typography>
          {designation.description && (
            <Typography variant="caption" color="textSecondary">
              {designation.description}
            </Typography>
          )}
        </>
      ),
    },
    {
      id: 'department',
      label: 'Department',
      renderCell: (designation) => (
        <Chip label={designation.department} size="small" variant="outlined" />
      ),
    },
    {
      id: 'level',
      label: 'Level',
      renderCell: (designation) => {
        const levelColor = DESIGNATION_LEVEL_COLORS[designation.level] ?? '#64748B';
        return (
          <Chip
            label={designation.level}
            size="small"
            sx={{ bgcolor: `${levelColor}20`, color: levelColor, fontWeight: 600 }}
          />
        );
      },
    },
    {
      id: 'employees',
      label: 'Employees',
      align: 'center',
      renderCell: (designation) => (
        <Typography variant="body2" fontWeight={600}>
          {designation.employees}
        </Typography>
      ),
    },
    {
      id: 'skills',
      label: 'Skills',
      renderCell: (designation) => (
        <Box className={styles.skills}>
          {designation.skills.slice(0, 2).map((skill) => (
            <Chip key={skill} label={skill} size="small" variant="outlined" />
          ))}
          {designation.skills.length > 2 && (
            <Chip label={`+${designation.skills.length - 2}`} size="small" />
          )}
        </Box>
      ),
    },
    {
      id: 'status',
      label: 'Status',
      renderCell: (designation) => (
        <Chip
          label={designation.status}
          size="small"
          color={designation.status === 'Active' ? 'success' : 'default'}
        />
      ),
    },
    {
      id: 'actions',
      label: 'Actions',
      align: 'center',
      renderCell: (designation) => (
        <Box className={styles.actions}>
          <Tooltip title="View">
            <IconButton
              size="small"
              onClick={() => onView?.(designation)}
              color="primary"
              aria-label={`View ${designation.name}`}
            >
              <Visibility fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit">
            <IconButton
              size="small"
              onClick={() => onEdit?.(designation)}
              color="secondary"
              aria-label={`Edit ${designation.name}`}
            >
              <Edit fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              size="small"
              onClick={() => onDelete?.(designation.id)}
              color="error"
              aria-label={`Delete ${designation.name}`}
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
      rows={designations}
      columns={columns}
      getRowId={(designation) => designation.id}
      loading={loading}
      emptyState={{
        title: 'No Designations Found',
        description: 'Try adjusting filters or add a new designation.',
      }}
    />
  );
};
