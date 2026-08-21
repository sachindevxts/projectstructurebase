import { unwrapApiData, type ApiEnvelope } from '@/api/apiResponse';
import { api } from '@/api/client/apiClient';
import { API_ENDPOINTS } from '@/constants/api.constants';

export type NotificationType = 'INFO' | 'SUCCESS' | 'WARNING' | 'ACTION_REQUIRED';

export interface NotificationItem {
  id: string;
  recipientUserId: string;
  actorId: string | null;
  actorEmail: string | null;
  audienceRoles: string[];
  type: NotificationType;
  title: string;
  message: string;
  entityType: string | null;
  entityId: string | null;
  route: string | null;
  readAt: string | null;
  createdAt: string;
}

interface UnreadCountResponse {
  unreadCount: number;
}

async function getNotifications(limit = 10): Promise<NotificationItem[]> {
  const response = await api.get<ApiEnvelope<NotificationItem[]>>(API_ENDPOINTS.NOTIFICATIONS, {
    params: { page: 1, limit },
  });
  return unwrapApiData(response.data);
}

async function getUnreadCount(): Promise<number> {
  const response = await api.get<ApiEnvelope<UnreadCountResponse>>(
    `${API_ENDPOINTS.NOTIFICATIONS}/unread-count`,
  );
  return unwrapApiData(response.data).unreadCount;
}

async function markRead(id: string): Promise<NotificationItem> {
  const response = await api.patch<ApiEnvelope<NotificationItem>>(
    `${API_ENDPOINTS.NOTIFICATIONS}/${id}/read`,
  );
  return unwrapApiData(response.data);
}

async function markAllRead(): Promise<number> {
  const response = await api.patch<ApiEnvelope<UnreadCountResponse>>(
    `${API_ENDPOINTS.NOTIFICATIONS}/read-all`,
  );
  return unwrapApiData(response.data).unreadCount;
}

async function clearAll(): Promise<number> {
  const response = await api.delete<ApiEnvelope<UnreadCountResponse>>(API_ENDPOINTS.NOTIFICATIONS);
  return unwrapApiData(response.data).unreadCount;
}

export const notificationService = {
  getNotifications,
  getUnreadCount,
  markRead,
  markAllRead,
  clearAll,
};
