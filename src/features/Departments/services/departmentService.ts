import { unwrapApiData, type ApiEnvelope } from '@/api/apiResponse';
import { api } from '@/api/client/apiClient';
import { API_ENDPOINTS } from '@/constants/api.constants';
import type { Department, DepartmentStats } from '../types/department.types';

interface BackendDepartment {
  id: string;
  name: string;
  code: string;
  description: string | null;
  isActive: boolean;
}

interface BackendEmployee {
  departmentId?: string | null;
  billable: boolean;
  status: string;
}

let departmentsCache: Department[] = [];

async function getAllDepartments(): Promise<Department[]> {
  const [departmentsResponse, employeesResponse] = await Promise.all([
    api.get<ApiEnvelope<BackendDepartment[]>>(API_ENDPOINTS.DEPARTMENTS),
    api.get<ApiEnvelope<BackendEmployee[]>>(API_ENDPOINTS.EMPLOYEES),
  ]);

  const employeeStats = unwrapApiData(employeesResponse.data).reduce(
    (acc, employee) => {
      const departmentId = employee.departmentId ?? 'unassigned';
      const current = acc[departmentId] ?? { employees: 0, billable: 0, bench: 0 };
      current.employees += 1;
      if (employee.billable) current.billable += 1;
      if (!employee.billable && employee.status === 'ACTIVE') current.bench += 1;
      acc[departmentId] = current;
      return acc;
    },
    {} as Record<string, { employees: number; billable: number; bench: number }>,
  );

  departmentsCache = unwrapApiData(departmentsResponse.data).map((department) => {
    const stats = employeeStats[department.id] ?? { employees: 0, billable: 0, bench: 0 };
    const billability = stats.employees
      ? Math.round((stats.billable / stats.employees) * 100)
      : 0;

    return {
      id: department.id,
      name: department.name,
      code: department.code,
      head: 'Unassigned',
      employees: stats.employees,
      billable: stats.billable,
      bench: stats.bench,
      billability,
      skills: [],
      status: department.isActive ? 'Active' : 'Inactive',
      description: department.description ?? undefined,
    };
  });

  return departmentsCache;
}

async function getDepartmentById(id: string): Promise<Department | undefined> {
  if (!departmentsCache.length) await getAllDepartments();
  return departmentsCache.find((department) => department.id === id);
}

function getDepartmentStats(departments = departmentsCache): DepartmentStats {
  const total = departments.length;
  const totalEmployees = departments.reduce((sum, department) => sum + department.employees, 0);
  const onBench = departments.reduce((sum, department) => sum + department.bench, 0);
  const avgBillability = total
    ? Math.round(departments.reduce((sum, department) => sum + department.billability, 0) / total)
    : 0;

  return { total, totalEmployees, onBench, avgBillability };
}

function filterDepartments(search: string): Department[] {
  if (!search) return departmentsCache;
  const searchLower = search.toLowerCase();
  return departmentsCache.filter((department) =>
    [department.name, department.code, department.head].join(' ').toLowerCase().includes(searchLower),
  );
}

async function createDepartment(department: Omit<Department, 'id'>): Promise<Department> {
  await api.post(API_ENDPOINTS.DEPARTMENTS, {
    name: department.name,
    code: department.code,
    description: department.description,
  });
  const departments = await getAllDepartments();
  return departments[0];
}

async function updateDepartment(id: string, updates: Partial<Department>): Promise<Department | null> {
  await api.patch(`${API_ENDPOINTS.DEPARTMENTS}/${id}`, {
    name: updates.name,
    code: updates.code,
    description: updates.description,
  });
  await getAllDepartments();
  return departmentsCache.find((department) => department.id === id) ?? null;
}

async function deleteDepartment(id: string): Promise<boolean> {
  await api.delete(`${API_ENDPOINTS.DEPARTMENTS}/${id}`);
  departmentsCache = departmentsCache.filter((department) => department.id !== id);
  return true;
}

export const departmentService = {
  getAllDepartments,
  getDepartmentById,
  getDepartmentStats,
  filterDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
};
