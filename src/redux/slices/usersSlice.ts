import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { normalizeApiError } from '@/api/errorHandler';
import type { ApiError } from '@/types/common.types';
import type { UserSummary } from '@/types/user.types';
import { userService } from '@/api/services/user.service';

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

export const fetchUsersThunk = createAsyncThunk<
  UserSummary[],
  void,
  { rejectValue: ApiError }
>('users/fetchUsers', async (_, { rejectWithValue }) => {
  try {
    return await userService.getUsers();
  } catch (error) {
    return rejectWithValue(normalizeApiError(error));
  }
});

export const deleteUserThunk = createAsyncThunk<string, string, { rejectValue: ApiError }>(
  'users/deleteUser',
  async (id, { rejectWithValue }) => {
    try {
      await userService.deleteUser(id);
      return id;
    } catch (error) {
      return rejectWithValue(normalizeApiError(error));
    }
  },
);

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearUsersState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsersThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsersThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.initialized = true;
        state.users = action.payload;
      })
      .addCase(fetchUsersThunk.rejected, (state, action) => {
        state.loading = false;
        state.initialized = true;
        state.error = action.payload as ApiError;
      })
      .addCase(deleteUserThunk.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(deleteUserThunk.fulfilled, (state, action) => {
        state.submitting = false;
        state.users = state.users.filter((user) => user.id !== action.payload);
      })
      .addCase(deleteUserThunk.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload as ApiError;
      });
  },
});

export const { clearUsersState } = usersSlice.actions;
export default usersSlice.reducer;
