import React, { useCallback } from 'react';
import { Box, Button, Paper } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { PfPageHeader } from '@/Features/Shared/Components/PfPageHeader/PfPageHeader';
import { useDesignations } from '../../hooks/useDesignations';
import { useDesignationFilters } from '../../hooks/useDesignationFilters';
import { DesignationFilters } from '../DesignationFilters/DesignationFilters';
import { DesignationStats } from '../DesignationStats/DesignationStats';
import { DesignationTable } from '../DesignationTable/DesignationTable';
import styles from './DesignationsPage.module.scss';

export const DesignationsPage = () => {
  const { loading, stats, deleteDesignation } = useDesignations();
  const { filters, filteredDesignations, updateFilter, resetFilters } = useDesignationFilters();

  const handleDelete = useCallback(
    async (id: string) => {
      if (window.confirm('Are you sure you want to delete this designation?')) {
        await deleteDesignation(id);
      }
    },
    [deleteDesignation],
  );

  return (
    <Box className={styles.page}>
      <PfPageHeader title="Designations" subtitle="Manage job titles and seniority levels across the organization.">
        <Button variant="contained" startIcon={<AddIcon />}>
          Add Designation
        </Button>
      </PfPageHeader>

      <DesignationStats stats={stats} />

      <Paper elevation={0} className={styles.filtersWrapper}>
        <DesignationFilters filters={filters} onFilterChange={updateFilter} onReset={resetFilters} resultCount={filteredDesignations.length} />
      </Paper>

      <DesignationTable designations={filteredDesignations} loading={loading} onDelete={handleDelete} />
    </Box>
  );
};

export default DesignationsPage;
