import React from 'react';
import { Box, Grid, Paper, Stack, Typography } from '@mui/material';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ScatterChart,
  Scatter,
} from 'recharts';

import styles from './ExecutiveOverviewPage.module.scss';

const kpiData = [
  { id: 'booked', label: 'BOOKED REVENUE', value: '₹8.4Cr', sub: '14% vs Prev. Qtr' },
  { id: 'collected', label: 'COLLECTED CASH', value: '₹6.2Cr', sub: '74% collection rate' },
  { id: 'outstanding', label: 'OUTSTANDING AMOUNT', value: '₹2.2Cr', sub: '₹48L high risk' },
  { id: 'gross', label: 'GROSS MARGIN %', value: '24.5%', sub: 'Target: 22.0%' },
  { id: 'weighted', label: 'WEIGHTED PIPELINE', value: '₹4.8Cr', sub: 'Forecast accuracy: 92%' },
];

const revenueData = [
  { month: 'Apr', actual: 100, target: 120 },
  { month: 'May', actual: 130, target: 140 },
  { month: 'Jun', actual: 120, target: 150 },
  { month: 'Jul', actual: 170, target: 160 },
  { month: 'Aug', actual: 150, target: 165 },
  { month: 'Sep', actual: 200, target: 210 },
];

const pipelineStages = [
  {
    label: 'Lead Generation',
    x: 26,
    y: 84,
    width: 220,
  },
  {
    label: 'Qualification',
    x: 46,
    y: 134,
    width: 180,
  },
  {
    label: 'Needs Assessment',
    x: 66,
    y: 184,
    width: 140,
  },
  {
    label: 'Proposal/Negotiation',
    x: 76,
    y: 234,
    width: 120,
  },
  { label: 'Closing', x: 100, y: 284, width: 72 },
];

const funnelStages = [
  {
    label: 'Awareness',
    x: 300,
    y: 84,
    width: 220,
  },
  {
    label: 'Interest',
    x: 320,
    y: 134,
    width: 180,
  },
  {
    label: 'Decision',
    x: 340,
    y: 184,
    width: 140,
  },
  {
    label: 'Action',
    x: 360,
    y: 234,
    width: 110,
  },
  { label: 'Retention', x: 380, y: 284, width: 72 },
];

const pipelineConnectors = [
  { x: 23.8, y: 118.4, width: 39, height: 200, rotate: -73 },
  { x: 48, y: 170, width: 27.8, height: 160, rotate: -72.1 },
  { x: 67.8, y: 217.6, width: 27.6, height: 126, rotate: -65 },
  { x: 87.6, y: 266, width: 24.4, height: 86, rotate: -54 },
];

const funnelConnectors = [
  { x: 297.8, y: 118.4, width: 39, height: 200, rotate: -73 },
  { x: 322, y: 170, width: 27.8, height: 160, rotate: -72.1 },
  { x: 341.8, y: 217.6, width: 27.6, height: 126, rotate: -65 },
  { x: 361.6, y: 266, width: 24.4, height: 86, rotate: -54 },
];

const attentionList = [
  {
    title: 'Project Alpha Margin Alert',
    note: 'Margin declined from 24% to 11% this month',
    tone: 'HIGH PRIORITY',
  },
  { title: 'Target at Risk: Enterprise Sales', note: 'Requires ₹84L in closed-won by end of Q3' },
  { title: 'Large Overdue Invoice', note: '₹12.8L overdue by 45 days - Globex Corp' },
];

const profitabilityData = [
  { x: 1.2, y: 15, r: 40 },
  { x: 1.6, y: 12, r: 20 },
  { x: 2.4, y: 30, r: 60 },
  { x: 3.1, y: 25, r: 80 },
  { x: 2.1, y: 22, r: 45 },
];

const KPI = ({ item }: { item: (typeof kpiData)[0] }) => (
  <Paper elevation={0} className={styles.kpiCard}>
    <Typography variant="caption" className={styles.kpiLabel}>
      {item.label}
    </Typography>
    <Typography variant="h6" className={styles.kpiValue}>
      {item.value}
    </Typography>
    <Typography variant="caption" className={styles.kpiSub}>
      {item.sub}
    </Typography>
  </Paper>
);

const ExecutiveOverviewPage: React.FC = () => {
  return (
    <Box className={styles.page}>
      <Typography variant="h5" className={styles.pageTitle} gutterBottom>
        Executive Revenue Overview
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Stack direction="row" spacing={2} className={styles.kpiRow}>
            {kpiData.map((k) => (
              <KPI key={k.id} item={k} />
            ))}
          </Stack>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper elevation={0} className={styles.chartPanel}>
            <Typography className={styles.chartTitle}>
              Revenue Performance: Target vs Actual
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData} margin={{ top: 16, right: 24, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="actual" stroke="#2b6cb0" strokeWidth={3} dot />
                <Line type="monotone" dataKey="target" stroke="#a0aec0" strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper elevation={0} className={styles.funnelPanel}>
            <svg
              className={styles.funnelSvg}
              viewBox="0 0 546 350"
              role="img"
              aria-label="Sales Pipeline versus Sales Funnel"
            >
              <text x="28" y="48" className={styles.funnelTitle}>
                Sales Pipeline
              </text>
              <text x="270" y="48" className={styles.funnelVs}>
                vs
              </text>
              <text x="324" y="48" className={styles.funnelTitle}>
                Sales Funnel
              </text>

              {pipelineConnectors.map((item) => (
                <rect
                  key={`pipeline-connector-${item.y}`}
                  className={styles.pipelineShadow}
                  x={item.x}
                  y={item.y}
                  width={item.width}
                  height={item.height}
                  rx="18"
                  transform={`rotate(${item.rotate} ${item.x} ${item.y})`}
                />
              ))}
              {funnelConnectors.map((item) => (
                <rect
                  key={`funnel-connector-${item.y}`}
                  className={styles.funnelShadow}
                  x={item.x}
                  y={item.y}
                  width={item.width}
                  height={item.height}
                  rx="18"
                  transform={`rotate(${item.rotate} ${item.x} ${item.y})`}
                />
              ))}

              {pipelineStages.map((stage) => (
                <g key={stage.label}>
                  <rect
                    className={styles.pipelinePill}
                    x={stage.x}
                    y={stage.y}
                    width={stage.width}
                    height="40"
                    rx="20"
                  />
                  <text
                    x={stage.x + stage.width / 2}
                    y={stage.y + 24}
                    className={styles.funnelLabel}
                  >
                    {stage.label}
                  </text>
                </g>
              ))}
              {funnelStages.map((stage) => (
                <g key={stage.label}>
                  <rect
                    className={styles.salesFunnelPill}
                    x={stage.x}
                    y={stage.y}
                    width={stage.width}
                    height="40"
                    rx="20"
                  />
                  <text
                    x={stage.x + stage.width / 2}
                    y={stage.y + 24}
                    className={styles.funnelLabel}
                  >
                    {stage.label}
                  </text>
                </g>
              ))}
            </svg>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={0} className={styles.cardList}>
            <Typography className={styles.cardTitle}>Executive Attention</Typography>
            <Box>
              {attentionList.map((a, i) => (
                <Box key={i} className={styles.attentionRow}>
                  <Box>
                    <Typography variant="body2" fontWeight={600}>
                      {a.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {a.note}
                    </Typography>
                  </Box>
                  {a.tone && <Typography className={styles.attentionTone}>{a.tone}</Typography>}
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={0} className={styles.chartPanel}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography className={styles.chartTitle}>Project Profitability</Typography>
              <Typography variant="caption" color="primary">
                Full Analysis
              </Typography>
            </Box>
            <ResponsiveContainer width="100%" height={260}>
              <ScatterChart>
                <CartesianGrid />
                <XAxis type="number" dataKey="x" name="revenue" />
                <YAxis type="number" dataKey="y" name="profit" />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Scatter data={profitabilityData} fill="#3086e9" shape="circle"  />
              </ScatterChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ExecutiveOverviewPage;
