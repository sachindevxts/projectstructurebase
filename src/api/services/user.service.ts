import { API_ENDPOINTS } from '@/constants/api.constants';
import { api } from '@/api/client/apiClient';

export interface UserSummary {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

class UserService {
  async getUsers(): Promise<UserSummary[]> {
    try {
      // Mock data for development
      return [
        { id: 1, firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', role: 'Admin' },
        { id: 2, firstName: 'Jane', lastName: 'Smith', email: 'jane.smith@example.com', role: 'User' },
        { id: 3, firstName: 'Bob', lastName: 'Johnson', email: 'bob.johnson@example.com', role: 'Manager' },
      ];
      
      // When backend is ready:
      // const response = await api.get<{ users: UserSummary[] }>(API_ENDPOINTS.USERS.LIST);
      // return response.data.users;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  async deleteUser(id: number): Promise<void> {
    try {
      console.log(`Deleting user ${id}`);
      // When backend is ready:
      // await api.delete(`${API_ENDPOINTS.USERS.LIST}/${id}`);
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }
}

export const userService = new UserService();