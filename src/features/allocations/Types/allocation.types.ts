export interface Allocation {
  id: string;
  employee: string;
  employeeId: string;
  project: string;
  projectId: string;
  role: string;
  start: string;
  end: string;
  allocation: number;
  capacity: string;
  billability: 'Billable' | 'Non-Billable';
  status: 'Active' | 'Overallocated' | 'Releasing Soon' | 'Completed';
}

export interface AllocationStats {
  total: number;
  active: number;
  overallocated: number;
  releasingSoon: number;
}

export interface AllocationFormData {
  employeeId: string;
  projectId: string;
  role: string;
  allocationPercentage: number;
  startDate: string;
  endDate: string;
  billability: 'Billable' | 'Non-Billable';
  notes?: string;
}