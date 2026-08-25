import type { LoginPayload } from '@/types/auth.types';
import type { AppThunk } from '../store';
import {
  fetchCurrentUserThunk,
  loginUser,
  logoutUserThunk,
} from '../slices/authSlice';

export const login =
  (payload: LoginPayload): AppThunk<Promise<boolean>> =>
  async (dispatch) => {
    const result = await dispatch(loginUser(payload));
    return loginUser.fulfilled.match(result);
  };

export const fetchCurrentUser = (): AppThunk<Promise<void>> => async (dispatch) => {
  await dispatch(fetchCurrentUserThunk());
};

export const logout = (): AppThunk<Promise<void>> => async (dispatch) => {
  await dispatch(logoutUserThunk());
};
