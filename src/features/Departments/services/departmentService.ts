import type { Department, DepartmentStats } from '../types/department.types';
import departmentData from '@/dummyJson/departments/department-list.json';

class DepartmentService {
  private departments: Department[] = [];

  constructor() {
    this.departments = departmentData.departments as Department[];
  }

  getAllDepartments(): Department[] {
    return this.departments;
  }

  getDepartmentById(id: string): Department | undefined {
    return this.departments.find(d => d.id === id);
  }

  getDepartmentStats(): DepartmentStats {
    const departments = this.departments;
    const total = departments.length;
    const totalEmployees = departments.reduce((sum, d) => sum + d.employees, 0);
    const onBench = departments.reduce((sum, d) => sum + d.bench, 0);
    const avgBillability = Math.round(
      departments.reduce((sum, d) => sum + d.billability, 0) / total
    );

    return { total, totalEmployees, onBench, avgBillability };
  }

  filterDepartments(search: string): Department[] {
    if (!search) return this.departments;
    const searchLower = search.toLowerCase();
    return this.departments.filter(d =>
      d.name.toLowerCase().includes(searchLower) ||
      d.head.toLowerCase().includes(searchLower)
    );
  }

  createDepartment(department: Omit<Department, 'id'>): Department {
    const newDepartment = {
      ...department,
      id: `dep-${Date.now()}`,
    };
    this.departments = [newDepartment, ...this.departments];
    return newDepartment;
  }

  updateDepartment(id: string, updates: Partial<Department>): Department | null {
    const index = this.departments.findIndex(d => d.id === id);
    if (index === -1) return null;

    const updatedDepartment = { ...this.departments[index], ...updates };
    this.departments[index] = updatedDepartment;
    return updatedDepartment;
  }

  deleteDepartment(id: string): boolean {
    const initialLength = this.departments.length;
    this.departments = this.departments.filter(d => d.id !== id);
    return this.departments.length < initialLength;
  }
}

export const departmentService = new DepartmentService();