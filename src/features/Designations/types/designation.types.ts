export interface Designation {
  id: string;
  name: string;
  department: string;
  level: 'Junior' | 'Mid-level' | 'Senior' | 'Lead' | 'Manager';
  employees: number;
  skills: string[];
  status: 'Active' | 'Inactive';
  description?: string;
}

export interface DesignationStats {
  total: number;
  totalEmployees: number;
  seniorityLevels: number;
  unmapped: number;
}

export interface DesignationFilters {
  search: string;
  department: string;
  level: string;
  status: string;
}
