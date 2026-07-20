import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { AuthState } from '@/types/auth.types';
import type { ApiError } from '@/types/common.types';
import { authService } from '@/api/services/auth.service';
import { STORAGE_KEYS } from '@/constants/storage.constants';
import { storage } from '@/utils/storage.utils';

interface LoginPayload {
  username: string;
  password: string;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

export const login = createAsyncThunk(
  'auth/login',
  async (payload: LoginPayload, { rejectWithValue }) => {
    try {
      const user = await authService.login(payload);
      storage.set(STORAGE_KEYS.ACCESS_TOKEN, 'demo-token');
      storage.set(STORAGE_KEYS.USER, user);
      return user;
    } catch (error) {
      const apiError = error as ApiError;
      return rejectWithValue(apiError.message);
    }
  },
);

export const bootstrapAuth = createAsyncThunk('auth/bootstrap', async (_, { rejectWithValue }) => {
  try {
    const storedUser = storage.get<any>(STORAGE_KEYS.USER, null);
    if (!storedUser) {
      return null;
    }
    return storedUser;
  } catch (error) {
    const apiError = error as ApiError;
    return rejectWithValue(apiError.message);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      storage.remove(STORAGE_KEYS.ACCESS_TOKEN);
      storage.remove(STORAGE_KEYS.REFRESH_TOKEN);
      storage.remove(STORAGE_KEYS.USER);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.error = action.payload as string;
      })
      .addCase(bootstrapAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = !!action.payload;
        state.user = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
