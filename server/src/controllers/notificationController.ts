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
  try {
    if (!req.user) return sendError(res, 'Not authenticated', 401);
    const { id } = req.params;

    if (isMongoConnected()) {
      const notification = await Notification.findOneAndUpdate(
        { _id: id, user: req.user.id },
        { isRead: true },
        { new: true }
      );
      if (!notification) return sendError(res, 'Notification not found', 404);
      return sendSuccess(res, notification, 'Notification marked as read');
    } else {
      const notif = inMemoryStore.notifications.find((n) => n._id === id && n.user === req.user?.id);
      if (notif) notif.isRead = true;
      return sendSuccess(res, notif, 'Notification marked as read');
    }
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to mark notification as read', 500);
  }
};

export const markAllAsRead = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return sendError(res, 'Not authenticated', 401);

    if (isMongoConnected()) {
      await Notification.updateMany({ user: req.user.id, isRead: false }, { isRead: true });
      return sendSuccess(res, null, 'All notifications marked as read');
    } else {
      inMemoryStore.notifications.forEach((n) => {
        if (n.user === req.user?.id) n.isRead = true;
      });
      return sendSuccess(res, null, 'All notifications marked as read');
    }
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to mark notifications as read', 500);
  }
};
