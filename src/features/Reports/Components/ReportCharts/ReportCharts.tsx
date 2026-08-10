import React from 'react';
import { Box, Grid, Paper, Typography } from '@mui/material';
import { Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { REPORT_COLORS } from '../../constants/report.constants';
import type { ReportData } from '../../types/report.types';
import { radius } from '@/styles/theme';
import styles from './ReportCharts.module.scss';

interface ReportChartsProps {
  data: ReportData;
}

export const ReportCharts = ({ data }: ReportChartsProps) => {
  const pieColors = [REPORT_COLORS.billable, REPORT_COLORS.internal, REPORT_COLORS.bench];

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} lg={8}>
        <Paper elevation={0} className={styles.chartCard}>
          <Typography variant="h6" className={styles.chartTitle}>Monthly Allocation Trend</Typography>
          <Box className={styles.chart}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="billable" stroke={REPORT_COLORS.billable} strokeWidth={2} />
                <Line type="monotone" dataKey="bench" stroke={REPORT_COLORS.bench} strokeWidth={2} />
                <Line type="monotone" dataKey="overallocated" stroke={REPORT_COLORS.overallocated} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </Paper>
      </Grid>
      <Grid item xs={12} lg={4}>
        <Paper elevation={0} className={styles.chartCard}>
          <Typography variant="h6" className={styles.chartTitle}>Allocation Mix</Typography>
          <Box className={styles.chart}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data.allocationMix} dataKey="value" nameKey="name" innerRadius={58} outerRadius={90} paddingAngle={3} label>
                  {data.allocationMix.map((entry, index) => <Cell key={entry.name} fill={pieColors[index % pieColors.length]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <Paper elevation={0} className={styles.chartCard}>
          <Typography variant="h6" className={styles.chartTitle}>Department Utilization</Typography>
          <Box className={styles.chart}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.departmentUtilization}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="department" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="utilization" fill={REPORT_COLORS.utilization} radius={[radius.sm, radius.sm, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

