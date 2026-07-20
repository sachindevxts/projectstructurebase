import type { RootStateShape } from './store.types';

export const preloadedState: RootStateShape = {
  auth: {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  },
  dashboard: {
    data: { totalProducts: 0, totalUsers: 0 },
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
