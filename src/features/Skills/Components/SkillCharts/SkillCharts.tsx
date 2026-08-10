import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  Tooltip,
} from '@mui/material';
import type { Skill, SkillCategory } from '../../types/skill.types';
import { CATEGORY_COLORS } from '../../constants/skill.constants';
import styles from './SkillCharts.module.scss';

interface SkillChartsProps {
  skills: Skill[];
}

export const SkillCharts = ({ skills }: SkillChartsProps) => {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  const categoryMap = skills.reduce((acc, skill) => {
    acc[skill.category] = (acc[skill.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const categoryData: SkillCategory[] = Object.entries(categoryMap).map(([name, count]) => ({
    name,
    count,
    color: CATEGORY_COLORS[name] || 'var(--color-text-muted)',
  }));

  const total = categoryData.reduce((sum, item) => sum + item.count, 0);
  let offset = 0;

  return (
    <Grid container spacing={2} className={styles.chartsContainer}>
      <Grid item xs={12} md={8}>
        <Card className={styles.chartCard}>
          <CardContent>
            <Box className={styles.chartHeader}>
              <Typography variant="h6">Top Skills by Employee Coverage</Typography>
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Department</InputLabel>
                <Select defaultValue="All">
                  <MenuItem value="All">All Departments</MenuItem>
                  <MenuItem value="Engineering">Engineering</MenuItem>
                  <MenuItem value="Design">Design</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box className={styles.horizontalBars}>
              {skills.map((skill) => (
                <Box key={skill.id} className={styles.barItem}>
                  <Typography variant="body2" className={styles.barLabel}>
                    {skill.name}
                  </Typography>
                  <Box className={styles.barTrack}>
                    <Box 
                      className={styles.barFill}
                      sx={{ width: `${Math.min(skill.employees * 2, 100)}%` }}
                    />
                  </Box>
                  <Typography variant="body2" className={styles.barValue}>
                    {skill.employees}
                  </Typography>
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={4}>
        <Card className={styles.chartCard}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Skills by Category
            </Typography>
            <Box className={styles.donutContainer}>
              <Box className={styles.donut}>
                <svg viewBox="0 0 42 42" role="img" aria-label="Skills by category">
                  {categoryData.map((item) => {
                    const length = (item.count / total) * 100;
                    const segment = (
                      <circle
                        key={item.name}
                        cx="21"
                        cy="21"
                        r="15.915"
                        fill="none"
                        stroke={item.color}
                        strokeWidth="8"
                        strokeDasharray={`${length} ${100 - length}`}
                        strokeDashoffset={-offset}
                        onMouseEnter={() => setHoveredCategory(item.name)}
                        onMouseLeave={() => setHoveredCategory(null)}
                        className={styles.donutSegment}
                      >
                        <title>
                          {item.name}: {item.count}
                        </title>
                      </circle>
                    );
                    offset += length;
                    return segment;
                  })}
                </svg>
                {hoveredCategory && (
                  <Paper className={styles.chartTooltip}>
                    {hoveredCategory}: {categoryMap[hoveredCategory]}
                  </Paper>
                )}
              </Box>
              <Box className={styles.legend}>
                {categoryData.map((item) => (
                  <Box key={item.name} className={styles.legendItem}>
                    <Box 
                      className={styles.legendColor}
                      sx={{ bgcolor: item.color }}
                    />
                    <Typography variant="caption">{item.name}</Typography>
                    <Typography variant="caption" fontWeight={600}>
                      {item.count}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

