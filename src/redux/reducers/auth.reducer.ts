import { AUTH_ACTION_TYPES } from '../actionTypes';
import type { AuthUser, ApiError } from '@/types/common.types';
export interface AuthReduxState {
  user: AuthUser | null;
  loading: boolean;
  isLoading: boolean;
  isAuthenticated: boolean;
  initialized: boolean;
  error: ApiError | null;
}
const initialState: AuthReduxState = {
  user: null,
  loading: false,
  isLoading: false,
  isAuthenticated: false,
  initialized: false,
  error: null,
};
export default function authReducer(state = initialState, action: any): AuthReduxState {
  switch (action.type) {
    case AUTH_ACTION_TYPES.LOGIN_REQUEST:
    case AUTH_ACTION_TYPES.CURRENT_USER_REQUEST:
      return { ...state, loading: true, isLoading: true, error: null };
    case AUTH_ACTION_TYPES.LOGIN_SUCCESS:
    case AUTH_ACTION_TYPES.CURRENT_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        isLoading: false,
        isAuthenticated: true,
        initialized: true,
        user: action.payload,
      };
    case AUTH_ACTION_TYPES.LOGIN_FAILURE:
    case AUTH_ACTION_TYPES.CURRENT_USER_FAILURE:
      return {
        ...state,
        loading: false,
        isLoading: false,
        initialized: true,
        error: action.payload,
      };
    case AUTH_ACTION_TYPES.LOGOUT:
      return initialState;
    default:
      return state;
  }
}
