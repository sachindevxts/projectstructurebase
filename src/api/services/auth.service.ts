import { API_ENDPOINTS } from '@/constants/api.constants';
import { api } from '@/api/client/apiClient';
import type { LoginPayload } from '@/types/auth.types';
import type { AuthUser } from '@/types/common.types';
import { STORAGE_KEYS } from '@/constants/storage.constants';
import { PERMISSIONS, USER_ROLES } from '@/constants';
import { storage } from '@/utils/storage.utils';

interface DummyJsonAuthResponse {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role?: string;
  accessToken: string;
  refreshToken: string;
}

type DummyJsonCurrentUser = Omit<DummyJsonAuthResponse, 'accessToken' | 'refreshToken'>;

const toAuthUser = (user: DummyJsonCurrentUser): AuthUser => ({
  id: String(user.id),
  email: user.email,
  name: `${user.firstName} ${user.lastName}`.trim() || user.username,
  role: user.role === USER_ROLES.ADMIN ? USER_ROLES.ADMIN : USER_ROLES.USER,
  permissions:
    user.role === USER_ROLES.ADMIN ? Object.values(PERMISSIONS) : [PERMISSIONS.DASHBOARD_VIEW],
});

export const authService = {
  login: async (payload: LoginPayload): Promise<AuthUser> => {
    const response = await api.post<DummyJsonAuthResponse>(API_ENDPOINTS.AUTH.LOGIN, payload);
    storage.set(STORAGE_KEYS.ACCESS_TOKEN, response.data.accessToken);
    storage.set(STORAGE_KEYS.REFRESH_TOKEN, response.data.refreshToken);
    const user = toAuthUser(response.data);
    storage.set(STORAGE_KEYS.USER, user);
    return user;
  },
  getCurrentUser: async (): Promise<AuthUser> => {
    const response = await api.get<DummyJsonCurrentUser>(API_ENDPOINTS.AUTH.ME);
    return toAuthUser(response.data);
  },
};
