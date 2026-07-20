import type { AxiosError, AxiosInstance } from 'axios';
import { STORAGE_KEYS } from '@/constants/storage.constants';
import { storage } from '@/utils/storage.utils';
import { normalizeApiError } from '@/api/errorHandler';
import { store } from '@/redux/store/configureStore';
import { AUTH_ACTION_TYPES } from '@/redux/actionTypes';

export const responseInterceptor = (client: AxiosInstance) => {
  client.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      const normalized = normalizeApiError(error);
      if (normalized.status === 401) {
        storage.remove(STORAGE_KEYS.ACCESS_TOKEN);
        storage.remove(STORAGE_KEYS.REFRESH_TOKEN);
        storage.remove(STORAGE_KEYS.USER);
        store.dispatch({ type: AUTH_ACTION_TYPES.LOGOUT });
      }
      return Promise.reject(normalized);
    },
  );
};
