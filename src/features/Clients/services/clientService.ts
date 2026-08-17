import { unwrapApiData, type ApiEnvelope } from '@/api/apiResponse';
import { api } from '@/api/client/apiClient';
import { API_ENDPOINTS } from '@/constants/api.constants';
import type { Client, ClientFilters, ClientStats } from '../types/client.types';

let clientsCache: Client[] = [];

async function getAllClients(): Promise<Client[]> {
  const response = await api.get<ApiEnvelope<Client[]>>(API_ENDPOINTS.CLIENTS);
  clientsCache = unwrapApiData(response.data).map((client) => ({
    ...client,
    startDate: new Date(client.startDate).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }),
  }));
  return clientsCache;
}

async function getClientById(id: string): Promise<Client | undefined> {
  if (!clientsCache.length) await getAllClients();
  return clientsCache.find((client) => client.id === id);
}

function getClientStats(clients = clientsCache): ClientStats {
  return {
    total: clients.length,
    active: clients.filter((client) => client.status === 'Active').length,
    revenue: clients.reduce((sum, client) => sum + client.revenue, 0),
    atRisk: clients.filter((client) => client.health === 'At Risk').length,
  };
}

function filterClients(filters: ClientFilters, clients = clientsCache): Client[] {
  let filtered = [...clients];
  const search = filters.search.trim().toLowerCase();

  if (search) {
    filtered = filtered.filter((client) =>
      [client.name, client.industry, client.accountManager, client.location]
        .join(' ')
        .toLowerCase()
        .includes(search),
    );
  }

  if (filters.industry !== 'All')
    filtered = filtered.filter((client) => client.industry === filters.industry);
  if (filters.status !== 'All')
    filtered = filtered.filter((client) => client.status === filters.status);
  if (filters.health !== 'All')
    filtered = filtered.filter((client) => client.health === filters.health);

  return filtered;
}

async function createClient(client: Omit<Client, 'id'>): Promise<Client> {
  const startDate = client.startDate || new Date().toISOString();
  const response = await api.post<ApiEnvelope<Client>>(API_ENDPOINTS.CLIENTS, {
    ...client,
    startDate: new Date(startDate).toISOString(),
  });
  const created = unwrapApiData(response.data);
  await getAllClients();
  return created;
}

async function updateClient(id: string, updates: Partial<Client>): Promise<Client | null> {
  const response = await api.patch<ApiEnvelope<Client>>(`${API_ENDPOINTS.CLIENTS}/${id}`, {
    ...updates,
    startDate: updates.startDate ? new Date(updates.startDate).toISOString() : undefined,
  });
  const updated = unwrapApiData(response.data);
  await getAllClients();
  return updated;
}

async function deleteClient(id: string): Promise<boolean> {
  await api.delete(`${API_ENDPOINTS.CLIENTS}/${id}`);
  clientsCache = clientsCache.filter((client) => client.id !== id);
  return true;
}

export const clientService = {
  getAllClients,
  getClientById,
  getClientStats,
  filterClients,
  createClient,
  updateClient,
  deleteClient,
};
