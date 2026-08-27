import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { userService } from '@/api/services/user.service';
import type { AsyncState, ApiError } from '@/types/common.types';
import type { UserSummary } from '@/types/user.types';

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

export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (id: number, { rejectWithValue }) => {
    try {
      await userService.deleteUser(id);
      return id;
    } catch (error) {
      const apiError = error as ApiError;
      return rejectWithValue(apiError);
    }
  },
);

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearUsers: (state) => {
      state.data = [];
      state.status = 'idle';
      state.error = null;
      state.initialized = false;
    },
  },
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
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.data = state.data.filter((user) => user.id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.error = action.payload as ApiError;
      });
  },
});

export const { clearUsers } = usersSlice.actions;
export default usersSlice.reducer;
