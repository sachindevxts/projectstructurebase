import type { AppDispatch } from '../store';
import { USER_ACTION_TYPES } from '@/redux/actionTypes/user.actionTypes';
import { userService } from '@/api/services/user.service';
import { normalizeApiError } from '@/api/errorHandler';

export const fetchUsers = () => async (dispatch: AppDispatch) => {
  dispatch({ type: USER_ACTION_TYPES.FETCH_USERS_REQUEST });
  try {
    const data = await userService.getUsers();
    dispatch({ type: USER_ACTION_TYPES.FETCH_USERS_SUCCESS, payload: data });
  } catch (err) {
    dispatch({ type: USER_ACTION_TYPES.FETCH_USERS_FAILURE, payload: normalizeApiError(err) });
  }
};

export const deleteUser = (id: number) => async (dispatch: AppDispatch) => {
  dispatch({ type: USER_ACTION_TYPES.DELETE_USER_REQUEST, payload: id });
  try {
    await userService.deleteUser(id);
    dispatch({ type: USER_ACTION_TYPES.DELETE_USER_SUCCESS, payload: id });
  } catch (err) {
    dispatch({ type: USER_ACTION_TYPES.DELETE_USER_FAILURE, payload: normalizeApiError(err) });
  }
};

export const clearUsers = () => ({ type: USER_ACTION_TYPES.CLEAR_USERS });
