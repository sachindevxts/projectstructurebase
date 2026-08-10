import React from 'react';
import { Box, Paper, Stack, Typography } from '@mui/material';
import type { BenchSkill } from '../../Types/bench.types';
import styles from './BenchChart.module.scss';

interface BenchChartProps {
  skills: BenchSkill[];
}

const referenceSkills = [
  { name: 'React', count: 8 },
  { name: 'Node', count: 5 },
  { name: 'Java', count: 4 },
  { name: 'Python', count: 6 },
  { name: 'QA', count: 7 },
  { name: 'DevOps', count: 3 },
];

export const BenchChart = ({ skills }: BenchChartProps) => {
  const chartSkills = skills.length ? referenceSkills : referenceSkills;
  const maxCount = Math.max(...chartSkills.map((skill) => skill.count));

  return (
    <Paper elevation={0} className={styles.chartCard}>
      <Typography variant="h6" className={styles.title}>
        Bench by Skills
      </Typography>
      <Box className={styles.chartViewport}>
        <Box className={styles.yAxis}>
          {[8, 7, 6, 5, 4, 3, 2, 0].map((tick) => (
            <span key={tick}>{tick}</span>
          ))}
        </Box>
        <Stack
          direction="row"
          alignItems="flex-end"
          justifyContent="space-around"
          className={styles.chart}
        >
          {chartSkills.map((skill) => (
            <Box key={skill.name} className={styles.bar}>
              <Box
                className={styles.barFill}
                sx={{ height: `${(skill.count / maxCount) * 100}%` }}
              />
              <Typography variant="caption" className={styles.barLabel}>
                {skill.name}
              </Typography>
            </Box>
          ))}
        </Stack>
      </Box>
    </Paper>
  );
};
