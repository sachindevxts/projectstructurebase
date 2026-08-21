import { employeeService } from '@/features/Employees/Services/employeeService';
import type { Employee } from '@/features/Employees/Types/employee.types';
import type { EmployeeFormValues } from '../types/employeeForm.types';

async function getEmployee(id: string): Promise<EmployeeFormValues | null> {
  const employee = await employeeService.getEmployeeById(id);
  if (!employee) return null;

  return {
    name: employee.name,
    email: employee.email,
    department: employee.department,
    designation: employee.designation,
    manager: employee.manager,
    type: employee.type,
    joined: employee.joinedDate ?? new Date(employee.joined).toISOString().split('T')[0],
    allocation: employee.allocation,
    billability: employee.billability,
    phone: employee.phone ?? '',
    location: employee.location ?? '',
    status: employee.status === 'Overallocated' || employee.status === 'Releasing Soon' ? 'Active' : employee.status,
    skills: employee.skills ?? [],
  };
}

function validate(values: EmployeeFormValues): string[] {
  const errors: string[] = [];
  if (!values.name.trim()) errors.push('Employee name is required');
  if (!values.email.trim()) errors.push('Email is required');
  if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email))
    errors.push('Email format is invalid');
  if (!values.department) errors.push('Department is required');
  if (!values.designation.trim()) errors.push('Designation is required');
  if (values.allocation < 0 || values.allocation > 150)
    errors.push('Allocation must be between 0 and 150');
  return errors;
}

function toEmployeePayload(values: EmployeeFormValues): Omit<Employee, 'id'> {
  return {
    name: values.name,
    email: values.email,
    department: values.department,
    designation: values.designation,
    manager: values.manager,
    type:
      values.type === 'Part-Time'
        ? 'Part-Time'
        : values.type === 'Contract'
          ? 'Contract'
          : 'Full-Time',
    joined: values.joined,
    allocation: values.allocation,
    billability: values.billability === 'Non-Billable' ? 'Non-Billable' : 'Billable',
    status:
      values.status === 'Inactive' || values.status === 'On Leave'
        ? values.status
        : values.status === 'Overallocated' || values.status === 'Releasing Soon'
          ? values.status
          : 'Active',
    skills: values.skills,
    joinedDate: values.joined,
  };
}

async function save(values: EmployeeFormValues, employeeId?: string): Promise<EmployeeFormValues> {
  const payload = toEmployeePayload(values);

  if (employeeId) {
    await employeeService.updateEmployee(employeeId, payload);
  } else {
    await employeeService.createEmployee(payload);
  }

  return values;
}

export const employeeFormService = {
  getEmployee,
  validate,
  save,
};
