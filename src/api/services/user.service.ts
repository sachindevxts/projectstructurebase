import { API_ENDPOINTS } from '@/constants/api.constants';
import { api } from '@/api/client/apiClient';
import type { UserSummary } from '@/types/user.types';

export const userService = {
  getUsers: async (): Promise<UserSummary[]> => {
    const response = await api.get<{ users: UserSummary[] }>(API_ENDPOINTS.USERS.LIST);
    return response.data.users;
  },
  deleteUser: async (id: number): Promise<void> => {
    await api.delete(`${API_ENDPOINTS.USERS.LIST}/${id}`);
  },
};
