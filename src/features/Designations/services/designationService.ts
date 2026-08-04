import type { Designation, DesignationFilters, DesignationStats } from '../types/designation.types';
import designationData from '@/dummyJson/designations/designation-list.json';

class DesignationService {
  private designations: Designation[] = [];

  constructor() {
    this.designations = designationData.designations as Designation[];
  }

  getAllDesignations(): Designation[] {
    return this.designations;
  }

  getDesignationById(id: string): Designation | undefined {
    return this.designations.find((designation) => designation.id === id);
  }

  getDesignationStats(): DesignationStats {
    const total = this.designations.length;
    const totalEmployees = this.designations.reduce((sum, designation) => sum + designation.employees, 0);
    const seniorityLevels = new Set(this.designations.map((designation) => designation.level)).size;
    const unmapped = this.designations.filter((designation) => designation.employees === 0).length;

    return { total, totalEmployees, seniorityLevels, unmapped };
  }

  filterDesignations(filters: DesignationFilters): Designation[] {
    let filtered = [...this.designations];
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

  createDesignation(designation: Omit<Designation, 'id'>): Designation {
    const newDesignation = { ...designation, id: `des-${Date.now()}` };
    this.designations = [newDesignation, ...this.designations];
    return newDesignation;
  }

  updateDesignation(id: string, updates: Partial<Designation>): Designation | null {
    const index = this.designations.findIndex((designation) => designation.id === id);
    if (index === -1) return null;

    const updatedDesignation = { ...this.designations[index], ...updates };
    this.designations[index] = updatedDesignation;
    return updatedDesignation;
  }

  deleteDesignation(id: string): boolean {
    const initialLength = this.designations.length;
    this.designations = this.designations.filter((designation) => designation.id !== id);
    return this.designations.length < initialLength;
  }
}

export const designationService = new DesignationService();
