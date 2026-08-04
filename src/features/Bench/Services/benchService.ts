import type { BenchEmployee, BenchStats, BenchSkill } from '../types/bench.types';
import employeesData from '@/dummyJson/employees/employee-list.json';

class BenchService {
  private employees: BenchEmployee[] = [];

  constructor() {
    this.employees = employeesData.employees.map((e: any) => ({
      ...e,
      primarySkills: ['React.js', 'TypeScript', 'Node.js'],
      availableCapacity: 100 - e.allocation,
      benchDays: e.allocation === 0 ? Math.floor(Math.random() * 60) + 10 : 0,
      risk: e.allocation === 0 ? 'High' : e.allocation < 50 ? 'Medium' : 'Low',
      status: e.allocation === 0 ? 'Fully Available' : e.allocation < 100 ? 'Partially Available' : 'Releasing Soon',
    })) as BenchEmployee[];
  }

  getBenchEmployees(): BenchEmployee[] {
    return this.employees;
  }

  getBenchStats(): BenchStats {
    const employees = this.employees;
    const fullyAvailable = employees.filter(e => e.status === 'Fully Available').length;
    const partiallyAvailable = employees.filter(e => e.status === 'Partially Available').length;
    const releasingSoon = employees.filter(e => e.status === 'Releasing Soon').length;
    const benchOver15Days = employees.filter(e => e.benchDays > 15).length;
    const benchOver30Days = employees.filter(e => e.benchDays > 30).length;
    const benchOver60Days = employees.filter(e => e.benchDays > 60).length;

    return {
      fullyAvailable,
      partiallyAvailable,
      releasingSoon,
      benchOver15Days,
      benchOver30Days,
      benchOver60Days,
    };
  }

  getBenchSkills(): BenchSkill[] {
    const skills = ['React', 'Node', 'Java', 'Python', 'QA', 'DevOps'];
    return skills.map(name => ({
      name,
      count: Math.floor(Math.random() * 8) + 1,
    }));
  }

  filterBenchEmployees(search: string): BenchEmployee[] {
    if (!search) return this.employees;
    const searchLower = search.toLowerCase();
    return this.employees.filter(e =>
      e.name.toLowerCase().includes(searchLower)
    );
  }
}

export const benchService = new BenchService();