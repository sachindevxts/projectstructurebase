import { unwrapApiData, type ApiEnvelope } from '@/api/apiResponse';
import { api } from '@/api/client/apiClient';
import { API_ENDPOINTS } from '@/constants/api.constants';
import type { Project, ProjectStats } from '../Types/project.types';

interface BackendProject {
  id: string;
  name: string;
  code: string;
  status: 'PLANNED' | 'ACTIVE' | 'ON_HOLD' | 'COMPLETED' | 'CANCELLED';
  billingType: 'FIXED_PRICE' | 'TIME_AND_MATERIAL' | 'INTERNAL';
  startDate: string;
  endDate: string | null;
  managerId?: string | null;
}

interface BackendEmployee {
  id: string;
  firstName: string;
  lastName: string;
}

interface BackendAllocation {
  projectId: string;
  percentage: number;
  status: 'PLANNED' | 'ACTIVE' | 'ENDED' | 'CANCELLED';
}

const statusMap: Record<BackendProject['status'], Project['status']> = {
  PLANNED: 'Active',
  ACTIVE: 'Active',
  ON_HOLD: 'On Hold',
  COMPLETED: 'Completed',
  CANCELLED: 'On Hold',
};

const billingMap: Record<BackendProject['billingType'], string> = {
  FIXED_PRICE: 'Fixed Price',
  TIME_AND_MATERIAL: 'Time & Material',
  INTERNAL: 'Internal',
};

function formatDate(value: string | null): string {
  if (!value) return 'Open';
  return new Date(value).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function toDateInputValue(value: string | null): string {
  if (!value) return '';
  return new Date(value).toISOString().split('T')[0];
}

function createCode(name: string): string {
  const base = name.replace(/[^a-z0-9]/gi, '').slice(0, 8).toUpperCase();
  return `${base || 'PROJ'}${Math.floor(Date.now() / 1000).toString().slice(-4)}`;
}

function toBackendStatus(status?: Project['status']): BackendProject['status'] | undefined {
  if (status === 'Completed') return 'COMPLETED';
  if (status === 'On Hold') return 'ON_HOLD';
  if (status === 'Active') return 'ACTIVE';
  return undefined;
}

function toBackendBilling(billing?: string): BackendProject['billingType'] | undefined {
  if (billing === 'Internal') return 'INTERNAL';
  if (billing === 'Fixed Price') return 'FIXED_PRICE';
  if (billing === 'Time & Material') return 'TIME_AND_MATERIAL';
  return undefined;
}

let projectsCache: Project[] = [];
let employeesCache: BackendEmployee[] = [];

async function getAllProjects(): Promise<Project[]> {
  const [projectsResponse, employeesResponse, allocationsResponse] = await Promise.all([
    api.get<ApiEnvelope<BackendProject[]>>(API_ENDPOINTS.PROJECTS),
    api.get<ApiEnvelope<BackendEmployee[]>>(API_ENDPOINTS.EMPLOYEES),
    api.get<ApiEnvelope<BackendAllocation[]>>(API_ENDPOINTS.PROJECT_ALLOCATIONS),
  ]);

  employeesCache = unwrapApiData(employeesResponse.data);
  const employees = new Map(
    employeesCache.map((employee) => [
      employee.id,
      `${employee.firstName} ${employee.lastName}`,
    ]),
  );
  const allocationsByProject = unwrapApiData(allocationsResponse.data).reduce(
    (acc, allocation) => {
      if (allocation.status === 'ACTIVE' || allocation.status === 'PLANNED') {
        const current = acc[allocation.projectId] ?? { team: 0, billable: 0 };
        current.team += 1;
        current.billable += allocation.percentage;
        acc[allocation.projectId] = current;
      }
      return acc;
    },
    {} as Record<string, { team: number; billable: number }>,
  );

  projectsCache = unwrapApiData(projectsResponse.data).map((project) => {
    const allocation = allocationsByProject[project.id] ?? { team: 0, billable: 0 };
    return {
      id: project.id,
      code: project.code,
      name: project.name,
      client: project.billingType === 'INTERNAL' ? 'Internal' : 'External Client',
      managerId: project.managerId ?? null,
      manager: project.managerId ? (employees.get(project.managerId) ?? 'Unassigned') : 'Unassigned',
      start: formatDate(project.startDate),
      end: formatDate(project.endDate),
      startDate: toDateInputValue(project.startDate),
      endDate: toDateInputValue(project.endDate),
      team: allocation.team,
      billable: allocation.billable,
      billing: billingMap[project.billingType],
      billingType: project.billingType,
      status: statusMap[project.status],
      backendStatus: project.status,
    };
  });

  return projectsCache;
}

async function getProjectById(id: string): Promise<Project | undefined> {
  if (!projectsCache.length) await getAllProjects();
  return projectsCache.find((project) => project.id === id);
}

function getProjectStats(projects = projectsCache): ProjectStats {
  return {
    total: projects.length,
    active: projects.filter((project) => project.status === 'Active').length,
    atRisk: projects.filter((project) => project.status === 'At Risk').length,
    completed: projects.filter((project) => project.status === 'Completed').length,
  };
}

function filterProjects(search: string): Project[] {
  if (!search) return projectsCache;
  const searchLower = search.toLowerCase();
  return projectsCache.filter((project) =>
    [project.name, project.client, project.manager].join(' ').toLowerCase().includes(searchLower),
  );
}

function getManagers(): BackendEmployee[] {
  return employeesCache;
}

async function createProject(project: Omit<Project, 'id'>): Promise<Project> {
  const response = await api.post<ApiEnvelope<BackendProject>>(API_ENDPOINTS.PROJECTS, {
    name: project.name,
    code: project.code || createCode(project.name),
    billingType: project.billingType ?? toBackendBilling(project.billing) ?? 'TIME_AND_MATERIAL',
    status: project.backendStatus ?? toBackendStatus(project.status) ?? 'ACTIVE',
    startDate: project.startDate || new Date().toISOString().split('T')[0],
    endDate: project.endDate || undefined,
    managerId: project.managerId || undefined,
  });
  await getAllProjects();
  const created = unwrapApiData(response.data);
  return projectsCache.find((item) => item.id === created.id) ?? projectsCache[0];
}

async function updateProject(id: string, updates: Partial<Project>): Promise<Project | null> {
  await api.patch(`${API_ENDPOINTS.PROJECTS}/${id}`, {
    name: updates.name,
    code: updates.code,
    billingType: updates.billingType ?? toBackendBilling(updates.billing),
    status: updates.backendStatus ?? toBackendStatus(updates.status),
    startDate: updates.startDate,
    endDate: updates.endDate || undefined,
    managerId: updates.managerId || undefined,
  });
  await getAllProjects();
  return projectsCache.find((project) => project.id === id) ?? null;
}

async function deleteProject(id: string): Promise<boolean> {
  await api.delete(`${API_ENDPOINTS.PROJECTS}/${id}`);
  projectsCache = projectsCache.filter((project) => project.id !== id);
  return true;
}

export const projectService = {
  getAllProjects,
  getProjectById,
  getProjectStats,
  filterProjects,
  getManagers,
  createProject,
  updateProject,
  deleteProject,
};
