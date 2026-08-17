import { employeeService } from '@/features/Employees/Services/employeeService';
import type { BenchEmployee, BenchSkill, BenchStats } from '../Types/bench.types';

let employeesCache: BenchEmployee[] = [];

async function getBenchEmployees(): Promise<BenchEmployee[]> {
  const employees = await employeeService.getAllEmployees();
  employeesCache = employees
    .filter((employee) => employee.allocation < 100)
    .map((employee) => {
      const availableCapacity = 100 - employee.allocation;
      return {
        id: employee.id,
        name: employee.name,
        department: employee.department,
        designation: employee.designation,
        primarySkills: employee.skills ?? [],
        currentAllocation: employee.allocation,
        availableCapacity,
        benchDays: employee.allocation === 0 ? 30 : 0,
        risk: employee.allocation === 0 ? 'High' : availableCapacity >= 50 ? 'Medium' : 'Low',
        status:
          employee.allocation === 0
            ? 'Fully Available'
            : availableCapacity > 0
              ? 'Partially Available'
              : 'Releasing Soon',
      };
    });

  return employeesCache;
}

function getBenchStats(employees = employeesCache): BenchStats {
  return {
    fullyAvailable: employees.filter((employee) => employee.status === 'Fully Available').length,
    partiallyAvailable: employees.filter((employee) => employee.status === 'Partially Available').length,
    releasingSoon: employees.filter((employee) => employee.status === 'Releasing Soon').length,
    benchOver15Days: employees.filter((employee) => employee.benchDays > 15).length,
    benchOver30Days: employees.filter((employee) => employee.benchDays > 30).length,
    benchOver60Days: employees.filter((employee) => employee.benchDays > 60).length,
  };
}

function getBenchSkills(): BenchSkill[] {
  const counts = employeesCache.reduce(
    (acc, employee) => {
      for (const skill of employee.primarySkills) acc[skill] = (acc[skill] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );
  return Object.entries(counts).map(([name, count]) => ({ name, count }));
}

function filterBenchEmployees(search: string): BenchEmployee[] {
  if (!search) return employeesCache;
  const searchLower = search.toLowerCase();
  return employeesCache.filter((employee) =>
    [employee.name, employee.department, employee.designation].join(' ').toLowerCase().includes(searchLower),
  );
}

export const benchService = {
  getBenchEmployees,
  getBenchStats,
  getBenchSkills,
  filterBenchEmployees,
};
