import { API_ENDPOINTS } from '@/constants/api.constants';
import { api } from '@/api/client/apiClient';

export interface DashboardSummary {
  totalProducts: number;
  totalUsers: number;
  totalEmployees?: number;
  activeEmployees?: number;
  billablePercentage?: number;
}

class DashboardService {
  async getSummary(): Promise<DashboardSummary> {
    try {
      // For now, return mock data
      // When backend is ready, uncomment:
      // const response = await api.get<DashboardSummary>(API_ENDPOINTS.DASHBOARD.SUMMARY);
      // return response.data;

      // Mock data for development
      return {
        totalProducts: 156,
        totalUsers: 247,
        totalEmployees: 247,
        activeEmployees: 231,
        billablePercentage: 84,
      };
    } catch (error) {
      console.error('Error fetching dashboard summary:', error);
      throw error;
    }
  }
}

export const dashboardService = new DashboardService();