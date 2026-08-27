export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    ME: '/auth/me',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
  },
  DASHBOARD: {
    SUMMARY: '/dashboard/summary',
  },
  USERS: {
    BASE: '/users',
    LIST: '/users',
  },
} as const;
