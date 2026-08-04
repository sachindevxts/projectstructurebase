export interface Project {
  id: string;
  name: string;
  client: string;
  manager: string;
  start: string;
  end: string;
  team: number;
  billable: number;
  billing: string;
  status: 'Active' | 'At Risk' | 'Completed' | 'On Hold';
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