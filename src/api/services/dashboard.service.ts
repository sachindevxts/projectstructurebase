import { API_ENDPOINTS } from '@/constants/api.constants';
import { api } from '@/api/client/apiClient';

export interface DashboardSummary {
  pendingApprovals: number;
  activeSequences: number;
  repliesThisWeek: number;
  pausedSequences: number;
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
        pendingApprovals: 11,
        activeSequences: 1,
        repliesThisWeek: 0,
        pausedSequences: 0,
      };
    } catch (error) {
      console.error('Error fetching dashboard summary:', error);
      throw error;
    }
  }
}

export const dashboardService = new DashboardService();
