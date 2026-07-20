import { API_ENDPOINTS } from '@/constants/api.constants';
import { api } from '@/api/client/apiClient';
export const dashboardService = {
  getSummary: async (): Promise<{ totalProducts: number; totalUsers: number }> => {
    const [productsResponse, usersResponse] = await Promise.all([
      api.get<{ total: number }>(API_ENDPOINTS.DASHBOARD.SUMMARY, { params: { limit: 0 } }),
      api.get<{ total: number }>(API_ENDPOINTS.USERS.LIST, { params: { limit: 0 } }),
    ]);
    return {
      totalProducts: productsResponse.data.total,
      totalUsers: usersResponse.data.total,
    };
  },
};
