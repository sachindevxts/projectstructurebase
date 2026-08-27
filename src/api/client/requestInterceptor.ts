import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { getAccessToken } from '@/api/authSession';

export const requestInterceptor = (client: AxiosInstance) => {
  client.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = getAccessToken();
      const isPublic =
        (config.url ?? '').includes('/auth/') ||
        (config.url ?? '').includes('/public/') ||
        (config.url ?? '').includes('/login');

      if (!isPublic && token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      config.headers['X-Request-Id'] =
        globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;

      return config;
    },
    (error) => Promise.reject(error),
  );
};
