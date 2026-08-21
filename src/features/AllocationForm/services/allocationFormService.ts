import { unwrapApiData, type ApiEnvelope } from '@/api/apiResponse';
import { api } from '@/api/client/apiClient';
import { API_ENDPOINTS } from '@/constants/api.constants';
import { allocationService } from '@/features/allocations/Services/allocationService';
import type {
  AllocationFormEmployee,
  AllocationFormProject,
  AllocationFormValues,
  CapacityPreviewData,
} from '../types/allocationForm.types';

interface BackendEmployee {
  id: string;
  firstName: string;
  lastName: string;
  departmentId?: string | null;
  designationId?: string | null;
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

interface BackendProject {
  id: string;
  name: string;
  status: 'PLANNED' | 'ACTIVE' | 'ON_HOLD' | 'COMPLETED' | 'CANCELLED';
  billingType: 'FIXED_PRICE' | 'TIME_AND_MATERIAL' | 'INTERNAL';
  managerId?: string | null;
}

let employeesCache: AllocationFormEmployee[] = [];

async function getEmployees(): Promise<AllocationFormEmployee[]> {
  const [employeesResponse, departmentsResponse, designationsResponse, allocationsResponse] =
    await Promise.all([
      api.get<ApiEnvelope<BackendEmployee[]>>(API_ENDPOINTS.EMPLOYEE_LOOKUP),
      api.get<ApiEnvelope<BackendLookup[]>>(API_ENDPOINTS.DEPARTMENT_LOOKUP),
      api.get<ApiEnvelope<BackendLookup[]>>(API_ENDPOINTS.DESIGNATION_LOOKUP),
      api.get<ApiEnvelope<BackendAllocation[]>>(API_ENDPOINTS.PROJECT_ALLOCATION_LOOKUP),
    ]);
  const departments = new Map(
    unwrapApiData(departmentsResponse.data).map((department) => [department.id, department.name]),
  );
  const designations = new Map(
    unwrapApiData(designationsResponse.data).map((designation) => [
      designation.id,
      designation.name,
    ]),
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
  employeesCache = unwrapApiData(employeesResponse.data).map((employee) => ({
    id: employee.id,
    name: `${employee.firstName} ${employee.lastName}`,
    department: employee.departmentId
      ? (departments.get(employee.departmentId) ?? 'Unassigned')
      : 'Unassigned',
    designation: employee.designationId
      ? (designations.get(employee.designationId) ?? 'Unassigned')
      : 'Unassigned',
    allocation: allocationByEmployee[employee.id] ?? 0,
  }));
  return employeesCache;
}

async function getProjects(): Promise<AllocationFormProject[]> {
  const [projectsResponse, employeesResponse] = await Promise.all([
    api.get<ApiEnvelope<BackendProject[]>>(API_ENDPOINTS.PROJECT_LOOKUP),
    api.get<ApiEnvelope<BackendEmployee[]>>(API_ENDPOINTS.EMPLOYEE_LOOKUP),
  ]);
  const employees = new Map(
    unwrapApiData(employeesResponse.data).map((employee) => [
      employee.id,
      `${employee.firstName} ${employee.lastName}`,
    ]),
  );
  return unwrapApiData(projectsResponse.data).map((project) => ({
    id: project.id,
    name: project.name,
    client: project.billingType === 'INTERNAL' ? 'Internal' : 'External Client',
    manager: project.managerId ? (employees.get(project.managerId) ?? 'Unassigned') : 'Unassigned',
    status:
      project.status === 'COMPLETED'
        ? 'Completed'
        : project.status === 'ON_HOLD' || project.status === 'CANCELLED'
          ? 'On Hold'
          : 'Active',
  }));
}

function getCapacityPreview(values: AllocationFormValues): CapacityPreviewData {
  const employee = employeesCache.find((item) => item.id === values.employeeId);
  const currentAllocation = employee?.allocation ?? 0;
  const requestedAllocation = Number(values.allocationPercentage) || 0;
  const projectedAllocation = currentAllocation + requestedAllocation;
  const remainingCapacity = 100 - projectedAllocation;
  const status =
    projectedAllocation > 100
      ? 'Overallocated'
      : projectedAllocation === 100
        ? 'Fully Allocated'
        : 'Available';

  return {
    currentAllocation,
    requestedAllocation,
    remainingCapacity,
    projectedAllocation,
    status,
  };
}

function validate(values: AllocationFormValues): string[] {
  const errors: string[] = [];
  if (!values.employeeId) errors.push('Employee is required');
  if (!values.projectId) errors.push('Project is required');
  if (!values.role) errors.push('Role is required');
  if (values.allocationPercentage <= 0) errors.push('Allocation must be greater than zero');
  if (values.startDate && values.endDate && values.startDate > values.endDate)
    errors.push('End date must be after start date');
  return errors;
}

async function save(values: AllocationFormValues): Promise<AllocationFormValues> {
  await allocationService.createAllocation({
    employeeId: values.employeeId,
    projectId: values.projectId,
    role: values.role,
    allocationPercentage: values.allocationPercentage,
    startDate: values.startDate,
    endDate: values.endDate,
    billability: values.billability,
    notes: values.notes,
  });
  return values;
}

export const allocationFormService = {
  getEmployees,
  getProjects,
  getCapacityPreview,
  validate,
  save,
};
