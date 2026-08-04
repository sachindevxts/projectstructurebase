import clientsData from '@/dummyJson/clients/client-list.json';
import type { Client, ClientFilters, ClientStats } from '../types/client.types';

class ClientService {
  private clients: Client[] = [];

  constructor() {
    this.clients = clientsData.clients as Client[];
  }

  getAllClients(): Client[] {
    return this.clients;
  }

  getClientById(id: string): Client | undefined {
    return this.clients.find((client) => client.id === id);
  }

  getClientStats(): ClientStats {
    return {
      total: this.clients.length,
      active: this.clients.filter((client) => client.status === 'Active').length,
      revenue: this.clients.reduce((sum, client) => sum + client.revenue, 0),
      atRisk: this.clients.filter((client) => client.health === 'At Risk').length,
    };
  }

  filterClients(filters: ClientFilters): Client[] {
    let filtered = [...this.clients];
    const search = filters.search.trim().toLowerCase();

    if (search) {
      filtered = filtered.filter((client) =>
        [client.name, client.industry, client.accountManager, client.location].join(' ').toLowerCase().includes(search),
      );
    }

    if (filters.industry !== 'All') filtered = filtered.filter((client) => client.industry === filters.industry);
    if (filters.status !== 'All') filtered = filtered.filter((client) => client.status === filters.status);
    if (filters.health !== 'All') filtered = filtered.filter((client) => client.health === filters.health);

    return filtered;
  }

  createClient(client: Omit<Client, 'id'>): Client {
    const newClient = { ...client, id: `CL-${Date.now()}` };
    this.clients = [newClient, ...this.clients];
    return newClient;
  }

  updateClient(id: string, updates: Partial<Client>): Client | null {
    const index = this.clients.findIndex((client) => client.id === id);
    if (index === -1) return null;

    const updatedClient = { ...this.clients[index], ...updates };
    this.clients[index] = updatedClient;
    return updatedClient;
  }

  deleteClient(id: string): boolean {
    const initialLength = this.clients.length;
    this.clients = this.clients.filter((client) => client.id !== id);
    return this.clients.length < initialLength;
  }
}

export const clientService = new ClientService();
