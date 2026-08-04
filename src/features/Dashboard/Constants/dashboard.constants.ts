import type { DashboardStat } from '../types/dashboard.types';

export const STAT_COLORS = {
  primary: '#3B82F6',
  success: '#22C55E',
  warning: '#F59E0B',
  error: '#EF4444',
  purple: '#8B5CF6',
  pink: '#EC4899',
  teal: '#14B8A6',
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
  Engineering: '#3B82F6',
  Delivery: '#22C55E',
  QA: '#F59E0B',
  Design: '#8B5CF6',
  HR: '#EC4899',
};