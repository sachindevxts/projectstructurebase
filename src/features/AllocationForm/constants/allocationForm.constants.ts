export const ALLOCATION_ROLES = ['Developer', 'Senior Developer', 'Tech Lead', 'QA Engineer', 'UI Designer', 'Project Manager'] as const;
export const BILLABILITY_OPTIONS = ['Billable', 'Non-Billable'] as const;

export const INITIAL_ALLOCATION_FORM = {
  employeeId: '',
  projectId: '',
  role: '',
  allocationPercentage: 50,
  startDate: new Date().toISOString().split('T')[0],
  endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  billability: 'Billable' as const,
  notes: '',
};
