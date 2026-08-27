import type { RootState } from '@/redux/store/configureStore';

export const selectDashboardState = (state: RootState) => state.dashboard;
export const selectDashboard = (state: RootState) => state.dashboard.data;
export const selectDashboardLoading = (state: RootState) => state.dashboard.status === 'loading';
export const selectDashboardInitialized = (state: RootState) => state.dashboard.initialized;
export const selectDashboardError = (state: RootState) => state.dashboard.error;
