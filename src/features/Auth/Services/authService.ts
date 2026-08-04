import type { LoginCredentials, LoginResponse, AuthUser } from '../Types/auth.types';
import { storage } from '@/utils/storage.utils';
import { STORAGE_KEYS } from '@/constants/storage.constants';

class AuthService {
  private mockUsers = [
    {
      id: '1',
      email: 'admin@acmecorp.com',
      password: 'PeopleFlow1!',
      name: 'Arjun Kapoor',
      role: 'admin' as const,
      permissions: ['dashboard:view', 'user:manage', 'allocation:manage', 'settings:manage'],
    },
    {
      id: '2',
      email: 'manager@acmecorp.com',
      password: 'PeopleFlow1!',
      name: 'Vikram Sharma',
      role: 'manager' as const,
      permissions: ['dashboard:view', 'user:view', 'allocation:manage'],
    },
    {
      id: '3',
      email: 'user@acmecorp.com',
      password: 'PeopleFlow1!',
      name: 'Priya Singh',
      role: 'user' as const,
      permissions: ['dashboard:view', 'user:view'],
    },
  ];

  async login(credentials: LoginCredentials): Promise<AuthUser> {
    await new Promise(resolve => setTimeout(resolve, 500));

    const user = this.mockUsers.find(
      u => u.email === credentials.email && u.password === credentials.password
    );

    if (!user) {
      throw new Error('Invalid email or password');
    }

    const authUser: AuthUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      permissions: user.permissions,
    };

    storage.set(STORAGE_KEYS.ACCESS_TOKEN, 'mock-token-' + Date.now());
    storage.set(STORAGE_KEYS.USER, authUser);

    return authUser;
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    const user = storage.get<AuthUser>(STORAGE_KEYS.USER);
    return user || null;
  }

  async logout(): Promise<void> {
    storage.remove(STORAGE_KEYS.ACCESS_TOKEN);
    storage.remove(STORAGE_KEYS.REFRESH_TOKEN);
    storage.remove(STORAGE_KEYS.USER);
  }

  isAuthenticated(): boolean {
    const token = storage.get(STORAGE_KEYS.ACCESS_TOKEN);
    return !!token;
  }
}

export const authService = new AuthService();