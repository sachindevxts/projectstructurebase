import type { Allocation, AllocationStats, AllocationFormData } from '../Types/allocation.types';
import allocationData from '@/dummyJson/allocations/allocation-list.json';
import employeesData from '@/dummyJson/employees/employee-list.json';
import projectsData from '@/dummyJson/projects/project-list.json';

class AllocationService {
  private allocations: Allocation[] = [];

  constructor() {
    this.allocations = allocationData.allocations.map((a: any, index: number) => ({
      ...a,
      id: `alloc-${index + 1}`,
      employeeId: `EMP-00${index + 1}`,
      projectId: `PRJ-00${index + 1}`,
    })) as Allocation[];
  }

  getAllAllocations(): Allocation[] {
    return this.allocations;
  }

  getAllocationStats(): AllocationStats {
    const allocations = this.allocations;
    const total = allocations.length;
    const active = allocations.filter(a => a.status === 'Active').length;
    const overallocated = allocations.filter(a => a.status === 'Overallocated').length;
    const releasingSoon = allocations.filter(a => a.status === 'Releasing Soon').length;

    return { total, active, overallocated, releasingSoon };
  }

  filterAllocations(search: string): Allocation[] {
    if (!search) return this.allocations;
    const searchLower = search.toLowerCase();
    return this.allocations.filter(a =>
      a.employee.toLowerCase().includes(searchLower) ||
      a.project.toLowerCase().includes(searchLower)
    );
  }

  getAllocationFormData(): AllocationFormData {
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

  createAllocation(data: AllocationFormData): Allocation {
    const employee = employeesData.employees.find(e => e.id === data.employeeId);
    const project = projectsData.projects.find(p => p.id === data.projectId);

    const newAllocation: Allocation = {
      id: `alloc-${Date.now()}`,
      employee: employee?.name || 'Unknown Employee',
      employeeId: data.employeeId,
      project: project?.name || 'Unknown Project',
      projectId: data.projectId,
      role: data.role,
      start: data.startDate,
      end: data.endDate,
      allocation: data.allocationPercentage,
      capacity: `${100 - data.allocationPercentage}%`,
      billability: data.billability,
      status: data.allocationPercentage > 100 ? 'Overallocated' : 'Active',
    };

    this.allocations = [newAllocation, ...this.allocations];
    return newAllocation;
  }

  updateAllocation(id: string, updates: Partial<Allocation>): Allocation | null {
    const index = this.allocations.findIndex(a => a.id === id);
    if (index === -1) return null;

    const updatedAllocation = { ...this.allocations[index], ...updates };
    this.allocations[index] = updatedAllocation;
    return updatedAllocation;
  }

  deleteAllocation(id: string): boolean {
    const initialLength = this.allocations.length;
    this.allocations = this.allocations.filter(a => a.id !== id);
    return this.allocations.length < initialLength;
  }

  getAvailableEmployees(): any[] {
    return employeesData.employees.filter(e => e.allocation < 100);
  }

  getProjects(): any[] {
    return projectsData.projects;
  }
}

export const allocationService = new AllocationService();