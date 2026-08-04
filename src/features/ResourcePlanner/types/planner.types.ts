export interface PlannerAllocation {
  id: string;
  employeeId: string;
  employee: string;
  department: string;
  role: string;
  skill: string;
  project: string;
  startDate: string;
  endDate: string;
  allocation: number;
  billability: 'Billable' | 'Non-Billable' | 'Bench';
  status: 'Billable' | 'Non-Billable' | 'Overallocated' | 'Fully Allocated' | 'Releasing Soon' | 'Bench';
}

export interface PlannerFilters {
  search: string;
  department: string;
  skill: string;
  status: string;
}

export interface PlannerStats {
  totalAllocations: number;
  fullyAllocated: number;
  tentative: number;
  atRisk: number;
}
