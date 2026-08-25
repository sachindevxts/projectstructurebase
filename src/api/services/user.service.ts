import { API_ENDPOINTS } from '@/constants/api.constants';
import {
  unwrapPaginatedApiData,
  type PaginatedEnvelope,
  type PaginationMeta,
} from '@/api/apiResponse';
import { api } from '@/api/client/apiClient';

export interface UserSummary {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

interface BackendUser {
  id: string;
  email: string;
  role: string;
}

function mapUser(user: BackendUser): UserSummary {
  const [firstName = user.email, ...rest] = user.email.split('@')[0].split(/[._-]/);
  return {
    id: user.id,
    firstName,
    lastName: rest.join(' '),
    email: user.email,
    role: user.role,
  };
}

async function getUsersPage(page = 1, limit = 20): Promise<{
  data: UserSummary[];
  pagination: PaginationMeta;
}> {
  const response = await api.get<PaginatedEnvelope<BackendUser>>(API_ENDPOINTS.USERS.LIST, {
    params: { page, limit },
  });
  const result = unwrapPaginatedApiData(response.data);
  return {
    data: result.data.map(mapUser),
    pagination: result.pagination,
  };
}

async function getUsers(): Promise<UserSummary[]> {
  return (await getUsersPage()).data;
}

async function deleteUser(id: string): Promise<void> {
  await api.delete(`${API_ENDPOINTS.USERS.LIST}/${id}`);
}

export const userService = {
  getUsers,
  getUsersPage,
  deleteUser,
};
