import { allocationService } from '@/features/allocations/Services/allocationService';
import type { PlannerAllocation, PlannerFilters, PlannerStats } from '../types/planner.types';

let allocationsCache: PlannerAllocation[] = [];

async function getAllAllocations(): Promise<PlannerAllocation[]> {
  const allocations = await allocationService.getAllAllocations();
  allocationsCache = allocations.map((allocation) => ({
    id: allocation.id,
    employeeId: allocation.employeeId,
    employee: allocation.employee,
    department: 'Live allocation',
    role: allocation.role,
    skill: allocation.role,
    project: allocation.project,
    startDate: allocation.start,
    endDate: allocation.end,
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

function filterAllocations(filters: PlannerFilters): PlannerAllocation[] {
  let filtered = [...allocationsCache];
  const search = filters.search.trim().toLowerCase();

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

export const plannerService = {
  getAllAllocations,
  getStats,
  filterAllocations,
};
