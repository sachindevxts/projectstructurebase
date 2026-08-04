import plannerData from '@/dummyJson/resourcePlanner/planner-list.json';
import type { PlannerAllocation, PlannerFilters, PlannerStats } from '../types/planner.types';

class PlannerService {
  private allocations: PlannerAllocation[] = [];

  constructor() {
    this.allocations = plannerData.allocations as PlannerAllocation[];
  }

  getAllAllocations(): PlannerAllocation[] {
    return this.allocations;
  }

  getStats(): PlannerStats {
    return {
      totalAllocations: this.allocations.length,
      fullyAllocated: this.allocations.filter((allocation) => allocation.status === 'Fully Allocated').length,
      tentative: this.allocations.filter((allocation) => allocation.status === 'Releasing Soon').length,
      atRisk: this.allocations.filter((allocation) => allocation.status === 'Overallocated').length,
    };
  }

  filterAllocations(filters: PlannerFilters): PlannerAllocation[] {
    let filtered = [...this.allocations];
    const search = filters.search.trim().toLowerCase();

    if (search) {
      filtered = filtered.filter((allocation) =>
        [allocation.employee, allocation.project, allocation.role, allocation.department].join(' ').toLowerCase().includes(search),
      );
    }

    if (filters.department !== 'All') filtered = filtered.filter((allocation) => allocation.department === filters.department);
    if (filters.skill !== 'All') filtered = filtered.filter((allocation) => allocation.skill === filters.skill);
    if (filters.status !== 'All') filtered = filtered.filter((allocation) => allocation.status === filters.status);

    return filtered;
  }
}

export const plannerService = new PlannerService();
