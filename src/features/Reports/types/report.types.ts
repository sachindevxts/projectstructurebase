export interface ReportMetrics {
  headcount: number;
  billable: number;
  bench: number;
  utilization: number;
}

export interface DepartmentUtilization {
  department: string;
  utilization: number;
  employees: number;
}

export interface MonthlyTrend {
  month: string;
  billable: number;
  bench: number;
  overallocated: number;
}

export interface AllocationMix {
  name: string;
  value: number;
}

export interface ReportData {
  metrics: ReportMetrics;
  departmentUtilization: DepartmentUtilization[];
  monthlyTrend: MonthlyTrend[];
  allocationMix: AllocationMix[];
}

export interface ReportFilters {
  period: string;
  department: string;
  reportType: string;
}
