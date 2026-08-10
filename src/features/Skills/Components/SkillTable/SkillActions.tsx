import React from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import { Visibility, Edit, DeleteOutline } from '@mui/icons-material';
import styles from './SkillTable.module.scss';

interface SkillActionsProps {
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const SkillActions = ({ onView, onEdit, onDelete }: SkillActionsProps) => {
  return (
    <Box className={styles.actions}>
      <Tooltip title="View Skill">
        <IconButton size="small" onClick={onView} color="primary">
          <Visibility fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Edit Skill">
        <IconButton size="small" onClick={onEdit} color="secondary">
          <Edit fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Delete Skill">
        <IconButton size="small" onClick={onDelete} color="error">
          <DeleteOutline fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  );
};
