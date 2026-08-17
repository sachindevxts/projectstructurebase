import { unwrapApiData, type ApiEnvelope } from '@/api/apiResponse';
import { api } from '@/api/client/apiClient';
import { API_ENDPOINTS } from '@/constants/api.constants';
import type { Allocation, AllocationFormData, AllocationStats } from '../Types/allocation.types';

interface BackendAllocation {
  id: string;
  employeeId: string;
  projectId: string;
  percentage: number;
  startDate: string;
  endDate: string | null;
  status: 'PLANNED' | 'ACTIVE' | 'ENDED' | 'CANCELLED';
}

interface BackendEmployee {
  id: string;
  firstName: string;
  lastName: string;
  billable: boolean;
  designationId?: string | null;
}

interface BackendProject {
  id: string;
  name: string;
}

interface BackendDesignation {
  id: string;
  name: string;
}

const statusMap: Record<BackendAllocation['status'], Allocation['status']> = {
  PLANNED: 'Active',
  ACTIVE: 'Active',
  ENDED: 'Completed',
  CANCELLED: 'Completed',
};

function formatDate(value: string | null): string {
  if (!value) return 'Open';
  return new Date(value).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

let allocationsCache: Allocation[] = [];
let employeesCache: BackendEmployee[] = [];
let projectsCache: BackendProject[] = [];
let designationsCache: BackendDesignation[] = [];

async function getAllAllocations(): Promise<Allocation[]> {
  const [allocationsResponse, employeesResponse, projectsResponse, designationsResponse] =
    await Promise.all([
      api.get<ApiEnvelope<BackendAllocation[]>>(API_ENDPOINTS.PROJECT_ALLOCATIONS),
      api.get<ApiEnvelope<BackendEmployee[]>>(API_ENDPOINTS.EMPLOYEES),
      api.get<ApiEnvelope<BackendProject[]>>(API_ENDPOINTS.PROJECTS),
      api.get<ApiEnvelope<BackendDesignation[]>>(API_ENDPOINTS.DESIGNATIONS),
    ]);

  employeesCache = unwrapApiData(employeesResponse.data);
  projectsCache = unwrapApiData(projectsResponse.data);
  designationsCache = unwrapApiData(designationsResponse.data);

  const employees = new Map(
    employeesCache.map((employee) => [
      employee.id,
      {
        name: `${employee.firstName} ${employee.lastName}`,
        billable: employee.billable,
        designationId: employee.designationId,
      },
    ]),
  );
  const projects = new Map(projectsCache.map((project) => [project.id, project.name]));
  const designations = new Map(
    designationsCache.map((designation) => [designation.id, designation.name]),
  );

  allocationsCache = unwrapApiData(allocationsResponse.data).map((allocation) => {
    const employee = employees.get(allocation.employeeId);
    const role = employee?.designationId
      ? (designations.get(employee.designationId) ?? 'Unassigned')
      : 'Unassigned';

    return {
      id: allocation.id,
      employee: employee?.name ?? 'Unknown Employee',
      employeeId: allocation.employeeId,
      project: projects.get(allocation.projectId) ?? 'Unknown Project',
      projectId: allocation.projectId,
      role,
      start: formatDate(allocation.startDate),
      end: formatDate(allocation.endDate),
      allocation: allocation.percentage,
      capacity: `${Math.max(0, 100 - allocation.percentage)}%`,
      billability: employee?.billable ? 'Billable' : 'Non-Billable',
      status: allocation.percentage > 100 ? 'Overallocated' : statusMap[allocation.status],
    };
  });

  return allocationsCache;
}

function getAllocationStats(allocations = allocationsCache): AllocationStats {
  return {
    total: allocations.length,
    active: allocations.filter((allocation) => allocation.status === 'Active').length,
    overallocated: allocations.filter((allocation) => allocation.status === 'Overallocated').length,
    releasingSoon: allocations.filter((allocation) => allocation.status === 'Releasing Soon').length,
  };
}

function filterAllocations(search: string): Allocation[] {
  if (!search) return allocationsCache;
  const searchLower = search.toLowerCase();
  return allocationsCache.filter((allocation) =>
    [allocation.employee, allocation.project, allocation.role].join(' ').toLowerCase().includes(searchLower),
  );
}

function getAllocationFormData(): AllocationFormData {
  return {
    employeeId: '',
    projectId: '',
    role: '',
    allocationPercentage: 30,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    billability: 'Billable',
    notes: '',
  };
}

async function createAllocation(data: AllocationFormData): Promise<Allocation> {
  await api.post(API_ENDPOINTS.PROJECT_ALLOCATIONS, {
    employeeId: data.employeeId,
    projectId: data.projectId,
    percentage: data.allocationPercentage,
    startDate: data.startDate,
    endDate: data.endDate || undefined,
  });
  await getAllAllocations();
  return allocationsCache[0];
}

async function updateAllocation(id: string, updates: Partial<Allocation>): Promise<Allocation | null> {
  await api.patch(`${API_ENDPOINTS.PROJECT_ALLOCATIONS}/${id}`, {
    employeeId: updates.employeeId,
    projectId: updates.projectId,
    percentage: updates.allocation,
  });
  await getAllAllocations();
  return allocationsCache.find((allocation) => allocation.id === id) ?? null;
}

async function deleteAllocation(id: string): Promise<boolean> {
  await api.delete(`${API_ENDPOINTS.PROJECT_ALLOCATIONS}/${id}`);
  allocationsCache = allocationsCache.filter((allocation) => allocation.id !== id);
  return true;
}

function getAvailableEmployees(): BackendEmployee[] {
  const allocatedPercentByEmployee = allocationsCache.reduce(
    (acc, allocation) => {
      acc[allocation.employeeId] = (acc[allocation.employeeId] ?? 0) + allocation.allocation;
      return acc;
    },
    {} as Record<string, number>,
  );
  return employeesCache.filter((employee) => (allocatedPercentByEmployee[employee.id] ?? 0) < 100);
}

function getProjects(): BackendProject[] {
  return projectsCache;
}

export const allocationService = {
  getAllAllocations,
  getAllocationStats,
  filterAllocations,
  getAllocationFormData,
  createAllocation,
  updateAllocation,
  deleteAllocation,
  getAvailableEmployees,
  getProjects,
};
