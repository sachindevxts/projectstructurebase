import type { RootStateShape } from './store.types';

export const preloadedState: RootStateShape = {
  auth: {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  },
  dashboard: {
    data: { pendingApprovals: 0, activeSequences: 0, repliesThisWeek: 0, pausedSequences: 0 },
    status: 'idle',
    error: null,
    initialized: false,
  },
  users: {
    data: [],
    status: 'idle',
    error: null,
    initialized: false,
  },
  ui: {
    theme: 'system',
    sidebarOpen: false,
    notifications: [],
  },
};
