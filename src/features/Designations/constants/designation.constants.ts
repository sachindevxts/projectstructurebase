export const DESIGNATION_LEVELS = ['Junior', 'Mid-level', 'Senior', 'Lead', 'Manager'] as const;
export const DESIGNATION_DEPARTMENTS = ['All', 'Engineering', 'QA', 'Design', 'HR', 'Delivery', 'Product', 'DevOps'] as const;
export const DESIGNATION_STATUSES = ['All', 'Active', 'Inactive'] as const;

export const DESIGNATION_LEVEL_COLORS: Record<string, string> = {
  Junior: '#3B82F6',
  'Mid-level': '#22C55E',
  Senior: '#F59E0B',
  Lead: '#8B5CF6',
  Manager: '#EF4444',
};
