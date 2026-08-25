import axios, {
  type AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from 'axios';
import { clearAuthSession, storeAuthSession, type AuthTokens } from '@/api/authToken';
import { storage } from '@/utils/storage.utils';
import { STORAGE_KEYS } from '@/constants/storage.constants';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';
const AUTH_REFRESH_PATH = '/auth/refresh';
const AUTH_LOGIN_PATH = '/auth/login';

interface ApiEnvelope<T> {
  data: T;
}

interface RetriableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

let refreshPromise: Promise<string> | null = null;

function redirectToLogin(): void {
  clearAuthSession();

  if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
    window.sessionStorage.setItem(
      STORAGE_KEYS.SESSION_EXPIRED_MESSAGE,
      'Session got expired, please relogin',
    );
    window.location.href = '/login';
  }
}

async function refreshAccessToken(): Promise<string> {
  if (!refreshPromise) {
    const refreshToken = storage.get<string>(STORAGE_KEYS.REFRESH_TOKEN, '');
    if (!refreshToken) {
      throw new Error('Refresh token missing');
    }

    refreshPromise = axios
      .post<ApiEnvelope<AuthTokens>>(`${API_BASE_URL}${AUTH_REFRESH_PATH}`, {
        refreshToken,
      })
      .then((response) => {
        storeAuthSession(response.data.data);
        return response.data.data.accessToken;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = storage.get<string>(STORAGE_KEYS.ACCESS_TOKEN, '');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetriableRequestConfig | undefined;
    const requestUrl = originalRequest?.url ?? '';
    const shouldAttemptRefresh =
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !requestUrl.includes(AUTH_LOGIN_PATH) &&
      !requestUrl.includes(AUTH_REFRESH_PATH) &&
      Boolean(storage.get<string>(STORAGE_KEYS.REFRESH_TOKEN, ''));

    if (shouldAttemptRefresh) {
      originalRequest._retry = true;
      try {
        const accessToken = await refreshAccessToken();
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
      } catch {
        redirectToLogin();
      }
    } else if (error.response?.status === 401) {
      redirectToLogin();
    }

    return Promise.reject(error);
  },
);

export const api = apiClient;
export default apiClient;
