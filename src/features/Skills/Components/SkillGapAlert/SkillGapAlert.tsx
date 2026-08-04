import React from 'react';
import { Alert, AlertTitle, Button, Stack, Box } from '@mui/material';
import { Warning as WarningIcon } from '@mui/icons-material';
import type { Skill } from '../../types/skill.types';

interface SkillGapAlertProps {
  skills: Skill[];
}

export const SkillGapAlert = ({ skills }: SkillGapAlertProps) => {
  const gapSkills = skills.filter(skill => skill.gap === 'Gap');
  
  if (gapSkills.length === 0) {
    return null;
  }

  const topGaps = gapSkills.slice(0, 3);
  const remainingCount = gapSkills.length - 3;

  return (
    <Alert 
      severity="warning" 
      icon={<WarningIcon />}
      sx={{ mb: 2, borderRadius: 'var(--radius-md)' }}
      action={
        <Button color="warning" size="small" sx={{ whiteSpace: 'nowrap' }}>
          View All →
        </Button>
      }
    >
      <AlertTitle sx={{ fontWeight: 600 }}>
        Skill Gaps Detected
      </AlertTitle>
      <Stack direction="row" spacing={0.5} flexWrap="wrap" alignItems="center">
        <Box component="span">
          {gapSkills.length} skills have high project demand but fewer than 3 employees covered:
        </Box>
        {topGaps.map((skill, index) => (
          <Box component="span" key={skill.id}>
            <Box component="strong" sx={{ fontWeight: 600 }}>
              {skill.name}
            </Box>
            {index < topGaps.length - 1 && ', '}
          </Box>
        ))}
        {remainingCount > 0 && (
          <Box component="span"> and {remainingCount} more</Box>
        )}
      </Stack>
    </Alert>
  );
};
