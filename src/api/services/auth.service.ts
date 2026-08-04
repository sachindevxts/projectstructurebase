import { API_ENDPOINTS } from '@/constants/api.constants';
import { api } from '@/api/client/apiClient';
import { storage } from '@/utils/storage.utils';
import { STORAGE_KEYS } from '@/constants/storage.constants';

export interface LoginPayload {
  username: string;
  password: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
  permissions: string[];
}

interface AuthResponse {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role?: string;
  accessToken: string;
  refreshToken: string;
}

class AuthService {
  async login(payload: LoginPayload): Promise<AuthUser> {
    try {
      // For development, mock login
      // When backend is ready:
      // const response = await api.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, payload);
      
      // Mock response for development
      const mockUser: AuthUser = {
        id: '1',
        email: payload.username,
        name: payload.username.includes('admin') ? 'Admin User' : 'Regular User',
        role: payload.username.includes('admin') ? 'admin' : 'user',
        permissions: payload.username.includes('admin') 
          ? ['dashboard:view', 'user:manage', 'allocation:manage', 'settings:manage']
          : ['dashboard:view', 'user:view'],
      };

      // Store token and user
      storage.set(STORAGE_KEYS.ACCESS_TOKEN, 'mock-token-' + Date.now());
      storage.set(STORAGE_KEYS.USER, mockUser);
      
      return mockUser;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  }

  async getCurrentUser(): Promise<AuthUser> {
    try {
      const user = storage.get<AuthUser>(STORAGE_KEYS.USER);
      if (!user) {
        throw new Error('No user found');
      }
      return user;
    } catch (error) {
      console.error('Error getting current user:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      storage.remove(STORAGE_KEYS.ACCESS_TOKEN);
      storage.remove(STORAGE_KEYS.REFRESH_TOKEN);
      storage.remove(STORAGE_KEYS.USER);
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  }

  isAuthenticated(): boolean {
    const token = storage.get<string>(STORAGE_KEYS.ACCESS_TOKEN, '');
    return !!token;
  }
}

export const authService = new AuthService();