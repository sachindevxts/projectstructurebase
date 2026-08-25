import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { ApiError } from '@/types/common.types';
import { dashboardService } from '@/api/services/dashboard.service';

export interface DashboardReduxState {
  data: { totalProducts: number; totalUsers: number };
  loading: boolean;
  initialized: boolean;
  error: ApiError | null;
}

const initialState: DashboardReduxState = {
  data: { totalProducts: 0, totalUsers: 0 },
  loading: false,
  error: null,
  initialized: false,
};

export const fetchDashboardSummary = createAsyncThunk(
  'dashboard/fetchSummary',
  async (_, { rejectWithValue }) => {
    try {
      return await dashboardService.getSummary();
    } catch (error) {
      const apiError = error as ApiError;
      return rejectWithValue(apiError);
    }
  },
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    clearDashboardState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.initialized = true;
        state.data = action.payload;
      })
      .addCase(fetchDashboardSummary.rejected, (state, action) => {
        state.loading = false;
        state.initialized = true;
        state.error = action.payload as ApiError;
      });
  },
});

export const { clearDashboardState } = dashboardSlice.actions;
export default dashboardSlice.reducer;
