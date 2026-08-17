import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  IconButton,
  Paper,
  Skeleton,
  Stack,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import {
  AccountTree as AllocationIcon,
  Business as BusinessIcon,
  Email as EmailIcon,
  Edit as EditIcon,
  LinkedIn as LinkedInIcon,
  LocationOn as LocationOnIcon,
  MoreVert as MoreVertIcon,
  People as PeopleIcon,
  Phone as PhoneIcon,
  Work as WorkIcon,
} from '@mui/icons-material';
import { employeeService } from '../../Services/employeeService';
import type { Employee } from '../../Types/employee.types';
import { ReusableTable, type TableColumn } from '@/components/common';
import { useAppSelector } from '@/hooks';
import { hasPermission } from '@/utils/permission.utils';
import styles from './EmployeeDetail.module.scss';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const tabs = [
  'Overview',
  'Employment',
  'Skills',
  'Current Projects',
  'Allocation History',
  'Documents',
  'Audit History',
];

interface CurrentProjectRow {
  project: string;
  client: string;
  role: string;
  allocation: string;
  billability: 'Billable' | 'Non-Billable';
  start: string;
  end: string;
  status: string;
}

interface AllocationHistoryRow {
  project: string;
  role: string;
  allocation: string;
  start: string;
  end: string;
  releaseReason: string;
  changedBy: string;
}

interface AuditHistoryRow {
  dateTime: string;
  action: 'Updated' | 'Created';
  field: string;
  oldValue: string;
  newValue: string;
  changedBy: string;
}

const currentProjectRows: CurrentProjectRow[] = [
  {
    project: 'NovaBank Customer Portal',
    client: 'NovaBank',
    role: 'Senior Developer',
    allocation: '70%',
    billability: 'Billable',
    start: 'May 1, 2025',
    end: 'Aug 15, 2025',
    status: 'Active',
  },
  {
    project: 'Internal HR Automation',
    client: 'Internal',
    role: 'Tech Lead',
    allocation: '30%',
    billability: 'Non-Billable',
    start: 'Jan 1, 2025',
    end: 'Dec 31, 2025',
    status: 'Active',
  },
];

const allocationHistoryRows: AllocationHistoryRow[] = [
  {
    project: 'BrightRetail Commerce',
    role: 'Frontend Dev',
    allocation: '80%',
    start: 'Jan 1, 2024',
    end: 'Apr 30, 2025',
    releaseReason: 'Project Completed',
    changedBy: 'Arjun Kapoor',
  },
  {
    project: 'UrbanFleet Dashboard',
    role: 'React Developer',
    allocation: '100%',
    start: 'Mar 1, 2022',
    end: 'Dec 31, 2023',
    releaseReason: 'Contract End',
    changedBy: 'Arjun Kapoor',
  },
];

const auditHistoryRows: AuditHistoryRow[] = [
  {
    dateTime: 'Jul 10, 2025 - 14:32',
    action: 'Updated',
    field: 'Designation',
    oldValue: 'React Developer',
    newValue: 'Senior React Developer',
    changedBy: 'Arjun Kapoor',
  },
  {
    dateTime: 'Jan 12, 2022 - 09:00',
    action: 'Created',
    field: 'Employee Record',
    oldValue: '-',
    newValue: 'Employee Added',
    changedBy: 'HR System',
  },
];

const TabPanel = ({ children, value, index }: TabPanelProps) => (
  <Box role="tabpanel" hidden={value !== index}>
    {value === index && <Box className={styles.panel}>{children}</Box>}
  </Box>
);

const DetailPair = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <Box className={styles.detailPair}>
    <Typography variant="body2" className={styles.detailLabel}>
      {label}
    </Typography>
    <Typography variant="body2" className={styles.detailValue}>
      {value}
    </Typography>
  </Box>
);

const AllocationItem = ({
  title,
  meta,
  date,
  value,
  billable = true,
}: {
  title: string;
  meta: string;
  date: string;
  value: number;
  billable?: boolean;
}) => (
  <Paper elevation={0} className={styles.allocationCard}>
    <Box>
      <Typography className={styles.allocationTitle}>{title}</Typography>
      <Stack
        direction="row"
        spacing={0.75}
        alignItems="center"
        flexWrap="wrap"
        className={styles.allocationMeta}
      >
        <Typography variant="body2">{meta}</Typography>
        <Chip
          label={billable ? 'Billable' : 'Non-Billable'}
          size="small"
          className={billable ? styles.billableChip : styles.nonBillableChip}
        />
      </Stack>
      <Typography variant="body2" className={styles.allocationDate}>
        {date}
      </Typography>
    </Box>
    <Box className={styles.allocationValue}>
      <Typography>{value}%</Typography>
      <span>Allocation</span>
    </Box>
  </Paper>
);

export const EmployeeDetail = () => {
  const { employeeId } = useParams<{ employeeId: string }>();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);
  const canUpdateEmployee = hasPermission(user, ['employees:update']);
  const canCreateAllocation = hasPermission(user, ['allocations:create']);
  const canCreateSkill = hasPermission(user, ['skills:create']);
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const currentProjectColumns: TableColumn<CurrentProjectRow>[] = [
    { id: 'project', label: 'Project', field: 'project' },
    { id: 'client', label: 'Client', field: 'client' },
    { id: 'role', label: 'Role', field: 'role' },
    { id: 'allocation', label: 'Allocation', field: 'allocation' },
    {
      id: 'billability',
      label: 'Billability',
      renderCell: (row) => (
        <Chip
          label={row.billability}
          className={row.billability === 'Billable' ? styles.billableChip : styles.nonBillableChip}
        />
      ),
    },
    { id: 'start', label: 'Start', field: 'start' },
    {
      id: 'end',
      label: 'End',
      renderCell: (row) => <Typography className={styles.releaseDate}>{row.end}</Typography>,
    },
    {
      id: 'status',
      label: 'Status',
      renderCell: (row) => <Chip label={row.status} className={styles.activeChip} />,
    },
  ];
  const allocationHistoryColumns: TableColumn<AllocationHistoryRow>[] = [
    { id: 'project', label: 'Project', field: 'project' },
    { id: 'role', label: 'Role', field: 'role' },
    { id: 'allocation', label: 'Allocation', field: 'allocation' },
    { id: 'start', label: 'Start', field: 'start' },
    { id: 'end', label: 'End', field: 'end' },
    { id: 'releaseReason', label: 'Release Reason', field: 'releaseReason' },
    { id: 'changedBy', label: 'Changed By', field: 'changedBy' },
  ];
  const auditHistoryColumns: TableColumn<AuditHistoryRow>[] = [
    { id: 'dateTime', label: 'Date & Time', field: 'dateTime' },
    {
      id: 'action',
      label: 'Action',
      renderCell: (row) => (
        <Chip
          label={row.action}
          className={row.action === 'Updated' ? styles.blueSkill : styles.greenSkill}
        />
      ),
    },
    { id: 'field', label: 'Field', field: 'field' },
    { id: 'oldValue', label: 'Old Value', field: 'oldValue' },
    {
      id: 'newValue',
      label: 'New Value',
      renderCell: (row) => <Typography className={styles.greenText}>{row.newValue}</Typography>,
    },
    { id: 'changedBy', label: 'Changed By', field: 'changedBy' },
  ];

  useEffect(() => {
    const loadEmployee = async () => {
      try {
        setLoading(true);
        const data = await employeeService.getEmployeeById(employeeId || '');
        setEmployee(data || null);
      } finally {
        setLoading(false);
      }
    };

    loadEmployee();
  }, [employeeId]);

  if (loading) {
    return (
      <Box className={styles.page}>
        <Skeleton variant="rectangular" height={148} className={styles.skeleton} />
        <Skeleton variant="rectangular" height={48} className={styles.skeleton} />
        <Grid container spacing={2.5}>
          <Grid item xs={12} md={8}>
            <Skeleton variant="rectangular" height={390} className={styles.skeleton} />
          </Grid>
          <Grid item xs={12} md={4}>
            <Skeleton variant="rectangular" height={390} className={styles.skeleton} />
          </Grid>
        </Grid>
      </Box>
    );
  }

  if (!employee) {
    return (
      <Box className={styles.page}>
        <Paper elevation={0} className={styles.notFound}>
          <Typography variant="h5">Employee Not Found</Typography>
          <Button variant="contained" onClick={() => navigate('/employees')}>
            Back to Employees
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box className={styles.page}>
      <Box className={styles.profileHeader}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'stretch', md: 'flex-start' }}
          spacing={2}
        >
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2.5}
            alignItems={{ xs: 'flex-start', sm: 'center' }}
          >
            <Box className={styles.avatarWrap}>
              <Avatar className={styles.avatar}>{employee.name.charAt(0)}</Avatar>
              <span />
            </Box>
            <Box className={styles.profileInfo}>
              <Stack direction="row" spacing={1.25} alignItems="center" flexWrap="wrap">
                <Typography variant="h4" className={styles.employeeName}>
                  {employee.name}
                </Typography>
                <Chip label={employee.status} size="small" className={styles.activeChip} />
                <Chip label={employee.billability} size="small" className={styles.billableChip} />
                <Typography variant="body2" className={styles.employeeId}>
                  {employee.id}
                </Typography>
              </Stack>
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                flexWrap="wrap"
                className={styles.metaLine}
              >
                <span>
                  <WorkIcon fontSize="small" /> Senior React Developer
                </span>
                <span>
                  <PeopleIcon fontSize="small" /> {employee.department}
                </span>
                <span>
                  <LocationOnIcon fontSize="small" /> Bangalore, India
                </span>
                <span>
                  <EmailIcon fontSize="small" /> {employee.email}
                </span>
              </Stack>
              <Stack
                direction="row"
                spacing={1.5}
                alignItems="center"
                className={styles.allocationLine}
              >
                <Typography>Allocation: 100%</Typography>
                <Box className={styles.allocationBar}>
                  <Box className={styles.primaryBar} />
                  <Box className={styles.secondaryBar} />
                </Box>
                <span>
                  <i className={styles.primaryDot} />
                  NovaBank 70%
                </span>
                <span>
                  <i className={styles.secondaryDot} />
                  Internal 30%
                </span>
              </Stack>
            </Box>
          </Stack>

          <Stack direction="row" spacing={1} justifyContent="flex-end">
            <Button
              variant="outlined"
              startIcon={<AllocationIcon />}
              className={styles.outlineButton}
            >
              Allocations
            </Button>
            {canUpdateEmployee && (
              <Button variant="contained" startIcon={<EditIcon />} className={styles.editButton}>
                Edit
              </Button>
            )}
            <IconButton className={styles.moreButton}>
              <MoreVertIcon />
            </IconButton>
          </Stack>
        </Stack>
      </Box>

      <Box className={styles.tabsWrap}>
        <Tabs value={tabValue} onChange={(_, value) => setTabValue(value)} className={styles.tabs}>
          {tabs.map((tab) => (
            <Tab key={tab} label={tab} />
          ))}
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={2.5}>
          <Grid item xs={12} lg={8}>
            <Card elevation={0} className={styles.card}>
              <CardContent>
                <Typography variant="h6" className={styles.cardTitle}>
                  Employment Summary
                </Typography>
                <Box className={styles.summaryGrid}>
                  <DetailPair label="Employee ID" value="EMP-001" />
                  <DetailPair label="Department" value="Engineering" />
                  <DetailPair
                    label="Designation"
                    value={
                      <>
                        Senior React
                        <br />
                        Developer
                      </>
                    }
                  />
                  <DetailPair
                    label="Reporting Manager"
                    value={<Button variant="text">Arjun Kapoor</Button>}
                  />
                  <DetailPair label="Employment Type" value="Full-Time" />
                  <DetailPair label="Work Mode" value="Hybrid" />
                  <DetailPair label="Joining Date" value="Jan 12, 2022" />
                  <DetailPair label="Experience" value="5 years 2 months" />
                </Box>
              </CardContent>
            </Card>

            <Card elevation={0} className={styles.card}>
              <CardContent>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  className={styles.cardHeader}
                >
                  <Typography variant="h6" className={styles.cardTitle}>
                    Current Allocation
                  </Typography>
                  {canCreateAllocation && (
                    <Button variant="text" className={styles.addButton}>
                      + Add Allocation
                    </Button>
                  )}
                </Stack>
                <Stack spacing={1.5}>
                  <AllocationItem
                    title="NovaBank Customer Portal"
                    meta="NovaBank - Senior Developer -"
                    date="May 1 - Aug 15, 2025"
                    value={70}
                  />
                  <AllocationItem
                    title="Internal HR Automation"
                    meta="Internal - Tech Lead -"
                    date="Jan 1 - Dec 31, 2025"
                    value={30}
                    billable={false}
                  />
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} lg={4}>
            <Stack spacing={2.5}>
              <Card elevation={0} className={styles.sideCard}>
                <CardContent>
                  <Typography variant="h6" className={styles.cardTitle}>
                    Capacity
                  </Typography>
                  <Box className={styles.capacityRing}>
                    <Typography>100%</Typography>
                    <span>Allocated</span>
                  </Box>
                  <Typography className={styles.capacityText}>0% available capacity</Typography>
                </CardContent>
              </Card>

              <Card elevation={0} className={styles.sideCard}>
                <CardContent>
                  <Typography variant="h6" className={styles.cardTitle}>
                    Important Dates
                  </Typography>
                  <DetailPair label="Joined" value="Jan 12, 2022" />
                  <DetailPair label="Probation End" value="Jul 12, 2022" />
                  <DetailPair
                    label="Next Release"
                    value={<span className={styles.releaseDate}>Aug 15, 2025</span>}
                  />
                </CardContent>
              </Card>

              <Card elevation={0} className={styles.sideCard}>
                <CardContent>
                  <Typography variant="h6" className={styles.cardTitle}>
                    Contact
                  </Typography>
                  <Stack spacing={1.25} className={styles.contactList}>
                    <span>
                      <EmailIcon fontSize="small" /> {employee.email}
                    </span>
                    <span>
                      <PhoneIcon fontSize="small" /> +91 98765 43210
                    </span>
                    <span>
                      <LinkedInIcon fontSize="small" /> linkedin.com/in/aditi
                    </span>
                  </Stack>
                </CardContent>
              </Card>
            </Stack>
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Card elevation={0} className={styles.cardNarrow}>
          <CardContent>
            <Typography variant="h6" className={styles.cardTitle}>
              Employment Details
            </Typography>
            <DetailPair label="Department" value="Engineering" />
            <DetailPair label="Designation" value="Senior React Developer" />
            <DetailPair
              label="Reporting Manager"
              value={<Button variant="text">Arjun Kapoor</Button>}
            />
            <DetailPair label="Employment Type" value="Full-Time" />
            <DetailPair label="Work Mode" value="Hybrid" />
            <DetailPair label="Joining Date" value="Jan 12, 2022" />
            <DetailPair label="Probation End" value="Jul 12, 2022" />
            <DetailPair label="Notice Period" value="60 days" />
          </CardContent>
        </Card>
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <Card elevation={0} className={styles.cardNarrow}>
          <CardContent>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              className={styles.cardHeader}
            >
              <Typography variant="h6" className={styles.cardTitle}>
                Skills & Expertise
              </Typography>
              {canCreateSkill && (
                <Button variant="text" className={styles.addButton}>
                  + Add Skill
                </Button>
              )}
            </Stack>
            <Typography className={styles.skillLabel}>PRIMARY SKILL</Typography>
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              flexWrap="wrap"
              className={styles.skillRow}
            >
              <Chip label="React.js" className={styles.blueSkill} />
              <Chip label="Advanced" className={styles.blueSkill} />
              <Typography variant="body2" className={styles.muted}>
                4 years exp.
              </Typography>
              <Chip label="Verified" className={styles.greenSkill} />
            </Stack>
            <Typography className={styles.skillLabel}>SECONDARY SKILLS</Typography>
            {[
              ['TypeScript', 'Advanced', '3 yrs'],
              ['Redux', 'Intermediate', '2 yrs'],
              ['Tailwind CSS', 'Advanced', '2 yrs'],
              ['Node.js', 'Intermediate', '1 yr'],
            ].map(([skill, level, years]) => (
              <Stack
                key={skill}
                direction="row"
                spacing={1}
                alignItems="center"
                flexWrap="wrap"
                className={styles.skillRow}
              >
                <Chip label={skill} className={styles.greenSkill} />
                <Chip
                  label={level}
                  className={level === 'Advanced' ? styles.blueSkill : styles.orangeSkill}
                />
                <Typography variant="body2" className={styles.muted}>
                  {years}
                </Typography>
              </Stack>
            ))}
          </CardContent>
        </Card>
      </TabPanel>

      <TabPanel value={tabValue} index={3}>
        <ReusableTable
          rows={currentProjectRows}
          columns={currentProjectColumns}
          getRowId={(row) => row.project}
        />
      </TabPanel>

      <TabPanel value={tabValue} index={4}>
        <ReusableTable
          rows={allocationHistoryRows}
          columns={allocationHistoryColumns}
          getRowId={(row) => row.project}
        />
      </TabPanel>

      <TabPanel value={tabValue} index={5}>
        <Card elevation={0} className={styles.cardNarrow}>
          <CardContent>
            <Typography variant="h6" className={styles.cardTitle}>
              Documents
            </Typography>
            <Paper elevation={0} className={styles.documentRow}>
              <Typography>Resume_AditiMehra.pdf</Typography>
              <Button variant="text">Download</Button>
            </Paper>
            <Paper elevation={0} className={styles.documentRow}>
              <Typography>Offer_Letter.docx</Typography>
              <Button variant="text">Download</Button>
            </Paper>
          </CardContent>
        </Card>
      </TabPanel>

      <TabPanel value={tabValue} index={6}>
        <ReusableTable
          rows={auditHistoryRows}
          columns={auditHistoryColumns}
          getRowId={(row) => `${row.dateTime}-${row.field}`}
        />
      </TabPanel>
    </Box>
  );
};

export default EmployeeDetail;
