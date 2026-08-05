import type { DashboardStat } from '../types/dashboard.types';

export const STAT_COLORS = {
  primary: 'var(--color-info)',
  success: 'var(--color-success-light)',
  warning: 'var(--color-warning-light)',
  error: 'var(--color-error)',
  purple: 'var(--color-accent-purple)',
  pink: 'var(--color-accent-pink)',
  teal: 'var(--color-accent-teal)',
};

export const DEFAULT_STATS: DashboardStat[] = [
  {
    id: 'total-employees',
    value: 247,
    label: 'Total Employees',
    change: 8,
    trend: 'up',
    icon: '👥',
    color: STAT_COLORS.primary,
  },
  {
    id: 'active-employees',
    value: 231,
    label: 'Active',
    change: 12,
    trend: 'up',
    icon: '✅',
    color: STAT_COLORS.success,
  },
  {
    id: 'on-leave',
    value: 16,
    label: 'On Leave',
    change: -3,
    trend: 'down',
    icon: '🏖️',
    color: STAT_COLORS.warning,
  },
  {
    id: 'contractors',
    value: 32,
    label: 'Contractors',
    change: 5,
    trend: 'up',
    icon: '📋',
    color: STAT_COLORS.purple,
  },
  {
    id: 'billable',
    value: 84,
    label: 'Billable %',
    change: 2,
    trend: 'up',
    icon: '💰',
    color: STAT_COLORS.success,
  },
  {
    id: 'open-positions',
    value: 18,
    label: 'Open Positions',
    change: -4,
    trend: 'down',
    icon: '🔍',
    color: STAT_COLORS.error,
  },
];

export const DEPARTMENTS = [
  'Engineering',
  'Delivery',
  'QA',
  'Design',
  'HR',
];

export const DEPARTMENT_COLORS = {
  Engineering: 'var(--color-info)',
  Delivery: 'var(--color-success-light)',
  QA: 'var(--color-warning-light)',
  Design: 'var(--color-accent-purple)',
  HR: 'var(--color-accent-pink)',
};
