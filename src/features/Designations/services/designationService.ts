import { unwrapApiData, type ApiEnvelope } from '@/api/apiResponse';
import { api } from '@/api/client/apiClient';
import { API_ENDPOINTS } from '@/constants/api.constants';
import type { Designation, DesignationFilters, DesignationStats } from '../types/designation.types';

interface BackendDesignation {
  id: string;
  name: string;
  code: string;
  isActive: boolean;
}

interface BackendEmployee {
  designationId?: string | null;
}

function inferLevel(name: string): Designation['level'] {
  const normalized = name.toLowerCase();
  if (normalized.includes('manager')) return 'Manager';
  if (normalized.includes('lead')) return 'Lead';
  if (normalized.includes('senior')) return 'Senior';
  if (normalized.includes('junior') || normalized.includes('intern')) return 'Junior';
  return 'Mid-level';
}

let designationsCache: Designation[] = [];

async function getAllDesignations(): Promise<Designation[]> {
  const [designationsResponse, employeesResponse] = await Promise.all([
    api.get<ApiEnvelope<BackendDesignation[]>>(API_ENDPOINTS.DESIGNATIONS),
    api.get<ApiEnvelope<BackendEmployee[]>>(API_ENDPOINTS.EMPLOYEE_LOOKUP),
  ]);

  const employeesByDesignation = unwrapApiData(employeesResponse.data).reduce(
    (acc, employee) => {
      if (employee.designationId) {
        acc[employee.designationId] = (acc[employee.designationId] ?? 0) + 1;
      }
      return acc;
    },
    {} as Record<string, number>,
  );

  designationsCache = unwrapApiData(designationsResponse.data).map((designation) => ({
    id: designation.id,
    name: designation.name,
    department: 'All departments',
    level: inferLevel(designation.name),
    employees: employeesByDesignation[designation.id] ?? 0,
    skills: [],
    status: designation.isActive ? 'Active' : 'Inactive',
    description: designation.code,
  }));

  return designationsCache;
}

async function getDesignationById(id: string): Promise<Designation | undefined> {
  if (!designationsCache.length) await getAllDesignations();
  return designationsCache.find((designation) => designation.id === id);
}

function getDesignationStats(designations = designationsCache): DesignationStats {
  return {
    total: designations.length,
    totalEmployees: designations.reduce((sum, designation) => sum + designation.employees, 0),
    seniorityLevels: new Set(designations.map((designation) => designation.level)).size,
    unmapped: designations.filter((designation) => designation.employees === 0).length,
  };
}

function filterDesignations(filters: DesignationFilters): Designation[] {
  let filtered = [...designationsCache];
  const search = filters.search.trim().toLowerCase();

  if (search) {
    filtered = filtered.filter((designation) =>
      [designation.name, designation.department, designation.description ?? '', ...designation.skills]
        .join(' ')
        .toLowerCase()
        .includes(search),
    );
  }

  if (filters.department && filters.department !== 'All') {
    filtered = filtered.filter((designation) => designation.department === filters.department);
  }

  if (filters.level && filters.level !== 'All') {
    filtered = filtered.filter((designation) => designation.level === filters.level);
  }

  if (filters.status && filters.status !== 'All') {
    filtered = filtered.filter((designation) => designation.status === filters.status);
  }

  return filtered;
}

async function createDesignation(designation: Omit<Designation, 'id'>): Promise<Designation> {
  await api.post(API_ENDPOINTS.DESIGNATIONS, {
    name: designation.name,
    code: (designation.description || designation.name)
      .replace(/[^a-z0-9]/gi, '')
      .slice(0, 8)
      .toUpperCase(),
    description: designation.description,
  });
  const designations = await getAllDesignations();
  return designations[0];
}

async function updateDesignation(id: string, updates: Partial<Designation>): Promise<Designation | null> {
  await api.patch(`${API_ENDPOINTS.DESIGNATIONS}/${id}`, {
    name: updates.name,
    code: updates.description
      ?.replace(/[^a-z0-9]/gi, '')
      .slice(0, 8)
      .toUpperCase(),
    description: updates.description,
  });
  await getAllDesignations();
  return designationsCache.find((designation) => designation.id === id) ?? null;
}

async function deleteDesignation(id: string): Promise<boolean> {
  await api.delete(`${API_ENDPOINTS.DESIGNATIONS}/${id}`);
  designationsCache = designationsCache.filter((designation) => designation.id !== id);
  return true;
}

export const designationService = {
  getAllDesignations,
  getDesignationById,
  getDesignationStats,
  filterDesignations,
  createDesignation,
  updateDesignation,
  deleteDesignation,
};
