import type { RootStateShape } from './store.types';

export const preloadedState: RootStateShape = {
  auth: {
    user: null,
    loading: false,
    isAuthenticated: false,
    isLoading: false,
    initialized: true,
    error: null,
  },
  dashboard: {
    data: { totalProducts: 0, totalUsers: 0 },
    loading: false,
    error: null,
    initialized: false,
  },
  users: {
    users: [],
    selectedUser: null,
    loading: false,
    submitting: false,
    error: null,
    initialized: false,
  },
  ui: {
    theme: 'system',
    sidebarOpen: false,
    notifications: [],
  },
};
