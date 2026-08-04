export const CLIENT_INDUSTRIES = ['All', 'Banking', 'Retail', 'Healthcare', 'Logistics', 'Technology', 'Manufacturing'] as const;
export const CLIENT_STATUSES = ['All', 'Active', 'Inactive'] as const;
export const CLIENT_HEALTH_OPTIONS = ['All', 'Healthy', 'Watch', 'At Risk'] as const;

export const CLIENT_HEALTH_COLORS: Record<string, 'success' | 'warning' | 'error' | 'default'> = {
  Healthy: 'success',
  Watch: 'warning',
  'At Risk': 'error',
};
