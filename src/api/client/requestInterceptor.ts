import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { storage } from '@/utils/storage.utils';
import { STORAGE_KEYS } from '@/constants/storage.constants';

export const requestInterceptor = (client: AxiosInstance) => {
  client.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = storage.get<string>(STORAGE_KEYS.ACCESS_TOKEN, '');
      
      // Check if the request is public (login, register, etc.)
      const isPublic =
        (config.url ?? '').includes('/auth/') ||
        (config.url ?? '').includes('/public/') ||
        (config.url ?? '').includes('/login');

      if (!isPublic && token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // Add request ID for tracking
      config.headers['X-Request-Id'] = crypto.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
      
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
};