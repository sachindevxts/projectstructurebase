import React from 'react';
import { Box, Chip, Typography } from '@mui/material';
import type { ChipProps } from '@mui/material/Chip';
import type { Skill } from '../../types/skill.types';
import { ReusableTable, type TableColumn, type TableRowId } from '@/components/common/ReusableTable';
import { SkillActions } from './SkillActions';
import styles from './SkillTable.module.scss';

interface SkillTableProps {
  skills: Skill[];
  selectedRows: string[];
  loading?: boolean;
  onToggleSelection: (id: string) => void;
  onToggleAll: (ids: string[]) => void;
  onView: (skill: Skill) => void;
  onEdit: (skill: Skill) => void;
  onDelete: (id: string) => void;
}

export const SkillTable = ({
  skills,
  selectedRows,
  loading = false,
  onToggleSelection,
  onToggleAll,
  onView,
  onEdit,
  onDelete,
}: SkillTableProps) => {
  const getGapColor = (gap: string): ChipProps['color'] => {
    if (gap === 'Covered') return 'success';
    if (gap === 'Gap') return 'error';
    return 'warning';
  };

  const getDemandColor = (demand: string) => {
    switch (demand.toLowerCase()) {
      case 'high':
      case 'critical':
        return 'var(--color-error)';
      case 'medium':
        return 'var(--color-warning-light)';
      case 'low':
        return 'var(--color-success-light)';
      default:
        return 'var(--color-text-muted)';
    }
  };

  const handleSelectionChange = (ids: TableRowId[]) => {
    const nextIds = ids.map(String);
    const changedId =
      nextIds.find((id) => !selectedRows.includes(id)) ??
      selectedRows.find((id) => !nextIds.includes(id));

    if (changedId && Math.abs(nextIds.length - selectedRows.length) === 1) {
      onToggleSelection(changedId);
      return;
    }

    onToggleAll(skills.map((skill) => skill.id));
  };

  const columns: TableColumn<Skill>[] = [
    {
      id: 'name',
      label: 'Skill Name',
      renderCell: (skill) => (
        <Box className={styles.skillName}>
          <Box className={styles.skillInitials}>{skill.name.slice(0, 2)}</Box>
          <Box>
            <Typography variant="body2" fontWeight={600}>
              {skill.name}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              {skill.updatedAt
                ? `Updated ${new Date(skill.updatedAt).toLocaleDateString('en-US', {
                    month: 'short',
                    year: 'numeric',
                  })}`
                : 'Updated recently'}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      id: 'category',
      label: 'Category',
      renderCell: (skill) => <Chip label={skill.category} size="small" color="primary" variant="outlined" />,
    },
    {
      id: 'employees',
      label: 'Employees',
      align: 'center',
      renderCell: (skill) => (
        <Box className={styles.employeeCount}>
          <Box className={styles.employeeIcons}>
            <Box component="span" />
            <Box component="span" />
            <Box component="span" />
          </Box>
          {skill.employees}
        </Box>
      ),
    },
    {
      id: 'demand',
      label: 'Demand Level',
      renderCell: (skill) => (
        <Box
          className={styles.demandBadge}
          sx={{
            bgcolor: `color-mix(in srgb, ${getDemandColor(skill.demand)} 12%, transparent)`,
            color: getDemandColor(skill.demand),
            borderColor: getDemandColor(skill.demand),
          }}
        >
          {skill.demand}
        </Box>
      ),
    },
    {
      id: 'coverage',
      label: 'Coverage %',
      align: 'center',
      renderCell: (skill) => (
        <Box className={styles.coverageBar}>
          <Box className={styles.coverageTrack}>
            <Box className={styles.coverageFill} sx={{ width: `${skill.coverage}%` }} />
          </Box>
          <Typography variant="caption" fontWeight={600}>
            {skill.coverage}%
          </Typography>
        </Box>
      ),
    },
    {
      id: 'gap',
      label: 'Gap Status',
      renderCell: (skill) => <Chip label={skill.gap} size="small" color={getGapColor(skill.gap)} />,
    },
    {
      id: 'actions',
      label: 'Actions',
      align: 'center',
      renderCell: (skill) => (
        <SkillActions
          onView={() => onView(skill)}
          onEdit={() => onEdit(skill)}
          onDelete={() => onDelete(skill.id)}
        />
      ),
    },
  ];

  return (
    <ReusableTable
      rows={skills}
      columns={columns}
      getRowId={(skill) => skill.id}
      loading={loading}
      selection={{
        selectedRowIds: selectedRows,
        onSelectionChange: handleSelectionChange,
        mode: 'multiple',
      }}
      emptyState={{
        title: 'No Skills Found',
        description: 'Try adjusting your filters or add a new skill.',
      }}
    />
  );
};
