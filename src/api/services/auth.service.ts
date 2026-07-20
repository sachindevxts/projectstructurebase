import { API_ENDPOINTS } from '@/constants/api.constants';
import { api } from '@/api/client/apiClient';
import type { LoginPayload } from '@/types/auth.types';
import type { AuthUser } from '@/types/common.types';
import type { ApiResponse } from '@/types/api.types';

export const authService = {
  login: async (payload: LoginPayload): Promise<AuthUser> => {
    const response = await api.post<ApiResponse<AuthUser>>(API_ENDPOINTS.AUTH.LOGIN, payload);
    return response.data.data;
  },
  getCurrentUser: async (): Promise<AuthUser> => {
    const response = await api.get<ApiResponse<AuthUser>>(API_ENDPOINTS.AUTH.ME);
    return response.data.data;
  },
};
