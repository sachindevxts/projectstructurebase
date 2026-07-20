import { USER_ACTION_TYPES } from '@/redux/actionTypes/user.actionTypes';
import type { ApiError } from '@/types/common.types';
import type { UserSummary } from '@/types/user.types';

export interface UserState {
  users: UserSummary[];
  selectedUser: UserSummary | null;
  loading: boolean;
  initialized: boolean;
  submitting: boolean;
  error: ApiError | null;
}

const initialState: UserState = {
  users: [],
  selectedUser: null,
  loading: false,
  initialized: false,
  submitting: false,
  error: null,
};

export function userReducer(state = initialState, action: any): UserState {
  switch (action.type) {
    case USER_ACTION_TYPES.FETCH_USERS_REQUEST:
      return { ...state, loading: true, error: null };
    case USER_ACTION_TYPES.FETCH_USERS_SUCCESS:
      return { ...state, loading: false, initialized: true, users: action.payload };
    case USER_ACTION_TYPES.FETCH_USERS_FAILURE:
      return { ...state, loading: false, initialized: true, error: action.payload };
    case USER_ACTION_TYPES.DELETE_USER_REQUEST:
      return { ...state, submitting: true };
    case USER_ACTION_TYPES.DELETE_USER_SUCCESS:
      return {
        ...state,
        submitting: false,
        users: state.users.filter((u) => u.id !== action.payload),
      };
    case USER_ACTION_TYPES.DELETE_USER_FAILURE:
      return { ...state, submitting: false, error: action.payload };
    case USER_ACTION_TYPES.CLEAR_USERS:
      return initialState;
    default:
      return state;
  }
}

export default userReducer;
