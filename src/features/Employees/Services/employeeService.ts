import type { Employee, EmployeeStats, EmployeeFilters } from '../Types/employee.types';
import employeesData from '@/dummyJson/employees/employee-list.json';

class EmployeeService {
  private employees: Employee[] = [];

  constructor() {
    this.employees = employeesData.employees as Employee[];
  }

  getAllEmployees(): Employee[] {
    return this.employees;
  }

  getEmployeeById(id: string): Employee | undefined {
    return this.employees.find((emp) => emp.id === id);
  }

  getEmployeeStats(): EmployeeStats {
    const employees = this.employees;
    const total = employees.length;
    const active = employees.filter((e) => e.status === 'Active').length;
    const onLeave = employees.filter((e) => e.status === 'On Leave').length;
    const overallocated = employees.filter((e) => e.allocation > 100).length;
    const billable = employees.filter((e) => e.billability === 'Billable').length;

    return { total, active, onLeave, overallocated, billable };
  }

  filterEmployees(filters: EmployeeFilters): Employee[] {
    let filtered = [...this.employees];

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (e) =>
          e.name.toLowerCase().includes(searchLower) ||
          e.email.toLowerCase().includes(searchLower) ||
          e.id.toLowerCase().includes(searchLower),
      );
    }

    if (filters.department && filters.department !== 'All') {
      filtered = filtered.filter((e) => e.department === filters.department);
    }

    if (filters.designation && filters.designation !== 'All') {
      filtered = filtered.filter((e) => e.designation === filters.designation);
    }

    if (filters.status && filters.status !== 'All') {
      filtered = filtered.filter((e) => e.status === filters.status);
    }

    if (filters.billability && filters.billability !== 'All') {
      filtered = filtered.filter((e) => e.billability === filters.billability);
    }

    if (filters.employmentType && filters.employmentType !== 'All') {
      filtered = filtered.filter((e) => e.type === filters.employmentType);
    }

    return filtered;
  }

  createEmployee(employee: Omit<Employee, 'id'>): Employee {
    const newEmployee = {
      ...employee,
      id: `EMP-${Date.now()}`,
    };
    this.employees = [newEmployee, ...this.employees];
    return newEmployee;
  }

  updateEmployee(id: string, updates: Partial<Employee>): Employee | null {
    const index = this.employees.findIndex((e) => e.id === id);
    if (index === -1) return null;

    const updatedEmployee = { ...this.employees[index], ...updates };
    this.employees[index] = updatedEmployee;
    return updatedEmployee;
  }

  deleteEmployee(id: string): boolean {
    const initialLength = this.employees.length;
    this.employees = this.employees.filter((e) => e.id !== id);
    return this.employees.length < initialLength;
  }

  exportToCsv(employees: Employee[]): string {
    const headers = ['ID', 'Name', 'Email', 'Department', 'Designation', 'Status', 'Billability'];
    const rows = employees.map((e) => [
      e.id,
      e.name,
      e.email,
      e.department,
      e.designation,
      e.status,
      e.billability,
    ]);
    return [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
  }
}

export const employeeService = new EmployeeService();
