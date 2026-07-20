import type { InternalAxiosRequestConfig } from 'axios';
import { STORAGE_KEYS } from '@/constants/storage.constants';
import { storage } from '@/utils/storage.utils';
import { env } from '@/config/env';

export const requestInterceptor = (client: any) => {
  client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = storage.get<string>(STORAGE_KEYS.ACCESS_TOKEN, '');
    const isPublic =
      (config.url ?? '').includes('/auth/') || (config.url ?? '').includes('/public/');
    if (!isPublic && token) {
      config.headers.set?.('Authorization', `Bearer ${token}`);
    }
    config.headers.set?.('X-App-Version', env.appVersion);
    config.headers.set?.('X-Request-Id', crypto.randomUUID?.() ?? `${Date.now()}`);
    return config;
  });
};
