import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Divider,
  Paper,
  LinearProgress,
} from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { DEPARTMENT_COLORS } from '../../Constants/dashboard.constants';
import styles from './DashboardCharts.module.scss';

interface DashboardChartsProps {
  billableData: {
    billable: number;
    nonBillable: number;
  };
  departmentData: {
    department: string;
    count: number;
    percentage: number;
  }[];
}

export const DashboardCharts = ({ billableData, departmentData }: DashboardChartsProps) => {
  const pieData = [
    { name: 'Billable', value: billableData.billable, color: 'var(--color-success-light)' },
    { name: 'Non-Billable', value: billableData.nonBillable, color: 'var(--color-text-muted)' },
  ];

  const maxDepartment = Math.max(...departmentData.map(d => d.count));

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <Card className={styles.chartCard}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Billable vs Non-Billable
            </Typography>
            <Box className={styles.pieContainer}>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
              <Box className={styles.pieCenter}>
                <Typography variant="h5" fontWeight={700}>
                  {billableData.billable + billableData.nonBillable}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Total Employees
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card className={styles.chartCard}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Employees by Department
            </Typography>
            <Box className={styles.departmentBars}>
              {departmentData.map((dept) => (
                <Box key={dept.department} className={styles.departmentBar}>
                  <Box className={styles.departmentLabel}>
                    <Typography variant="body2" fontWeight={500}>
                      {dept.department}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {dept.count}
                    </Typography>
                  </Box>
                  <Box className={styles.barTrack}>
                    <Box
                      className={styles.barFill}
                      sx={{
                        width: `${(dept.count / maxDepartment) * 100}%`,
                        bgcolor: DEPARTMENT_COLORS[dept.department as keyof typeof DEPARTMENT_COLORS] || 'var(--color-info)',
                      }}
                    />
                  </Box>
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};