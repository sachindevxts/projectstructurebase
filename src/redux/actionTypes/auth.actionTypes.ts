export const AUTH_ACTION_TYPES = {
  LOGIN_REQUEST: 'auth/loginRequest',
  LOGIN_SUCCESS: 'auth/loginSuccess',
  LOGIN_FAILURE: 'auth/loginFailure',
  CURRENT_USER_REQUEST: 'auth/currentUserRequest',
  CURRENT_USER_SUCCESS: 'auth/currentUserSuccess',
  CURRENT_USER_FAILURE: 'auth/currentUserFailure',
  LOGOUT: 'auth/logout',
} as const;
