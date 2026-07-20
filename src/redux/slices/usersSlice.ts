import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { AsyncState, ApiError } from '@/types/common.types';
import type { UserSummary } from '@/types/user.types';
import { userService } from '@/api/services/user.service';

const initialState: AsyncState<UserSummary[]> = {
  data: [],
  status: 'idle',
  error: null,
  initialized: false,
};

export const fetchUsers = createAsyncThunk('users/fetchUsers', async (_, { rejectWithValue }) => {
  try {
    return await userService.getUsers();
  } catch (error) {
    const apiError = error as ApiError;
    return rejectWithValue(apiError);
  }
});

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = 'loading';
        state.error = null;
        state.initialized = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as ApiError;
      });
  },
});

export default usersSlice.reducer;
