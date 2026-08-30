import { Request, Response } from 'express';
import { Order } from '../models/Order';
import { User } from '../models/User';
import { Review } from '../models/Review';
import { sendSuccess, sendError } from '../utils/responseFormatter';
import { AuthRequest } from '../types/index';
import { isMongoConnected, inMemoryStore } from '../config/memoryStore';

export const getAdminOrders = async (req: Request, res: Response) => {
  try {
    const { status, search } = req.query;

    if (isMongoConnected()) {
      const query: any = {};
      if (status && status !== 'ALL') query.status = status;
      const orders = await Order.find(query).populate('user').sort({ createdAt: -1 });
      return sendSuccess(res, orders);
    } else {
      let orders = [...inMemoryStore.orders];
      if (status && status !== 'ALL') orders = orders.filter((o) => o.status === status);
      return sendSuccess(res, orders);
    }
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch orders', 500);
  }
};

export const getAdminOrderById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (isMongoConnected()) {
      const order = await Order.findById(id).populate('user');
      if (!order) return sendError(res, 'Order not found', 404);
      return sendSuccess(res, order);
    } else {
      const order = inMemoryStore.orders.find((o) => o._id === id);
      if (!order) return sendError(res, 'Order not found', 404);
      return sendSuccess(res, order);
    }
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch order', 500);
  }
};

export const updateOrderStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status, note } = req.body;

    if (isMongoConnected()) {
      const order = await Order.findById(id);
      if (!order) return sendError(res, 'Order not found', 404);

      order.status = status;
      order.statusHistory.push({ status, note, timestamp: new Date() });
      await order.save();
      return sendSuccess(res, order, `Order status updated to ${status}`);
    } else {
      const order = inMemoryStore.orders.find((o) => o._id === id);
      if (!order) return sendError(res, 'Order not found', 404);

      order.status = status;
      order.statusHistory.push({ status, note, timestamp: new Date() });
      return sendSuccess(res, order, `Order status updated to ${status}`);
    }
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to update order status', 500);
  }
};

export const getAdminCustomers = async (req: Request, res: Response) => {
  try {
    if (isMongoConnected()) {
      const users = await User.find({ role: 'USER' });
      const customerStats = await Promise.all(
        users.map(async (u) => {
          const orders = await Order.find({ user: u._id, status: { $ne: 'Cancelled' } });
          return {
            id: u._id,
            name: u.name,
            email: u.email,
            phone: u.phone,
            company: u.company,
            gstin: u.gstin,
            isActive: u.isActive,
            totalOrders: orders.length,
            totalSpent: orders.reduce((sum, o) => sum + o.totalAmount, 0),
            createdAt: u.createdAt,
          };
        })
      );
      return sendSuccess(res, customerStats);
    } else {
      const users = inMemoryStore.users.filter((u) => u.role === 'USER');
      const customerStats = users.map((u) => {
        const orders = inMemoryStore.orders.filter(
          (o) => (typeof o.user === 'object' ? o.user._id : o.user) === u._id && o.status !== 'Cancelled'
        );
        return {
          id: u._id,
          name: u.name,
          email: u.email,
          phone: u.phone,
          company: u.company,
          gstin: u.gstin,
          isActive: u.isActive,
          totalOrders: orders.length,
          totalSpent: orders.reduce((sum, o) => sum + o.totalAmount, 0),
          createdAt: u.createdAt,
        };
      });
      return sendSuccess(res, customerStats);
    }
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch customers', 500);
  }
};

export const getCustomerById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (isMongoConnected()) {
      const customer = await User.findById(id);
      if (!customer) return sendError(res, 'Customer not found', 404);
      const orders = await Order.find({ user: id });
      return sendSuccess(res, { customer, orders });
    } else {
      const customer = inMemoryStore.users.find((u) => u._id === id);
      if (!customer) return sendError(res, 'Customer not found', 404);
      const orders = inMemoryStore.orders.filter(
        (o) => (typeof o.user === 'object' ? o.user._id : o.user) === id
      );
      return sendSuccess(res, { customer, orders });
    }
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch customer', 500);
  }
};

export const getAdminReviews = async (req: Request, res: Response) => {
  try {
    if (isMongoConnected()) {
      const reviews = await Review.find().populate('user').populate('product');
      return sendSuccess(res, reviews);
    } else {
      return sendSuccess(res, inMemoryStore.reviews);
    }
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch reviews', 500);
  }
};

export const deleteReview = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (isMongoConnected()) {
      await Review.findByIdAndDelete(id);
      return sendSuccess(res, null, 'Review deleted');
    } else {
      inMemoryStore.reviews = inMemoryStore.reviews.filter((r) => r._id !== id);
      return sendSuccess(res, null, 'Review deleted');
    }
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to delete review', 500);
  }
};
