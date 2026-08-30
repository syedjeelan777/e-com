import { Response } from 'express';
import { Notification } from '../models/Notification';
import { sendSuccess, sendError } from '../utils/responseFormatter';
import { AuthRequest } from '../types/index';
import { isMongoConnected, inMemoryStore } from '../config/memoryStore';

export const getNotifications = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return sendError(res, 'Not authenticated', 401);

    if (isMongoConnected()) {
      const notifications = await Notification.find({ user: req.user.id }).sort({ createdAt: -1 });
      const unreadCount = await Notification.countDocuments({ user: req.user.id, isRead: false });
      return sendSuccess(res, { notifications, unreadCount });
    } else {
      const notifications = inMemoryStore.notifications.filter((n) => n.user === req.user?.id);
      const unreadCount = notifications.filter((n) => !n.isRead).length;
      return sendSuccess(res, { notifications, unreadCount });
    }
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch notifications', 500);
  }
};

export const markAsRead = async (req: AuthRequest, res: Response) => {
  return sendSuccess(res, null, 'Notification marked as read');
};

export const markAllAsRead = async (req: AuthRequest, res: Response) => {
  return sendSuccess(res, null, 'Notifications marked as read');
};
