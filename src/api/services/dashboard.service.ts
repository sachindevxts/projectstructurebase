import { API_ENDPOINTS } from '@/constants/api.constants';
import { api } from '@/api/client/apiClient';
import { unwrapApiResponse } from '@/api/apiResponse';
import type { ApiResponse } from '@/types/api.types';

export interface DashboardSummary {
  pendingApprovals: number;
  activeSequences: number;
  repliesThisWeek: number;
  pausedSequences: number;
}

const demoSummary: DashboardSummary = {
  pendingApprovals: 11,
  activeSequences: 1,
  repliesThisWeek: 0,
  pausedSequences: 0,
};

const isApiConfigured = () => Boolean(import.meta.env.VITE_API_BASE_URL);

export const getSummary = async (): Promise<DashboardSummary> => {
  if (!isApiConfigured()) {
    return demoSummary;
  }

  const response = await api.get<ApiResponse<DashboardSummary> | DashboardSummary>(
    API_ENDPOINTS.DASHBOARD.SUMMARY,
  );

  return unwrapApiResponse<DashboardSummary>(response.data);
};

export const dashboardService = {
  getSummary,
};
