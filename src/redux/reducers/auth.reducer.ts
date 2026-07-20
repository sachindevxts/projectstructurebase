import { AUTH_ACTION_TYPES } from '../actionTypes';
import type { AuthUser, ApiError } from '@/types/common.types';
import { STORAGE_KEYS } from '@/constants/storage.constants';
import { storage } from '@/utils/storage.utils';
export interface AuthReduxState {
  user: AuthUser | null;
  loading: boolean;
  isLoading: boolean;
  isAuthenticated: boolean;
  initialized: boolean;
  error: ApiError | null;
}
const storedUser = storage.get<AuthUser | null>(STORAGE_KEYS.USER, null);
const signedOutState: AuthReduxState = {
  user: null,
  loading: false,
  isLoading: false,
  isAuthenticated: false,
  initialized: true,
  error: null,
};
const initialState: AuthReduxState = storedUser
  ? { ...signedOutState, user: storedUser, isAuthenticated: true }
  : signedOutState;
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
      return signedOutState;
    default:
      return state;
  }
}
