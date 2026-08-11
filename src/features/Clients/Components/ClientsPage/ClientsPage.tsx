import React, { useCallback } from 'react';
import { Box, Button, Paper } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { PfPageHeader } from '@/features/Shared/Components/PfPageHeader/PfPageHeader';
import { useClients } from '../../hooks/useClients';
import { ClientFilters } from '../ClientFilters/ClientFilters';
import { ClientStats } from '../ClientStats/ClientStats';
import { ClientTable } from '../ClientTable/ClientTable';
import styles from './ClientsPage.module.scss';

export const ClientsPage = () => {
  const { filteredClients, filters, loading, stats, updateFilter, resetFilters, deleteClient } =
    useClients();

  const handleDelete = useCallback(
    async (id: string) => {
      if (window.confirm('Are you sure you want to delete this client?')) {
        await deleteClient(id);
      }
    },
    [deleteClient],
  );

  return (
    <Box className={styles.page}>
      <PfPageHeader
        title="Clients"
        subtitle="Manage account health, ownership, projects, and delivery footprint."
      >
        <Button variant="contained" startIcon={<AddIcon />}>
          Add Client
        </Button>
      </PfPageHeader>
      <ClientStats stats={stats} />
      <Paper elevation={0} className={styles.filtersWrapper}>
        <ClientFilters
          filters={filters}
          onFilterChange={updateFilter}
          onReset={resetFilters}
          resultCount={filteredClients.length}
        />
      </Paper>
      <ClientTable clients={filteredClients} loading={loading} onDelete={handleDelete} />
    </Box>
  );
};

export default ClientsPage;
