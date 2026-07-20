import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios';
import { env } from '@/config/env';
import { storage } from '@/utils/storage.utils';
import { STORAGE_KEYS } from '@/constants/storage.constants';
import { requestInterceptor } from './requestInterceptor';
import { responseInterceptor } from './responseInterceptor';
import { interceptorManager } from './interceptorManager';

const apiClient: AxiosInstance = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: env.requestTimeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

requestInterceptor(apiClient);
responseInterceptor(apiClient);

export const api = apiClient;

export const createApiClient = (config?: AxiosRequestConfig) =>
  axios.create({ ...apiClient.defaults, ...config });

export const getAuthHeaders = () => ({
  Authorization: `Bearer ${storage.get(STORAGE_KEYS.ACCESS_TOKEN, '')}`,
});

export default apiClient;
