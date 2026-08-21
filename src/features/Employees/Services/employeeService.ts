import { unwrapApiData, type ApiEnvelope } from '@/api/apiResponse';
import { api } from '@/api/client/apiClient';
import { API_ENDPOINTS } from '@/constants/api.constants';
import type { Employee, EmployeeFilters, EmployeeStats } from '../Types/employee.types';

interface BackendEmployee {
  id: string;
  employeeNumber: string;
  firstName: string;
  lastName: string;
  workEmail: string;
  status: 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE' | 'TERMINATED';
  employmentType: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERN';
  billable: boolean;
  joiningDate: string;
  departmentId?: string | null;
  designationId?: string | null;
  reportingManagerId?: string | null;
}

interface BackendLookup {
  id: string;
  name: string;
}

interface BackendAllocation {
  employeeId: string;
  percentage: number;
  status: 'PLANNED' | 'ACTIVE' | 'ENDED' | 'CANCELLED';
}

const statusMap: Record<BackendEmployee['status'], Employee['status']> = {
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
  ON_LEAVE: 'On Leave',
  TERMINATED: 'Inactive',
};

const typeMap: Record<BackendEmployee['employmentType'], Employee['type']> = {
  FULL_TIME: 'Full-Time',
  PART_TIME: 'Part-Time',
  CONTRACT: 'Contract',
  INTERN: 'Contract',
};

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function toDateInputValue(value: string): string {
  return new Date(value).toISOString().split('T')[0];
}

let employeesCache: Employee[] = [];

async function getAllEmployees(): Promise<Employee[]> {
  const [employeesResponse, departmentsResponse, designationsResponse, allocationsResponse] =
    await Promise.all([
      api.get<ApiEnvelope<BackendEmployee[]>>(API_ENDPOINTS.EMPLOYEES),
      api.get<ApiEnvelope<BackendLookup[]>>(API_ENDPOINTS.DEPARTMENT_LOOKUP),
      api.get<ApiEnvelope<BackendLookup[]>>(API_ENDPOINTS.DESIGNATION_LOOKUP),
      api.get<ApiEnvelope<BackendAllocation[]>>(API_ENDPOINTS.PROJECT_ALLOCATION_LOOKUP),
    ]);

  const departments = new Map(
    unwrapApiData(departmentsResponse.data).map((item) => [item.id, item.name]),
  );
  const designations = new Map(
    unwrapApiData(designationsResponse.data).map((item) => [item.id, item.name]),
  );
  const allocationByEmployee = unwrapApiData(allocationsResponse.data).reduce(
    (acc, allocation) => {
      if (allocation.status === 'ACTIVE' || allocation.status === 'PLANNED') {
        acc[allocation.employeeId] = (acc[allocation.employeeId] ?? 0) + allocation.percentage;
      }
      return acc;
    },
    {} as Record<string, number>,
  );

  employeesCache = unwrapApiData(employeesResponse.data).map((employee) => {
    const allocation = allocationByEmployee[employee.id] ?? 0;
    return {
      id: employee.id,
      name: `${employee.firstName} ${employee.lastName}`,
      email: employee.workEmail,
      department: employee.departmentId
        ? (departments.get(employee.departmentId) ?? 'Unassigned')
        : 'Unassigned',
      designation: employee.designationId
        ? (designations.get(employee.designationId) ?? 'Unassigned')
        : 'Unassigned',
      manager: employee.reportingManagerId ?? 'Unassigned',
      type: typeMap[employee.employmentType],
      joined: formatDate(employee.joiningDate),
      joinedDate: toDateInputValue(employee.joiningDate),
      allocation,
      billability: employee.billable ? 'Billable' : 'Non-Billable',
      status: allocation > 100 ? 'Overallocated' : statusMap[employee.status],
    };
  });

  return employeesCache;
}

async function getEmployeeById(id: string): Promise<Employee | undefined> {
  if (!employeesCache.length) await getAllEmployees();
  return employeesCache.find((employee) => employee.id === id);
}

function getEmployeeStats(employees = employeesCache): EmployeeStats {
  return {
    total: employees.length,
    active: employees.filter((employee) => employee.status === 'Active').length,
    onLeave: employees.filter((employee) => employee.status === 'On Leave').length,
    overallocated: employees.filter((employee) => employee.allocation > 100).length,
    billable: employees.filter((employee) => employee.billability === 'Billable').length,
  };
}

function filterEmployees(filters: EmployeeFilters): Employee[] {
  let filtered = [...employeesCache];

  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter((employee) =>
      [employee.name, employee.email, employee.id].join(' ').toLowerCase().includes(searchLower),
    );
  }

  if (filters.department && filters.department !== 'All') {
    filtered = filtered.filter((employee) => employee.department === filters.department);
  }

  if (filters.designation && filters.designation !== 'All') {
    filtered = filtered.filter((employee) => employee.designation === filters.designation);
  }

  if (filters.status && filters.status !== 'All') {
    filtered = filtered.filter((employee) => employee.status === filters.status);
  }

  if (filters.billability && filters.billability !== 'All') {
    filtered = filtered.filter((employee) => employee.billability === filters.billability);
  }

  if (filters.employmentType && filters.employmentType !== 'All') {
    filtered = filtered.filter((employee) => employee.type === filters.employmentType);
  }

  return filtered;
}

async function createEmployee(employee: Omit<Employee, 'id'>): Promise<Employee> {
  const [firstName, ...lastNameParts] = employee.name.split(' ');
  await api.post(API_ENDPOINTS.EMPLOYEES, {
    employeeNumber: `PF-${Date.now()}`,
    firstName: firstName || employee.name,
    lastName: lastNameParts.join(' ') || 'Employee',
    workEmail: employee.email,
    employmentType:
      employee.type === 'Full-Time'
        ? 'FULL_TIME'
        : employee.type === 'Part-Time'
          ? 'PART_TIME'
          : 'CONTRACT',
    joiningDate: new Date().toISOString(),
    billable: employee.billability === 'Billable',
  });
  const employees = await getAllEmployees();
  return employees[0];
}

async function updateEmployee(id: string, updates: Partial<Employee>): Promise<Employee | null> {
  const [firstName, ...lastNameParts] = updates.name?.split(' ') ?? [];
  await api.patch(`${API_ENDPOINTS.EMPLOYEES}/${id}`, {
    firstName: firstName || undefined,
    lastName: lastNameParts.length ? lastNameParts.join(' ') : undefined,
    workEmail: updates.email,
    employmentType:
      updates.type === 'Full-Time'
        ? 'FULL_TIME'
        : updates.type === 'Part-Time'
          ? 'PART_TIME'
          : updates.type === 'Contract'
            ? 'CONTRACT'
            : undefined,
    joiningDate: updates.joinedDate,
    status:
      updates.status === 'Active'
        ? 'ACTIVE'
        : updates.status === 'Inactive'
          ? 'INACTIVE'
          : updates.status === 'On Leave'
            ? 'ON_LEAVE'
            : undefined,
    billable:
      updates.billability === 'Billable'
        ? true
        : updates.billability === 'Non-Billable'
          ? false
          : undefined,
  });
  await getAllEmployees();
  return employeesCache.find((employee) => employee.id === id) ?? null;
}

async function deleteEmployee(id: string): Promise<boolean> {
  await api.delete(`${API_ENDPOINTS.EMPLOYEES}/${id}`);
  employeesCache = employeesCache.filter((employee) => employee.id !== id);
  return true;
}

function exportToCsv(employees: Employee[]): string {
  const headers = ['ID', 'Name', 'Email', 'Department', 'Designation', 'Status', 'Billability'];
  const rows = employees.map((employee) => [
    employee.id,
    employee.name,
    employee.email,
    employee.department,
    employee.designation,
    employee.status,
    employee.billability,
  ]);
  return [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
}

export const employeeService = {
  getAllEmployees,
  getEmployeeById,
  getEmployeeStats,
  filterEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  exportToCsv,
};
