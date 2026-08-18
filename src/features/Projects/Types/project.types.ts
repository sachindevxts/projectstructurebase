export interface Project {
  id: string;
  code: string;
  name: string;
  client: string;
  manager: string;
  managerId?: string | null;
  start: string;
  end: string;
  startDate: string;
  endDate: string;
  team: number;
  billable: number;
  billing: string;
  billingType: 'FIXED_PRICE' | 'TIME_AND_MATERIAL' | 'INTERNAL';
  status: 'Active' | 'At Risk' | 'Completed' | 'On Hold';
  backendStatus: 'PLANNED' | 'ACTIVE' | 'ON_HOLD' | 'COMPLETED' | 'CANCELLED';
  priority?: 'High' | 'Medium' | 'Low';
  description?: string;
  skills?: string[];
}

export interface ProjectStats {
  total: number;
  active: number;
  atRisk: number;
  completed: number;
}
