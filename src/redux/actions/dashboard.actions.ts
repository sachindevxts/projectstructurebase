import type { AppThunk } from '../store';
import { clearDashboardState, fetchDashboardSummary } from '../slices/dashboardSlice';

export const fetchDashboard = (): AppThunk<Promise<void>> => async (dispatch) => {
  await dispatch(fetchDashboardSummary());
};

export const clearDashboard = clearDashboardState;
