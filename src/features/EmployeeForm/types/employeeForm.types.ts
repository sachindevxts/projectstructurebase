export interface EmployeeFormValues {
  name: string;
  email: string;
  phone: string;
  location: string;
  department: string;
  designation: string;
  manager: string;
  // type: 'Full-Time' | 'Contract' | 'Part-Time';
  type: string;
  joined: string;
  allocation: number;
  // billability: 'Billable' | 'Non-Billable';
  billability: string;
  status: string;
  // status: 'Active' | 'Inactive' | 'On Leave';
  skills: string[];
}

export interface EmployeeFormStep {
  label: string;
  description: string;
}
