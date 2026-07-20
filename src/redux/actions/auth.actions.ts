import { authService } from '@/api/services/auth.service';
import { normalizeApiError } from '@/api/errorHandler';
import type { LoginPayload } from '@/types/auth.types';
import type { AppThunk } from '../store';
import { AUTH_ACTION_TYPES } from '../actionTypes';
import { STORAGE_KEYS } from '@/constants/storage.constants';
import { storage } from '@/utils/storage.utils';
export const login =
  (payload: LoginPayload): AppThunk<Promise<boolean>> =>
  async (dispatch) => {
    dispatch({ type: AUTH_ACTION_TYPES.LOGIN_REQUEST });
    try {
      dispatch({
        type: AUTH_ACTION_TYPES.LOGIN_SUCCESS,
        payload: await authService.login(payload),
      });
      return true;
    } catch (error) {
      dispatch({ type: AUTH_ACTION_TYPES.LOGIN_FAILURE, payload: normalizeApiError(error) });
      return false;
    }
  };
export const fetchCurrentUser = (): AppThunk => async (dispatch) => {
  dispatch({ type: AUTH_ACTION_TYPES.CURRENT_USER_REQUEST });
  try {
    dispatch({
      type: AUTH_ACTION_TYPES.CURRENT_USER_SUCCESS,
      payload: await authService.getCurrentUser(),
    });
  } catch (error) {
    dispatch({ type: AUTH_ACTION_TYPES.CURRENT_USER_FAILURE, payload: normalizeApiError(error) });
  }
};
export const logout = (): AppThunk => (dispatch) => {
  storage.remove(STORAGE_KEYS.ACCESS_TOKEN);
  storage.remove(STORAGE_KEYS.REFRESH_TOKEN);
  storage.remove(STORAGE_KEYS.USER);
  dispatch({ type: AUTH_ACTION_TYPES.LOGOUT });
};
