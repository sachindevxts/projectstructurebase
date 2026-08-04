export interface AllocationFormEmployee {
  id: string;
  name: string;
  department: string;
  designation: string;
  allocation: number;
}

export interface AllocationFormProject {
  id: string;
  name: string;
  client: string;
  manager: string;
  status: string;
}

export interface AllocationFormValues {
  employeeId: string;
  projectId: string;
  role: string;
  allocationPercentage: number;
  startDate: string;
  endDate: string;
  billability: 'Billable' | 'Non-Billable';
  notes: string;
}

export interface CapacityPreviewData {
  currentAllocation: number;
  requestedAllocation: number;
  remainingCapacity: number;
  projectedAllocation: number;
  status: 'Available' | 'Fully Allocated' | 'Overallocated';
}
