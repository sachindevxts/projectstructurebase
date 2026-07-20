import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { AsyncState, ApiError } from '@/types/common.types';
import { dashboardService } from '@/api/services/dashboard.service';

const initialState: AsyncState<{ totalProducts: number; totalUsers: number }> = {
  data: { totalProducts: 0, totalUsers: 0 },
  status: 'idle',
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
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardSummary.pending, (state) => {
        state.status = 'loading';
        state.error = null;
        state.initialized = true;
      })
      .addCase(fetchDashboardSummary.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchDashboardSummary.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as ApiError;
      });
  },
});

export default dashboardSlice.reducer;
