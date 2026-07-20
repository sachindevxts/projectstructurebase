import { API_ENDPOINTS } from '@/constants/api.constants';
import { api } from '@/api/client/apiClient';
import type { ApiResponse } from '@/types/api.types';

export const dashboardService = {
  getSummary: async (): Promise<{ totalProducts: number; totalUsers: number }> => {
    const response = await api.get<ApiResponse<{ totalProducts: number; totalUsers: number }>>(
      API_ENDPOINTS.DASHBOARD.SUMMARY,
    );
    return response.data.data;
  },
};
