export interface Client {
  id: string;
  name: string;
  industry: string;
  accountManager: string;
  projects: number;
  activeProjects: number;
  employeesAllocated: number;
  revenue: number;
  status: 'Active' | 'Inactive';
  health: 'Healthy' | 'Watch' | 'At Risk';
  location: string;
  startDate: string;
}

export interface ClientStats {
  total: number;
  active: number;
  revenue: number;
  atRisk: number;
}

export interface ClientFilters {
  search: string;
  industry: string;
  status: string;
  health: string;
}
