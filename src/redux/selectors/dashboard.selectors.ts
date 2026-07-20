import type { RootState } from '../reducers';
export const selectDashboardState = (state: RootState) => state.dashboard;
export const selectDashboard = (state: RootState) => state.dashboard.data;
export const selectDashboardLoading = (state: RootState) => state.dashboard.loading;
export const selectDashboardError = (state: RootState) => state.dashboard.error;
