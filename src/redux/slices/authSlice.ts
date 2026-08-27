import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { authService } from '@/api/services/auth.service';
import type { AuthState, LoginPayload } from '@/types/auth.types';
import type { ApiError } from '@/types/common.types';

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

const resetAuthState = (state: AuthState) => {
  state.user = null;
  state.isAuthenticated = false;
  state.isLoading = false;
  state.error = null;
};

export const login = createAsyncThunk(
  'auth/login',
  async (payload: LoginPayload, { rejectWithValue }) => {
    try {
      return await authService.login(payload);
    } catch (error) {
      const apiError = error as ApiError;
      return rejectWithValue(apiError.message);
    }
  },
);

export const bootstrapAuth = createAsyncThunk('auth/bootstrap', async (_, { rejectWithValue }) => {
  try {
    return await authService.getCurrentUser();
  } catch (error) {
    const apiError = error as ApiError;
    return rejectWithValue(apiError.message);
  }
});

export const logout = createAsyncThunk('auth/logout', async () => {
  await authService.logout();
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthState: resetAuthState,
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
      .addCase(bootstrapAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(bootstrapAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = Boolean(action.payload);
        state.user = action.payload;
      })
      .addCase(bootstrapAuth.rejected, (state) => {
        resetAuthState(state);
      })
      .addCase(logout.fulfilled, (state) => {
        resetAuthState(state);
      })
      .addCase(logout.rejected, (state) => {
        resetAuthState(state);
      });
  },
});

export const { clearAuthState } = authSlice.actions;
export default authSlice.reducer;
