import { API_ENDPOINTS } from '@/constants/api.constants';
import { api } from '@/api/client/apiClient';
import type { ApiResponse } from '@/types/api.types';
import type { UserSummary } from '@/types/user.types';

export const userService = {
  getUsers: async (): Promise<UserSummary[]> => {
    const response = await api.get<ApiResponse<UserSummary[]>>(API_ENDPOINTS.USERS.LIST);
    return response.data.data;
  },
  deleteUser: async (id: number): Promise<void> => {
    await api.delete(`${API_ENDPOINTS.USERS.LIST}/${id}`);
  },
};
