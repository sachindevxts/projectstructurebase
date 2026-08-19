import { allocationService } from '@/features/allocations/Services/allocationService';
import { employeeService } from '@/features/Employees/Services/employeeService';
import type { PlannerAllocation, PlannerFilters, PlannerRange, PlannerStats } from '../types/planner.types';

let allocationsCache: PlannerAllocation[] = [];

async function getAllAllocations(): Promise<PlannerAllocation[]> {
  const [allocations, employees] = await Promise.all([
    allocationService.getAllAllocations(),
    employeeService.getAllEmployees(),
  ]);
  const employeesById = new Map(employees.map((employee) => [employee.id, employee]));
  allocationsCache = allocations.map((allocation) => ({
    id: allocation.id,
    employeeId: allocation.employeeId,
    employee: allocation.employee,
    department: employeesById.get(allocation.employeeId)?.department ?? 'Unassigned',
    role: allocation.role,
    skill: employeesById.get(allocation.employeeId)?.designation ?? allocation.role,
    project: allocation.project,
    startDate: allocation.startDate,
    endDate: allocation.endDate || allocation.startDate,
    allocation: allocation.allocation,
    billability: allocation.billability,
    status:
      allocation.status === 'Overallocated'
        ? 'Overallocated'
        : allocation.allocation >= 100
          ? 'Fully Allocated'
          : allocation.billability,
  }));
  return allocationsCache;
}

function getStats(allocations = allocationsCache): PlannerStats {
  return {
    totalAllocations: allocations.length,
    fullyAllocated: allocations.filter((allocation) => allocation.status === 'Fully Allocated')
      .length,
    tentative: allocations.filter((allocation) => allocation.status === 'Releasing Soon').length,
    atRisk: allocations.filter((allocation) => allocation.status === 'Overallocated').length,
  };
}

function overlapsRange(allocation: PlannerAllocation, range?: PlannerRange): boolean {
  if (!range) return true;
  const allocationStart = new Date(`${allocation.startDate}T00:00:00`).getTime();
  const allocationEnd = new Date(`${allocation.endDate || allocation.startDate}T00:00:00`).getTime();
  const rangeStart = new Date(`${range.startDate}T00:00:00`).getTime();
  const rangeEnd = new Date(`${range.endDate}T00:00:00`).getTime();
  return allocationStart <= rangeEnd && allocationEnd >= rangeStart;
}

function filterAllocations(
  filters: PlannerFilters,
  range?: PlannerRange,
  allocations = allocationsCache,
): PlannerAllocation[] {
  let filtered = [...allocations];
  const search = filters.search.trim().toLowerCase();

  filtered = filtered.filter((allocation) => overlapsRange(allocation, range));

  if (search) {
    filtered = filtered.filter((allocation) =>
      [allocation.employee, allocation.project, allocation.role, allocation.department]
        .join(' ')
        .toLowerCase()
        .includes(search),
    );
  }

  if (filters.department !== 'All')
    filtered = filtered.filter((allocation) => allocation.department === filters.department);
  if (filters.skill !== 'All')
    filtered = filtered.filter((allocation) => allocation.skill === filters.skill);
  if (filters.status !== 'All')
    filtered = filtered.filter((allocation) => allocation.status === filters.status);

  return filtered;
}

function getFilterOptions(allocations = allocationsCache) {
  return {
    departments: ['All', ...Array.from(new Set(allocations.map((allocation) => allocation.department))).sort()],
    skills: ['All', ...Array.from(new Set(allocations.map((allocation) => allocation.skill))).sort()],
    statuses: ['All', ...Array.from(new Set(allocations.map((allocation) => allocation.status))).sort()],
  };
}

export const plannerService = {
  getAllAllocations,
  getStats,
  filterAllocations,
  getFilterOptions,
};
