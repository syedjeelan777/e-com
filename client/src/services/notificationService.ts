import api from '../api/api';
import { INotification, ApiResponse } from '../types';

export const notificationService = {
  getNotifications: async () => {
    const res = await api.get<ApiResponse<{ notifications: INotification[]; unreadCount: number }>>(
      '/notifications'
    );
    return res.data;
  },

  markAsRead: async (id: string) => {
    const res = await api.patch<ApiResponse<INotification>>(`/notifications/${id}/read`);
    return res.data;
  },

  markAllAsRead: async () => {
    const res = await api.patch<ApiResponse<null>>('/notifications/read-all');
    return res.data;
  },
};
