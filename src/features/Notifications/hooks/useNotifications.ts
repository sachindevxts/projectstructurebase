import { useCallback, useEffect, useState } from 'react';
import {
  notificationService,
  type NotificationItem,
} from '@/api/services/notification.service';

export const useNotifications = (enabled: boolean, listEnabled: boolean) => {
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const loadUnreadCount = useCallback(async () => {
    if (!enabled) return;
    try {
      setUnreadCount(await notificationService.getUnreadCount());
    } catch (error) {
      console.error('Failed to load unread notification count:', error);
    }
  }, [enabled]);

  const loadNotifications = useCallback(async () => {
    if (!enabled || !listEnabled) return;
    setLoading(true);
    try {
      const [notifications, count] = await Promise.all([
        notificationService.getNotifications(20),
        notificationService.getUnreadCount(),
      ]);
      setItems(notifications);
      setUnreadCount(count);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    } finally {
      setLoading(false);
    }
  }, [enabled, listEnabled]);

  useEffect(() => {
    loadUnreadCount();
  }, [loadUnreadCount]);

  useEffect(() => {
    if (listEnabled) {
      loadNotifications();
    }
  }, [listEnabled, loadNotifications]);

  const markRead = useCallback(async (id: string) => {
    const wasUnread = items.some((item) => item.id === id && !item.readAt);
    const updated = await notificationService.markRead(id);
    setItems((current) =>
      current.map((item) => (item.id === id ? updated : item)),
    );
    if (wasUnread) {
      setUnreadCount((current) => Math.max(0, current - 1));
    }
  }, [items]);

  const markAllRead = useCallback(async () => {
    await notificationService.markAllRead();
    setItems((current) =>
      current.map((item) => ({
        ...item,
        readAt: item.readAt ?? new Date().toISOString(),
      })),
    );
    setUnreadCount(0);
  }, []);

  const clearAll = useCallback(async () => {
    await notificationService.clearAll();
    setItems([]);
    setUnreadCount(0);
  }, []);

  return {
    items,
    unreadCount,
    loading,
    loadUnreadCount,
    loadNotifications,
    markRead,
    markAllRead,
    clearAll,
  };
};
