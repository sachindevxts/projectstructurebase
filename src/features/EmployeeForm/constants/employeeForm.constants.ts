import type { EmployeeFormStep, EmployeeFormValues } from '../types/employeeForm.types';

export const EMPLOYEE_FORM_STEPS: EmployeeFormStep[] = [
  { label: 'Personal', description: 'Identity and contact details' },
  { label: 'Employment', description: 'Organization and reporting details' },
  { label: 'Professional', description: 'Skills, allocation, and status' },
];

export const EMPLOYEE_DEPARTMENTS = ['Engineering', 'QA', 'Design', 'HR', 'Delivery', 'Product', 'DevOps'] as const;
export const EMPLOYEE_TYPES = ['Full-Time', 'Contract', 'Part-Time'] as const;
export const EMPLOYEE_BILLABILITY = ['Billable', 'Non-Billable'] as const;
export const EMPLOYEE_STATUSES = ['Active', 'Inactive', 'On Leave'] as const;

export const INITIAL_EMPLOYEE_FORM: EmployeeFormValues = {
  name: '',
  email: '',
  phone: '',
  location: '',
  department: 'Engineering',
  designation: '',
  manager: '',
  type: 'Full-Time',
  joined: new Date().toISOString().split('T')[0],
  allocation: 0,
  billability: 'Billable',
  status: 'Active',
  skills: [],
};
