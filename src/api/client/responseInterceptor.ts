import type { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { storage } from '@/utils/storage.utils';
import { STORAGE_KEYS } from '@/constants/storage.constants';
import { normalizeApiError } from '@/api/errorHandler';

export const responseInterceptor = (client: AxiosInstance) => {
  client.interceptors.response.use(
    (response: AxiosResponse) => {
      // You can transform response data here if needed
      return response;
    },
    (error: AxiosError) => {
      const normalizedError = normalizeApiError(error);
      
      // Handle 401 Unauthorized
      if (normalizedError.status === 401) {
        storage.remove(STORAGE_KEYS.ACCESS_TOKEN);
        storage.remove(STORAGE_KEYS.REFRESH_TOKEN);
        storage.remove(STORAGE_KEYS.USER);
        
        // Redirect to login if not already there
        if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }

      return Promise.reject(normalizedError);
    }
  );
};