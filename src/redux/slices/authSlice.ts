import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { normalizeApiError } from '@/api/errorHandler';
import type { AuthUser, ApiError } from '@/types/common.types';
import { authService } from '@/api/services/auth.service';
import { STORAGE_KEYS } from '@/constants/storage.constants';
import { storage } from '@/utils/storage.utils';

interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthReduxState {
  user: AuthUser | null;
  loading: boolean;
  isLoading: boolean;
  isAuthenticated: boolean;
  initialized: boolean;
  error: ApiError | null;
}

const storedUser = storage.get<AuthUser | null>(STORAGE_KEYS.USER, null);
const storedAccessToken = storage.get<string>(STORAGE_KEYS.ACCESS_TOKEN, '');

const signedOutState: AuthReduxState = {
  user: null,
  loading: false,
  isLoading: false,
  isAuthenticated: false,
  error: null,
  initialized: true,
};

const initialState: AuthReduxState = storedUser
  ? { ...signedOutState, user: storedUser, isAuthenticated: Boolean(storedAccessToken) }
  : signedOutState;

export const loginUser = createAsyncThunk<AuthUser, LoginPayload, { rejectValue: ApiError }>(
  'auth/login',
  async (payload: LoginPayload, { rejectWithValue }) => {
    try {
      return await authService.login(payload);
    } catch (error) {
      return rejectWithValue(normalizeApiError(error));
    }
  },
);

export const fetchCurrentUserThunk = createAsyncThunk<
  AuthUser | null,
  void,
  { rejectValue: ApiError }
>('auth/currentUser', async (_, { rejectWithValue }) => {
  try {
    return await authService.getCurrentUser();
  } catch (error) {
    return rejectWithValue(normalizeApiError(error));
  }
});

export const logoutUserThunk = createAsyncThunk('auth/logout', async () => {
  await authService.logout();
});

function setLoading(state: AuthReduxState, loading: boolean): void {
  state.loading = loading;
  state.isLoading = loading;
}

function applySignedOutState(state: AuthReduxState, error: ApiError | null = null): void {
  state.user = null;
  state.loading = false;
  state.isLoading = false;
  state.isAuthenticated = false;
  state.initialized = true;
  state.error = error;
}

function applySignedInState(state: AuthReduxState, user: AuthUser | null): void {
  state.user = user;
  state.loading = false;
  state.isLoading = false;
  state.isAuthenticated = Boolean(user);
  state.initialized = true;
  state.error = null;
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthState: (state) => {
      storage.remove(STORAGE_KEYS.ACCESS_TOKEN);
      storage.remove(STORAGE_KEYS.REFRESH_TOKEN);
      storage.remove(STORAGE_KEYS.USER);
      applySignedOutState(state);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        setLoading(state, true);
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        applySignedInState(state, action.payload);
      })
      .addCase(loginUser.rejected, (state, action) => {
        applySignedOutState(state, action.payload ?? { message: 'Login failed' });
      })
      .addCase(fetchCurrentUserThunk.pending, (state) => {
        setLoading(state, true);
        state.error = null;
      })
      .addCase(fetchCurrentUserThunk.fulfilled, (state, action) => {
        applySignedInState(state, action.payload);
      })
      .addCase(fetchCurrentUserThunk.rejected, (state, action) => {
        applySignedOutState(state, action.payload ?? { message: 'Session could not be restored' });
      })
      .addCase(logoutUserThunk.pending, (state) => {
        setLoading(state, true);
      })
      .addCase(logoutUserThunk.fulfilled, (state) => {
        applySignedOutState(state);
      })
      .addCase(logoutUserThunk.rejected, (state) => {
        applySignedOutState(state);
      });
  },
});

export const { clearAuthState } = authSlice.actions;
export default authSlice.reducer;
