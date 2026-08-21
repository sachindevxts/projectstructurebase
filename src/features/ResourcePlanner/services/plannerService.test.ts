import { describe, expect, it } from 'vitest';
import type { PlannerAllocation, PlannerFilters } from '../types/planner.types';
import { plannerService } from './plannerService';

describe('plannerService.filterAllocations', () => {
  const allocations: PlannerAllocation[] = [
    {
      id: '1',
      employeeId: 'e1',
      employee: 'Alice Johnson',
      department: 'Engineering',
      role: 'Frontend Engineer',
      skill: 'React',
      project: 'Alpha',
      startDate: '2024-01-01',
      endDate: '2024-01-15',
      allocation: 100,
      billability: 'Billable',
      status: 'Fully Allocated',
    },
  ];

  it('treats an undefined search value as an empty string', () => {
    const filters: PlannerFilters = {
      search: undefined as any,
      department: 'All',
      skill: 'All',
      status: 'All',
    };

    expect(() => plannerService.filterAllocations(filters, undefined, allocations)).not.toThrow();
    expect(plannerService.filterAllocations(filters, undefined, allocations)).toEqual(allocations);
  });
});
