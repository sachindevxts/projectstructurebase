import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDebounce } from '@/hooks';
import { clientService } from '../services/clientService';
import type { Client, ClientFilters } from '../types/client.types';

const defaultFilters: ClientFilters = {
  search: '',
  industry: 'All',
  status: 'All',
  health: 'All',
};

export const useClients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [filters, setFilters] = useState<ClientFilters>(defaultFilters);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const debouncedSearch = useDebounce(filters.search, 300);

  const loadClients = useCallback(async () => {
    try {
      setLoading(true);
      setClients(await clientService.getAllClients());
      setError(null);
    } catch (err) {
      setError('Failed to load clients');
      console.error('Error loading clients:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadClients();
  }, [loadClients]);

  const filteredClients = useMemo(
    () => clientService.filterClients({ ...filters, search: debouncedSearch }, clients),
    [clients, debouncedSearch, filters],
  );

  const updateFilter = useCallback(<K extends keyof ClientFilters>(key: K, value: ClientFilters[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetFilters = useCallback(() => setFilters(defaultFilters), []);

  const createClient = useCallback(async (client: Omit<Client, 'id'>) => {
    try {
      const created = await clientService.createClient(client);
      setClients((prev) => [created, ...prev]);
      return created;
    } catch (err) {
      setError('Failed to create client');
      console.error('Error creating client:', err);
      return null;
    }
  }, []);

  const updateClient = useCallback(async (id: string, updates: Partial<Client>) => {
    try {
      const updated = await clientService.updateClient(id, updates);
      if (updated) setClients((prev) => prev.map((client) => (client.id === id ? updated : client)));
      return updated;
    } catch (err) {
      setError('Failed to update client');
      console.error('Error updating client:', err);
      return null;
    }
  }, []);

  const deleteClient = useCallback(async (id: string) => {
    try {
      const deleted = await clientService.deleteClient(id);
      if (deleted) setClients((prev) => prev.filter((client) => client.id !== id));
      return deleted;
    } catch (err) {
      setError('Failed to delete client');
      console.error('Error deleting client:', err);
      return false;
    }
  }, []);

  const stats = useMemo(() => clientService.getClientStats(clients), [clients]);

  return { clients, filteredClients, filters, loading, error, stats, loadClients, updateFilter, resetFilters, createClient, updateClient, deleteClient };
};
