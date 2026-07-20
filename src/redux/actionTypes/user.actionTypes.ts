export const USER_ACTION_TYPES = {
  FETCH_USERS_REQUEST: 'users/fetchUsersRequest',
  FETCH_USERS_SUCCESS: 'users/fetchUsersSuccess',
  FETCH_USERS_FAILURE: 'users/fetchUsersFailure',

  DELETE_USER_REQUEST: 'users/deleteUserRequest',
  DELETE_USER_SUCCESS: 'users/deleteUserSuccess',
  DELETE_USER_FAILURE: 'users/deleteUserFailure',

  CLEAR_USERS: 'users/clearUsers',
} as const;
