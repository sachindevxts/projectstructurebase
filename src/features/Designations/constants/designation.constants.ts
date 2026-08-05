export const DESIGNATION_LEVELS = ['Junior', 'Mid-level', 'Senior', 'Lead', 'Manager'] as const;
export const DESIGNATION_DEPARTMENTS = ['All', 'Engineering', 'QA', 'Design', 'HR', 'Delivery', 'Product', 'DevOps'] as const;
export const DESIGNATION_STATUSES = ['All', 'Active', 'Inactive'] as const;

export const DESIGNATION_LEVEL_COLORS: Record<string, string> = {
  Junior: 'var(--color-info)',
  'Mid-level': 'var(--color-success-light)',
  Senior: 'var(--color-warning-light)',
  Lead: 'var(--color-accent-purple)',
  Manager: 'var(--color-error)',
};
