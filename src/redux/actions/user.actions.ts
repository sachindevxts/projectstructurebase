import type { AppDispatch } from '../store';
import { clearUsersState, deleteUserThunk, fetchUsersThunk } from '../slices/usersSlice';

export const fetchUsers = () => async (dispatch: AppDispatch) => {
  await dispatch(fetchUsersThunk());
};

export const deleteUser = (id: string) => async (dispatch: AppDispatch) => {
  await dispatch(deleteUserThunk(id));
};

export const clearUsers = clearUsersState;
