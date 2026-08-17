import React, { useCallback, useState } from 'react';
import { Box, Button, Chip, Paper, Stack, Typography } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import Modal from '@/components/common/Modal/Modal';
import { PfPageHeader } from '@/features/Shared/Components/PfPageHeader/PfPageHeader';
import { useClients } from '../../hooks/useClients';
import type { Client } from '../../types/client.types';
import { ClientFilters } from '../ClientFilters/ClientFilters';
import { ClientForm } from '../ClientForm/ClientForm';
import { ClientStats } from '../ClientStats/ClientStats';
import { ClientTable } from '../ClientTable/ClientTable';
import { useAppSelector } from '@/hooks';
import { hasPermission } from '@/utils/permission.utils';
import styles from './ClientsPage.module.scss';

export const ClientsPage = () => {
  const user = useAppSelector((state) => state.auth.user);
  const canCreateClient = hasPermission(user, ['clients:create']);
  const canUpdateClient = hasPermission(user, ['clients:update']);
  const canDeleteClient = hasPermission(user, ['clients:delete']);
  const {
    filteredClients,
    filters,
    loading,
    stats,
    updateFilter,
    resetFilters,
    createClient,
    updateClient,
    deleteClient,
  } = useClients();
  const [dialogMode, setDialogMode] = useState<'add' | 'edit' | 'view' | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const closeDialog = useCallback(() => {
    if (submitting) return;
    setDialogMode(null);
    setSelectedClient(null);
  }, [submitting]);

  const handleAdd = useCallback(() => {
    setSelectedClient(null);
    setDialogMode('add');
  }, []);

  const handleView = useCallback((client: Client) => {
    setSelectedClient(client);
    setDialogMode('view');
  }, []);

  const handleEdit = useCallback((client: Client) => {
    setSelectedClient(client);
    setDialogMode('edit');
  }, []);

  const handleSave = useCallback(
    async (client: Omit<Client, 'id'>) => {
      setSubmitting(true);
      try {
        if (selectedClient) {
          await updateClient(selectedClient.id, client);
        } else {
          await createClient(client);
        }
        setDialogMode(null);
        setSelectedClient(null);
      } finally {
        setSubmitting(false);
      }
    },
    [createClient, selectedClient, updateClient],
  );

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
        {canCreateClient && (
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleAdd}>
            Add Client
          </Button>
        )}
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
      <ClientTable
        clients={filteredClients}
        loading={loading}
        onView={handleView}
        onEdit={canUpdateClient ? handleEdit : undefined}
        onDelete={canDeleteClient ? handleDelete : undefined}
      />

      <Modal
        isOpen={dialogMode === 'add' || dialogMode === 'edit'}
        onClose={closeDialog}
        title={dialogMode === 'edit' ? 'Edit Client' : 'Add Client'}
        size="lg"
      >
        <ClientForm
          key={selectedClient?.id ?? 'new-client'}
          initialValue={selectedClient ?? undefined}
          onSubmit={handleSave}
          onCancel={closeDialog}
          submitting={submitting}
        />
      </Modal>

      <Modal isOpen={dialogMode === 'view'} onClose={closeDialog} title="Client Details" size="md">
        {selectedClient && (
          <Stack spacing={2}>
            <Box>
              <Typography variant="h6">{selectedClient.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {selectedClient.industry} - {selectedClient.location}
              </Typography>
            </Box>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              <Chip label={selectedClient.status} color={selectedClient.status === 'Active' ? 'success' : 'default'} />
              <Chip label={selectedClient.health} />
            </Stack>
            <Stack spacing={0.75}>
              <Typography variant="body2">Account Manager: {selectedClient.accountManager}</Typography>
              <Typography variant="body2">Projects: {selectedClient.activeProjects}/{selectedClient.projects}</Typography>
              <Typography variant="body2">Allocated Employees: {selectedClient.employeesAllocated}</Typography>
              <Typography variant="body2">Revenue: Rs {selectedClient.revenue.toLocaleString('en-IN')}</Typography>
              <Typography variant="body2">Start Date: {selectedClient.startDate}</Typography>
            </Stack>
            <Stack direction="row" spacing={1} justifyContent="flex-end">
              <Button onClick={closeDialog}>Close</Button>
              {canUpdateClient && (
                <Button variant="contained" onClick={() => setDialogMode('edit')}>Edit</Button>
              )}
            </Stack>
          </Stack>
        )}
      </Modal>
    </Box>
  );
};

export default ClientsPage;
