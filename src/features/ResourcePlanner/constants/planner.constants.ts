export const PLANNER_DEPARTMENTS = ['All', 'Engineering', 'QA', 'Design', 'HR', 'Delivery'] as const;
export const PLANNER_SKILLS = ['All', 'React', 'Node.js', 'Java', 'QA', 'UI/UX', 'Leadership'] as const;
export const PLANNER_STATUSES = ['All', 'Billable', 'Non-Billable', 'Overallocated', 'Fully Allocated', 'Releasing Soon', 'Bench'] as const;

export const PLANNER_STATUS_COLORS: Record<string, string> = {
  Billable: 'var(--color-primary)',
  'Non-Billable': 'var(--color-info-light)',
  Overallocated: 'var(--color-error)',
  'Fully Allocated': 'var(--color-success)',
  'Releasing Soon': 'var(--color-warning)',
  Bench: 'var(--color-border)',
};
