import employeesData from '@/dummyJson/employees/employee-list.json';
import projectsData from '@/dummyJson/projects/project-list.json';
import type { AllocationFormEmployee, AllocationFormProject, AllocationFormValues, CapacityPreviewData } from '../types/allocationForm.types';

class AllocationFormService {
  getEmployees(): AllocationFormEmployee[] {
    return employeesData.employees.map((employee) => ({
      id: employee.id,
      name: employee.name,
      department: employee.department,
      designation: employee.designation,
      allocation: employee.allocation,
    }));
  }

  getProjects(): AllocationFormProject[] {
    return projectsData.projects.map((project) => ({
      id: project.id,
      name: project.name,
      client: project.client,
      manager: project.manager,
      status: project.status,
    }));
  }

  getCapacityPreview(values: AllocationFormValues): CapacityPreviewData {
    const employee = this.getEmployees().find((item) => item.id === values.employeeId);
    const currentAllocation = employee?.allocation ?? 0;
    const requestedAllocation = Number(values.allocationPercentage) || 0;
    const projectedAllocation = currentAllocation + requestedAllocation;
    const remainingCapacity = 100 - projectedAllocation;
    const status = projectedAllocation > 100 ? 'Overallocated' : projectedAllocation === 100 ? 'Fully Allocated' : 'Available';

    return { currentAllocation, requestedAllocation, remainingCapacity, projectedAllocation, status };
  }

  validate(values: AllocationFormValues): string[] {
    const errors: string[] = [];
    if (!values.employeeId) errors.push('Employee is required');
    if (!values.projectId) errors.push('Project is required');
    if (!values.role) errors.push('Role is required');
    if (values.allocationPercentage <= 0) errors.push('Allocation must be greater than zero');
    if (values.startDate && values.endDate && values.startDate > values.endDate) errors.push('End date must be after start date');
    return errors;
  }

  save(values: AllocationFormValues): AllocationFormValues {
    return values;
  }
}

export const allocationFormService = new AllocationFormService();
