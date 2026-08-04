import React, { useState, useMemo } from 'react';
import { Box, Button, Paper, Grid, Card, CardContent, Typography, Chip, IconButton, Tooltip } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Visibility as ViewIcon } from '@mui/icons-material';
import { PfPageHeader } from '@/Features/Shared/Components/PfPageHeader/PfPageHeader';
import { CapacityBar } from '@/Features/Shared/Components/CapacityBar/CapacityBar';
import styles from './DepartmentsPage.module.scss';
import { DepartmentStats } from '../DepartmentStats/DepartmentStats';
import { useDepartments } from '../../hooks/useDepartments';

export const DepartmentsPage = () => {
  const { departments, loading, stats } = useDepartments();
  const [search, setSearch] = useState('');

  const filteredDepartments = useMemo(() => {
    if (!search) return departments;
    const searchLower = search.toLowerCase();
    return departments.filter((d : any) =>
      d.name.toLowerCase().includes(searchLower) ||
      d.head.toLowerCase().includes(searchLower)
    );
  }, [departments, search]);

  return (
    <Box className={styles.page}>
      <PfPageHeader
        title="Departments"
        subtitle="Organize your workforce structure and manage department heads."
      >
        <Button variant="contained" startIcon={<AddIcon />}>
          Add Department
        </Button>
      </PfPageHeader>

      <DepartmentStats stats={stats} />

      <Paper className={styles.filtersWrapper}>
        <input
          placeholder="Search departments..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.searchInput}
        />
        <span className={styles.resultCount}>{filteredDepartments.length} departments</span>
      </Paper>

      <Grid container spacing={3}>
        {filteredDepartments.map((department : any) => (
          <Grid item xs={12} md={6} lg={4} key={department.id}>
            <Card className={styles.departmentCard}>
              <CardContent>
                <Box className={styles.cardHeader}>
                  <Box>
                    <Typography variant="h6" fontWeight={600}>
                      {department.name}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      Head: {department.head}
                    </Typography>
                  </Box>
                  <Box className={styles.cardActions}>
                    <Tooltip title="View">
                      <IconButton size="small">
                        <ViewIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit">
                      <IconButton size="small">
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton size="small" color="error">
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>

                <Box className={styles.metrics}>
                  <Box className={styles.metric}>
                    <Typography variant="h6" fontWeight={700}>
                      {department.employees}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      Employees
                    </Typography>
                  </Box>
                  <Box className={styles.metric}>
                    <Typography variant="h6" fontWeight={700}>
                      {department.billability}%
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      Billable
                    </Typography>
                  </Box>
                  <Box className={styles.metric}>
                    <Typography variant="h6" fontWeight={700}>
                      {department.bench}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      On Bench
                    </Typography>
                  </Box>
                </Box>

                <Box className={styles.billabilitySection}>
                  <Typography variant="caption" color="textSecondary">
                    Billability
                  </Typography>
                  <CapacityBar value={department.billability} />
                </Box>

                <Box className={styles.skillsSection}>
                  <Typography variant="caption" color="textSecondary">
                    Top Skills:
                  </Typography>
                  <Box className={styles.skills}>
                    {department.skills.slice(0, 3).map((skill : string) => (
                      <Chip key={skill} label={skill} size="small" variant="outlined" />
                    ))}
                    {department.skills.length > 3 && (
                      <Chip label={`+${department.skills.length - 3}`} size="small" />
                    )}
                  </Box>
                </Box>

                <Box className={styles.cardFooter}>
                  <Chip
                    label={department.status}
                    size="small"
                    color={department.status === 'Active' ? 'success' : 'default'}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default DepartmentsPage;