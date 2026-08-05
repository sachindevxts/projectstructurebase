export const REPORT_PERIODS = ['This Month', 'Last Month', 'Quarter to Date', 'Year to Date'] as const;
export const REPORT_DEPARTMENTS = ['All', 'Engineering', 'QA', 'Design', 'HR'] as const;
export const REPORT_TYPES = ['Workforce', 'Utilization', 'Allocation', 'Bench'] as const;

export const REPORT_COLORS = {
  billable: 'var(--color-info)',
  bench: 'var(--color-warning-light)',
  overallocated: 'var(--color-error)',
  utilization: 'var(--color-success-light)',
  internal: 'var(--color-accent-purple)',
};
