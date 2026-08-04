export const REPORT_PERIODS = ['This Month', 'Last Month', 'Quarter to Date', 'Year to Date'] as const;
export const REPORT_DEPARTMENTS = ['All', 'Engineering', 'QA', 'Design', 'HR'] as const;
export const REPORT_TYPES = ['Workforce', 'Utilization', 'Allocation', 'Bench'] as const;

export const REPORT_COLORS = {
  billable: '#3B82F6',
  bench: '#F59E0B',
  overallocated: '#EF4444',
  utilization: '#22C55E',
  internal: '#8B5CF6',
};
