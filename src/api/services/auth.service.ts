import { API_ENDPOINTS } from '@/constants/api.constants';
import { PERMISSIONS } from '@/constants/permission.constants';
import { api } from '@/api/client/apiClient';
import { clearAuthSession, getAccessToken, getStoredUser, storeAuthSession } from '@/api/authSession';
import { unwrapApiResponse } from '@/api/apiResponse';
import type { ApiResponse } from '@/types/api.types';
import type { AuthUser } from '@/types/common.types';

export interface LoginPayload {
  username: string;
  password: string;
}

interface LoginResponseData {
  id?: number | string;
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  role?: string;
  permissions?: string[];
  accessToken?: string;
  token?: string;
  refreshToken?: string;
  user?: AuthUser;
}

const isApiConfigured = () => Boolean(import.meta.env.VITE_API_BASE_URL);

const createDemoUser = ({ username }: LoginPayload): AuthUser => {
  const isAdmin = username.toLowerCase().includes('admin');

  return {
    id: isAdmin ? 'admin-demo' : 'user-demo',
    email: username,
    name: isAdmin ? 'Admin User' : 'Regular User',
    role: isAdmin ? 'admin' : 'user',
    permissions: isAdmin
      ? [PERMISSIONS.ALL]
      : [
          PERMISSIONS.DASHBOARD_VIEW,
          PERMISSIONS.LEADS_VIEW,
          PERMISSIONS.CAMPAIGNS_VIEW,
          PERMISSIONS.SETTINGS_VIEW,
        ],
  };
};

const toAuthUser = (payload: LoginResponseData, fallbackUsername: string): AuthUser => {
  if (payload.user) {
    return payload.user;
  }

  const email = payload.email ?? payload.username ?? fallbackUsername;
  const fullName = [payload.firstName, payload.lastName].filter(Boolean).join(' ');

  return {
    id: String(payload.id ?? email),
    email,
    name: (payload.name ?? fullName) || email,
    role: payload.role ?? 'user',
    permissions: payload.permissions ?? [PERMISSIONS.DASHBOARD_VIEW],
  };
};

export const login = async (payload: LoginPayload): Promise<AuthUser> => {
  if (!isApiConfigured()) {
    const user = createDemoUser(payload);
    storeAuthSession(user, { accessToken: `demo-token-${Date.now()}` });
    return user;
  }

  const response = await api.post<ApiResponse<LoginResponseData> | LoginResponseData>(
    API_ENDPOINTS.AUTH.LOGIN,
    payload,
  );
  const authData = unwrapApiResponse<LoginResponseData>(response.data);
  const user = toAuthUser(authData, payload.username);
  const accessToken = authData.accessToken ?? authData.token;

  if (!accessToken) {
    throw new Error('Login response did not include an access token');
  }

  storeAuthSession(user, {
    accessToken,
    refreshToken: authData.refreshToken,
  });

  return user;
};

export const getCurrentUser = async (): Promise<AuthUser> => {
  const storedUser = getStoredUser();

  if (!isApiConfigured() || !getAccessToken()) {
    if (!storedUser) {
      throw new Error('No user found');
    }

    return storedUser;
  }

  const response = await api.get<ApiResponse<AuthUser> | AuthUser>(API_ENDPOINTS.AUTH.ME);
  const user = unwrapApiResponse<AuthUser>(response.data);
  storeAuthSession(user, { accessToken: getAccessToken() ?? '' });

  return user;
};

export const logout = async (): Promise<void> => {
  try {
    if (isApiConfigured() && getAccessToken()) {
      await api.post(API_ENDPOINTS.AUTH.LOGOUT);
    }
  } finally {
    clearAuthSession();
  }
};

export const isAuthenticated = () => Boolean(getAccessToken());

export const authService = {
  login,
  getCurrentUser,
  logout,
  isAuthenticated,
};
