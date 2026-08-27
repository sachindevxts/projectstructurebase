import type { AuthUser } from '@/types/common.types';
import { STORAGE_KEYS } from '@/constants/storage.constants';
import { storage } from '@/utils/storage.utils';

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string | null;
}

export const getStoredUser = () => storage.get<AuthUser>(STORAGE_KEYS.USER);

export const getAccessToken = () => storage.get<string>(STORAGE_KEYS.ACCESS_TOKEN, '') ?? '';

export const getRefreshToken = () => storage.get<string>(STORAGE_KEYS.REFRESH_TOKEN, '') ?? '';

export const storeAuthSession = (user: AuthUser, tokens: AuthTokens) => {
  storage.set(STORAGE_KEYS.USER, user);
  storage.set(STORAGE_KEYS.ACCESS_TOKEN, tokens.accessToken);

  if (tokens.refreshToken) {
    storage.set(STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken);
  }
};

export const clearAuthSession = () => {
  storage.remove(STORAGE_KEYS.ACCESS_TOKEN);
  storage.remove(STORAGE_KEYS.REFRESH_TOKEN);
  storage.remove(STORAGE_KEYS.USER);
};
