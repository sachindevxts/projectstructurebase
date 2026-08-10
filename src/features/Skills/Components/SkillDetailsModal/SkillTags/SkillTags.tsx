import React from 'react';
import { Chip, Box } from '@mui/material';
import styles from './SkillTags.module.scss';

interface SkillTagsProps {
  tags: string[];
  variant?: 'default' | 'alias';
  maxDisplay?: number;
}

export const SkillTags = ({ tags, variant = 'default', maxDisplay = 10 }: SkillTagsProps) => {
  const displayTags = tags.slice(0, maxDisplay);
  
  if (displayTags.length === 0) {
    return null;
  }

  return (
    <Box className={styles.tagsContainer}>
      {displayTags.map((tag, index) => (
        <Chip
          key={`${tag}-${index}`}
          label={tag}
          size="small"
          color={variant === 'alias' ? 'default' : 'primary'}
          variant={variant === 'alias' ? 'outlined' : 'filled'}
        />
      ))}
    </Box>
  );
};
