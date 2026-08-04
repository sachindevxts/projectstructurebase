export interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  designation: string;
  manager: string;
  type: 'Full-Time' | 'Contract' | 'Part-Time';
  joined: string;
  allocation: number;
  billability: 'Billable' | 'Non-Billable';
  status: 'Active' | 'Inactive' | 'On Leave' | 'Overallocated' | 'Releasing Soon';
  phone?: string;
  location?: string;
  skills?: string[];
}

export interface EmployeeStats {
  total: number;
  active: number;
  onLeave: number;
  overallocated: number;
  billable: number;
}

export interface EmployeeFilters {
  search: string;
  department: string;
  designation: string;
  status: string;
  billability: string;
  employmentType: string;
}