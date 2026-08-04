export interface EmployeeFormValues {
  name: string;
  email: string;
  phone: string;
  location: string;
  department: string;
  designation: string;
  manager: string;
  type: 'Full-Time' | 'Contract' | 'Part-Time';
  joined: string;
  allocation: number;
  billability: 'Billable' | 'Non-Billable';
  status: 'Active' | 'Inactive' | 'On Leave';
  skills: string[];
}

export interface EmployeeFormStep {
  label: string;
  description: string;
}
