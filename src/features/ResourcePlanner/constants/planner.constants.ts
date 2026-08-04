export const PLANNER_DEPARTMENTS = ['All', 'Engineering', 'QA', 'Design', 'HR', 'Delivery'] as const;
export const PLANNER_SKILLS = ['All', 'React', 'Node.js', 'Java', 'QA', 'UI/UX', 'Leadership'] as const;
export const PLANNER_STATUSES = ['All', 'Billable', 'Non-Billable', 'Overallocated', 'Fully Allocated', 'Releasing Soon', 'Bench'] as const;

export const PLANNER_STATUS_COLORS: Record<string, string> = {
  Billable: '#4F5FE7',
  'Non-Billable': '#7EA2F2',
  Overallocated: '#D43F3A',
  'Fully Allocated': '#3FA34D',
  'Releasing Soon': '#D18427',
  Bench: '#E1E7F0',
};
