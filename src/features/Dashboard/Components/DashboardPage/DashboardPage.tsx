import React from 'react';
import {
  Avatar,
  Box,
  Button,
  Chip,
  FormControl,
  LinearProgress,
  MenuItem,
  Paper,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import {
  Add as AddIcon,
  BusinessCenter as BusinessIcon,
  CheckCircle as CheckCircleIcon,
  Download as DownloadIcon,
  Groups as GroupsIcon,
  HourglassBottom as HourglassIcon,
  Paid as PaidIcon,
  PersonOff as PersonOffIcon,
  TrendingUp as TrendingUpIcon,
  WarningAmber as WarningIcon,
  Work as WorkIcon,
} from '@mui/icons-material';
import { ReusableTable, type TableColumn } from '@/components/common';
import { useDashboardData } from '../../Hooks/useDashboardData';
import styles from './DashboardPage.module.scss';

const kpis = [
  { label: 'Total Employees', value: '247', delta: '+8.2%', icon: <GroupsIcon />, tone: 'blue' },
  {
    label: 'Active Employees',
    value: '231',
    delta: '+3.4%',
    icon: <CheckCircleIcon />,
    tone: 'green',
  },
  { label: 'Active Projects', value: '18', delta: '+12%', icon: <WorkIcon />, tone: 'blue' },
  { label: 'Billable Employees', value: '181', delta: '+4.6%', icon: <PaidIcon />, tone: 'green' },
  { label: 'Bench Employees', value: '50', delta: '+10.8%', icon: <BusinessIcon />, tone: 'slate' },
  { label: 'Releasing Soon', value: '23', delta: '+4', icon: <HourglassIcon />, tone: 'orange' },
  { label: 'Overallocated', value: '7', delta: 'High Risk', icon: <WarningIcon />, tone: 'red' },
  {
    label: 'Open Positions',
    value: '14',
    delta: 'Need Hire',
    icon: <PersonOffIcon />,
    tone: 'orange',
  },
];

const billableData = [
  { name: 'Billable', value: 181, color: 'var(--color-primary)' },
  { name: 'Non-Billable', value: 50, color: 'var(--color-text-muted)' },
  { name: 'Bench', value: 16, color: 'var(--color-border)' },
];

const departmentData = [
  { department: 'Engineering', employees: 92 },
  { department: 'Delivery', employees: 80 },
  { department: 'QA', employees: 36 },
  { department: 'Design', employees: 29 },
  { department: 'HR', employees: 24 },
  { department: 'Support', employees: 31 },
];

const allocationData = [
  { name: 'Fully Allocated', value: 96, color: 'var(--color-success)' },
  { name: 'Partially Allocated', value: 62, color: 'var(--color-primary)' },
  { name: 'Bench', value: 50, color: 'var(--color-text-muted)' },
  { name: 'Overallocated', value: 7, color: 'var(--color-error)' },
  { name: 'Releasing Soon', value: 23, color: 'var(--color-warning)' },
];

const joinersData = [
  { month: 'Jan', count: 2 },
  { month: 'Feb', count: 4 },
  { month: 'Mar', count: 7 },
  { month: 'Apr', count: 1 },
  { month: 'May', count: 6 },
  { month: 'Jun', count: 3 },
  { month: 'Jul', count: 5 },
  { month: 'Aug', count: 2 },
];

const releasesData = [
  { month: 'Aug', releases: 3 },
  { month: 'Sep', releases: 8 },
  { month: 'Oct', releases: 2 },
  { month: 'Nov', releases: 6 },
];

const overallocatedData = [
  { name: 'Neha', value: 130 },
  { name: 'Aditi', value: 115 },
  { name: 'Karan', value: 108 },
];

const upcomingReleases = [
  ['Aditi Mehra', 'NovaBank Customer Portal', 'Aug 15, 2025', 'Extend'],
  ['Priya Singh', 'HealthBridge Mobile', 'Aug 15, 2025', 'Release'],
  ['Amit Dubey', 'UrbanFleet Dashboard', 'Aug 20, 2025', 'Extend'],
  ['Karan Malhotra', 'Internal HR Automation', 'Aug 31, 2025', 'Review'],
];

const recentJoins = [
  ['Meera Nair', 'Engineering', 'React Developer', 'Jul 14, 2025'],
  ['Ravi Patel', 'QA', 'QA Engineer', 'Jun 28, 2025'],
  ['Ananya Iyer', 'Design', 'UX Designer', 'Jun 18, 2025'],
];

const benchAvailability = [
  ['Amit Dubey', 'Java, Spring', '68 days', 'High'],
  ['Saurabh Tiwari', 'Python, Django', '35 days', 'Medium'],
  ['Priya Singh', 'QA, Automation', 'Current', 'Partial'],
];

const toneClass: Record<string, string> = {
  blue: styles.blueTone,
  green: styles.greenTone,
  orange: styles.orangeTone,
  red: styles.redTone,
  slate: styles.slateTone,
};

const DonutChart = ({
  data,
  total,
  label,
}: {
  data: { name: string; value: number; color: string }[];
  total: string;
  label: string;
}) => {
  const sum = data.reduce((acc, item) => acc + item.value, 0);
  let cursor = 0;
  const stops = data
    .map((item) => {
      const start = cursor;
      const end = cursor + (item.value / sum) * 100;
      cursor = end;
      return `${item.color} ${start}% ${end}%`;
    })
    .join(', ');

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="center"
      spacing={2}
      className={styles.donutLayout}
    >
      <Box className={styles.donutChart} sx={{ background: `conic-gradient(${stops})` }}>
        <Box className={styles.donutHole}>
          <strong>{total}</strong>
          <span>{label}</span>
        </Box>
      </Box>
      <Stack spacing={0.75} className={styles.chartLegend}>
        {data.map((item) => (
          <span key={item.name}>
            <i style={{ backgroundColor: item.color }} />
            {item.name}
          </span>
        ))}
      </Stack>
    </Stack>
  );
};

const DepartmentBars = () => {
  const max = Math.max(...departmentData.map((item) => item.employees));
  return (
    <Stack spacing={1.15} className={styles.departmentBars}>
      {departmentData.map((item) => (
        <Box key={item.department} className={styles.departmentBarRow}>
          <Typography>{item.department}</Typography>
          <Box className={styles.departmentTrack}>
            <Box
              className={styles.departmentFill}
              sx={{ width: `${(item.employees / max) * 100}%` }}
            />
          </Box>
          <span>{item.employees}</span>
        </Box>
      ))}
    </Stack>
  );
};

const LineMiniChart = () => {
  const points = joinersData
    .map((item, index) => `${18 + index * 42},${134 - item.count * 14}`)
    .join(' ');

  return (
    <Box className={styles.svgChart} component="svg" viewBox="0 0 330 150" role="img">
      {[30, 60, 90, 120].map((y) => (
        <line key={y} x1="8" x2="322" y1={y} y2={y} className={styles.gridLine} />
      ))}
      <polyline points={points} className={styles.linePath} />
      {joinersData.map((item, index) => {
        const x = 18 + index * 42;
        const y = 134 - item.count * 14;
        return <circle key={item.month} cx={x} cy={y} r="3" className={styles.lineDot} />;
      })}
    </Box>
  );
};

const VerticalBars = ({
  data,
  color,
}: {
  data: { label: string; value: number }[];
  color: string;
}) => {
  const max = Math.max(...data.map((item) => item.value));
  return (
    <Stack
      direction="row"
      alignItems="flex-end"
      justifyContent="space-around"
      className={styles.verticalChart}
    >
      {data.map((item) => (
        <Box key={item.label} className={styles.verticalBarItem}>
          <Box
            className={styles.verticalBar}
            sx={{ height: `${(item.value / max) * 100}%`, backgroundColor: color }}
          />
          <Typography>{item.label}</Typography>
        </Box>
      ))}
    </Stack>
  );
};

const MiniTable = ({
  title,
  action,
  headers,
  rows,
}: {
  title: string;
  action?: string;
  headers: string[];
  rows: string[][];
}) => {
  const tableRows = rows.map((cells, index) => ({ id: `${title}-${index}`, cells }));
  const columns: TableColumn<{ id: string; cells: string[] }>[] = headers.map((header, index) => ({
    id: `${header}-${index}`,
    label: header,
    renderCell: (row) => {
      const cell = row.cells[index];

      if (index === 0) {
        return (
          <Stack direction="row" spacing={0.5} alignItems="center">
            <Avatar className={styles.rowAvatar}>{cell.charAt(0)}</Avatar>
            <Typography className={styles.rowName}>{cell}</Typography>
          </Stack>
        );
      }

      if (index === row.cells.length - 1) {
        return (
          <Chip
            label={cell}
            size="small"
            className={cell === 'Release' || cell === 'High' ? styles.warnChip : styles.infoChip}
          />
        );
      }

      return cell;
    },
  }));

  return (
    <ReusableTable
      rows={tableRows}
      columns={columns}
      getRowId={(row) => row.id}
      toolbar={
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          className={styles.cardHeader}
        >
          <Typography className={styles.cardTitle}>{title}</Typography>
          {action && (
            <Button variant="text" className={styles.cardAction}>
              {action}
            </Button>
          )}
        </Stack>
      }
    />
  );
};

export const DashboardPage = () => {
  const { loading, error, refresh } = useDashboardData();

  if (loading) {
    return (
      <Box className={styles.page}>
        <Box className={styles.loadingState}>
          <div className={styles.spinner} />
          <Typography variant="body2" color="textSecondary">
            Loading dashboard...
          </Typography>
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box className={styles.page}>
        <Paper elevation={0} className={styles.errorState}>
          <Typography variant="h6" color="error">
            {error}
          </Typography>
          <Button variant="contained" onClick={refresh}>
            Retry
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box className={styles.page}>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'stretch', md: 'flex-start' }}
        spacing={2}
        className={styles.header}
      >
        <Box>
          <Typography variant="h4" className={styles.title}>
            Dashboard
          </Typography>
          <Typography variant="body2" className={styles.subtitle}>
            Organization overview - July 2025
          </Typography>
        </Box>
        <Stack direction="row" spacing={1} justifyContent="flex-end" flexWrap="wrap">
          <FormControl size="small" className={styles.filterSelect}>
            <Select value="All departments">
              <MenuItem value="All departments">All departments</MenuItem>
            </Select>
          </FormControl>
          <Button variant="outlined" startIcon={<DownloadIcon />} className={styles.outlineButton}>
            Export report
          </Button>
          <Button variant="contained" startIcon={<AddIcon />} className={styles.primaryButton}>
            Add widget
          </Button>
        </Stack>
      </Stack>

      <Box className={styles.kpiGrid}>
        {kpis.map((kpi) => (
          <Paper elevation={0} key={kpi.label} className={styles.kpiCard}>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
              <Avatar className={`${styles.kpiIcon} ${toneClass[kpi.tone]}`}>{kpi.icon}</Avatar>
              <Chip
                icon={<TrendingUpIcon />}
                label={kpi.delta}
                size="small"
                className={toneClass[kpi.tone]}
              />
            </Stack>
            <Typography className={styles.kpiValue}>{kpi.value}</Typography>
            <Typography className={styles.kpiLabel}>{kpi.label}</Typography>
          </Paper>
        ))}
      </Box>

      <Box className={styles.chartGrid}>
        <Paper elevation={0} className={styles.chartCard}>
          <Typography className={styles.cardTitle}>Billable vs Non-Billable</Typography>
          <Box className={styles.chartBox}>
            <DonutChart data={billableData} total="247" label="Total" />
          </Box>
        </Paper>

        <Paper elevation={0} className={styles.chartCard}>
          <Typography className={styles.cardTitle}>Employees by Department</Typography>
          <Box className={styles.chartBox}>
            <DepartmentBars />
          </Box>
        </Paper>

        <Paper elevation={0} className={styles.chartCard}>
          <Typography className={styles.cardTitle}>Allocation Distribution</Typography>
          <Box className={styles.chartBox}>
            <DonutChart data={allocationData} total="188" label="Allocated" />
          </Box>
        </Paper>

        <Paper elevation={0} className={styles.chartCard}>
          <Typography className={styles.cardTitle}>Monthly Joiners - 2025</Typography>
          <Box className={styles.chartBoxSmall}>
            <LineMiniChart />
          </Box>
        </Paper>

        <Paper elevation={0} className={styles.chartCard}>
          <Typography className={styles.cardTitle}>Upcoming Releases by Month</Typography>
          <Box className={styles.chartBoxSmall}>
            <VerticalBars
              color="var(--color-warning-light)"
              data={releasesData.map((item) => ({ label: item.month, value: item.releases }))}
            />
          </Box>
        </Paper>

        <Paper elevation={0} className={styles.chartCard}>
          <Typography className={styles.cardTitle}>Overallocated Employees</Typography>
          <Box className={styles.chartBoxSmall}>
            <VerticalBars
              color="var(--color-text-muted)"
              data={overallocatedData.map((item) => ({ label: item.name, value: item.value }))}
            />
          </Box>
        </Paper>
      </Box>

      <Box className={styles.tableGrid}>
        <MiniTable
          title="Upcoming Releases"
          action="View all"
          headers={['Employee' , 'Project', 'Release Date', 'Action']}
          rows={upcomingReleases}
        />
        <MiniTable
          title="Recent Joins"
          action="View all"
          headers={['Employee', 'Department', 'Designation', 'Joined']}
          rows={recentJoins}
        />
        <MiniTable
          title="Bench Availability"
          action="View all"
          headers={['Employee', 'Skills', 'Bench Days', 'Risk']}
          rows={benchAvailability}
        />
        <Paper elevation={0} className={styles.tableCard}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            className={styles.cardHeader}
          >
            <Typography className={styles.cardTitle}>Project Health</Typography>
            <Button variant="text" className={styles.cardAction}>
              View all
            </Button>
          </Stack>
          <div className={styles.healthTable}>
            {[
              ['NovaBank Portal', 88, 'On Track'],
              ['HealthBridge Mobile', 62, 'At Risk'],
              ['Internal HR', 76, 'Monitor'],
            ].map(([name, value, status]) => (
              <Box key={name} className={styles.healthRow}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography>{name}</Typography>
                  <Chip
                    label={status}
                    size="small"
                    className={status === 'At Risk' ? styles.warnChip : styles.infoChip}
                  />
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={Number(value)}
                  className={styles.healthProgress}
                />
              </Box>
            ))}
          </div>
        </Paper>
      </Box>
    </Box>
  );
};

export default DashboardPage;

