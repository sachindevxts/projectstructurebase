import React, { useCallback } from 'react';
import { Box, Button, Paper, Stack, Typography } from '@mui/material';
import {
  Add as AddIcon,
  Download as DownloadIcon,
  MoreHoriz as MoreHorizIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useEmployees } from '../../Hooks/useEmployees';
import { useEmployeeFilters } from '../../Hooks/useEmployeeFilters';
import { EmployeeFilters } from '../EmployeeFilters/EmployeeFilters';
import { EmployeeTable } from '../EmployeeTable/EmployeeTable';
import { employeeService } from '../../Services/employeeService';
import type { Employee } from '../../Types/employee.types';
import { useAppSelector } from '@/hooks';
import { hasPermission } from '@/utils/permission.utils';
import styles from './EmployeesPage.module.scss';

export const EmployeesPage = () => {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);
  const canCreateEmployee = hasPermission(user, ['employees:create']);
  const canUpdateEmployee = hasPermission(user, ['employees:update']);
  const canDeleteEmployee = hasPermission(user, ['employees:delete']);
  const canExportEmployees = hasPermission(user, ['employees:export']);
  const {
    loading,
    stats,
    selectedRows,
    deleteEmployee,
    toggleSelection,
    toggleAllSelection,
  } = useEmployees();

  const { filters, filteredEmployees, updateFilter, resetFilters } = useEmployeeFilters();

  const handleExportCsv = useCallback(() => {
    const csv = employeeService.exportToCsv(filteredEmployees);
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'employees.csv';
    link.click();
    URL.revokeObjectURL(url);
  }, [filteredEmployees]);

  const handleAddEmployee = useCallback(() => {
    navigate('/employees/new');
  }, [navigate]);

  const handleViewEmployee = useCallback(
    (employee: Employee) => {
      navigate(`/employees/${employee.id}`);
    },
    [navigate],
  );

  const handleEditEmployee = useCallback(
    (employee: Employee) => {
      navigate(`/employees/${employee.id}/edit`);
    },
    [navigate],
  );

  const handleDeleteEmployee = useCallback(
    async (id: string) => {
      if (window.confirm('Are you sure you want to delete this employee?')) {
        await deleteEmployee(id);
      }
    },
    [deleteEmployee],
  );

  return (
    <Box className={styles.page}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'stretch', sm: 'flex-start' }}
        spacing={2}
        className={styles.header}
      >
        <Box>
          <Typography variant="h4" className={styles.title}>
            Employees
          </Typography>
          <Typography variant="body2" className={styles.subtitle}>
            {stats.total} employees &middot; {stats.active} active
          </Typography>
        </Box>

        <Stack direction="row" spacing={1} className={styles.actions}>
          {canExportEmployees && (
            <Button variant="outlined" startIcon={<DownloadIcon />} onClick={handleExportCsv}>
              Export
            </Button>
          )}
          {(canUpdateEmployee || canDeleteEmployee) && (
            <Button variant="outlined" startIcon={<MoreHorizIcon />}>
              Bulk Actions
            </Button>
          )}
          {canCreateEmployee && (
            <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddEmployee}>
              Add Employee
            </Button>
          )}
        </Stack>
      </Stack>

      <Paper elevation={0} className={styles.filtersWrapper}>
        <EmployeeFilters
          filters={filters}
          onFilterChange={updateFilter}
          onReset={resetFilters}
          resultCount={filteredEmployees.length}
        />
      </Paper>

      <EmployeeTable
        employees={filteredEmployees}
        selectedRows={selectedRows}
        loading={loading}
        onToggleSelection={toggleSelection}
        onToggleAll={toggleAllSelection}
        onView={handleViewEmployee}
        onEdit={canUpdateEmployee ? handleEditEmployee : undefined}
        onDelete={canDeleteEmployee ? handleDeleteEmployee : undefined}
      />
    </Box>
  );
};

export default EmployeesPage;

