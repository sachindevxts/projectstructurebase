import React, { useCallback, useState } from 'react';
import { Box, Button, Paper } from '@mui/material';
import { Add as AddIcon, Download as DownloadIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAllocations } from '../../hooks/useAllocations';
import { PfPageHeader } from '@/features/Shared';
import styles from './AllocationsPage.module.scss';
import { AllocationFilters } from '../AllocationFilters/AllocationFilters';
import { AllocationStats } from '../AllocationStats/AllocationStats';
import { AllocationTable } from '../AllocationTable/AllocationTable';

export const AllocationsPage = () => {
  const navigate = useNavigate();
  const { allocations, loading, stats } = useAllocations();
  const [search, setSearch] = useState('');

  const filteredAllocations = allocations.filter(
    (a) =>
      a.employee.toLowerCase().includes(search.toLowerCase()) ||
      a.project.toLowerCase().includes(search.toLowerCase()),
  );

  const handleAddAllocation = useCallback(() => {
    navigate('/allocations/new');
  }, [navigate]);

  return (
    <Box className={styles.page}>
      <PfPageHeader
        title="Resource Allocations"
        subtitle="Manage all active and planned employee project assignments"
      >
        <Button variant="outlined" startIcon={<DownloadIcon />}>
          Export
        </Button>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddAllocation}>
          Add Allocation
        </Button>
      </PfPageHeader>

      <AllocationStats stats={stats} />

      <Paper elevation={0} className={styles.filtersWrapper}>
        <AllocationFilters
          search={search}
          onSearchChange={setSearch}
          resultCount={filteredAllocations.length}
        />
      </Paper>

      <AllocationTable allocations={filteredAllocations} loading={loading} />
    </Box>
  );
};

export default AllocationsPage;

