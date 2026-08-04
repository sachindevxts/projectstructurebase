export interface Department {
  id: string;
  name: string;
  code: string;
  head: string;
  employees: number;
  billable: number;
  bench: number;
  billability: number;
  skills: string[];
  status: 'Active' | 'Inactive';
  description?: string;
}

export interface DepartmentStats {
  total: number;
  totalEmployees: number;
  onBench: number;
  avgBillability: number;
}