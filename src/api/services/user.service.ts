import { API_ENDPOINTS } from '@/constants/api.constants';
import { api } from '@/api/client/apiClient';
import { unwrapPaginatedResponse } from '@/api/apiResponse';
import type { ApiResponse, PaginatedApiResponse } from '@/types/api.types';

export interface UserSummary {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

const demoUsers: UserSummary[] = [
  { id: 1, firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', role: 'Admin' },
  { id: 2, firstName: 'Jane', lastName: 'Smith', email: 'jane.smith@example.com', role: 'User' },
  { id: 3, firstName: 'Bob', lastName: 'Johnson', email: 'bob.johnson@example.com', role: 'Manager' },
];

const isApiConfigured = () => Boolean(import.meta.env.VITE_API_BASE_URL);

export const getUsers = async (): Promise<UserSummary[]> => {
  if (!isApiConfigured()) {
    return demoUsers;
  }

  const response = await api.get<PaginatedApiResponse<UserSummary> | ApiResponse<UserSummary[]> | UserSummary[]>(
    API_ENDPOINTS.USERS.LIST,
  );

  return unwrapPaginatedResponse<UserSummary>(response.data);
};

export const deleteUser = async (id: number): Promise<void> => {
  if (!isApiConfigured()) {
    return;
  }

  await api.delete(`${API_ENDPOINTS.USERS.BASE}/${id}`);
};

export const userService = {
  getUsers,
  deleteUser,
};
