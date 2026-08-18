import { employeeService } from '@/features/Employees/Services/employeeService';
import { projectService } from '@/features/Projects/Services/projectService';
import { allocationService } from '@/features/allocations/Services/allocationService';
import type {
  AllocationFormEmployee,
  AllocationFormProject,
  AllocationFormValues,
  CapacityPreviewData,
} from '../types/allocationForm.types';

let employeesCache: AllocationFormEmployee[] = [];

async function getEmployees(): Promise<AllocationFormEmployee[]> {
  const employees = await employeeService.getAllEmployees();
  employeesCache = employees.map((employee) => ({
    id: employee.id,
    name: employee.name,
    department: employee.department,
    designation: employee.designation,
    allocation: employee.allocation,
  }));
  return employeesCache;
}

async function getProjects(): Promise<AllocationFormProject[]> {
  const projects = await projectService.getAllProjects();
  return projects.map((project) => ({
    id: project.id,
    name: project.name,
    client: project.client,
    manager: project.manager,
    status: project.status,
  }));
}

function getCapacityPreview(values: AllocationFormValues): CapacityPreviewData {
  const employee = employeesCache.find((item) => item.id === values.employeeId);
  const currentAllocation = employee?.allocation ?? 0;
  const requestedAllocation = Number(values.allocationPercentage) || 0;
  const projectedAllocation = currentAllocation + requestedAllocation;
  const remainingCapacity = 100 - projectedAllocation;
  const status =
    projectedAllocation > 100
      ? 'Overallocated'
      : projectedAllocation === 100
        ? 'Fully Allocated'
        : 'Available';

  return {
    currentAllocation,
    requestedAllocation,
    remainingCapacity,
    projectedAllocation,
    status,
  };
}

function validate(values: AllocationFormValues): string[] {
  const errors: string[] = [];
  if (!values.employeeId) errors.push('Employee is required');
  if (!values.projectId) errors.push('Project is required');
  if (!values.role) errors.push('Role is required');
  if (values.allocationPercentage <= 0) errors.push('Allocation must be greater than zero');
  if (values.startDate && values.endDate && values.startDate > values.endDate)
    errors.push('End date must be after start date');
  return errors;
}

async function save(values: AllocationFormValues): Promise<AllocationFormValues> {
  await allocationService.createAllocation({
    employeeId: values.employeeId,
    projectId: values.projectId,
    role: values.role,
    allocationPercentage: values.allocationPercentage,
    startDate: values.startDate,
    endDate: values.endDate,
    billability: values.billability,
    notes: values.notes,
  });
  return values;
}

export const allocationFormService = {
  getEmployees,
  getProjects,
  getCapacityPreview,
  validate,
  save,
};
