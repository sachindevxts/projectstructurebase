import employeeData from '@/dummyJson/employees/employee-list.json';
import type { EmployeeFormValues } from '../types/employeeForm.types';

class EmployeeFormService {
  getEmployee(id: string): EmployeeFormValues | null {
    const employee = employeeData.employees.find((item) => item.id === id);
    if (!employee) return null;

    return {
      name: employee.name,
      email: employee.email,
      phone: employee.phone ?? '',
      location: employee.location ?? '',
      department: employee.department,
      designation: employee.designation,
      manager: employee.manager,
      type: employee.type,
      joined: employee.joined,
      allocation: employee.allocation,
      billability: employee.billability,
      status: employee.status === 'Overallocated' || employee.status === 'Releasing Soon' ? 'Active' : employee.status,
      skills: employee.skills ?? [],
    };
  }

  validate(values: EmployeeFormValues): string[] {
    const errors: string[] = [];
    if (!values.name.trim()) errors.push('Employee name is required');
    if (!values.email.trim()) errors.push('Email is required');
    if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) errors.push('Email format is invalid');
    if (!values.department) errors.push('Department is required');
    if (!values.designation.trim()) errors.push('Designation is required');
    if (values.allocation < 0 || values.allocation > 150) errors.push('Allocation must be between 0 and 150');
    return errors;
  }

  save(values: EmployeeFormValues): EmployeeFormValues {
    return values;
  }
}

export const employeeFormService = new EmployeeFormService();
