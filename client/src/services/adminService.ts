import api from '../api/api';
import {
  IOrder,
  IInventoryItem,
  IInventoryMovement,
  IReview,
  ApiResponse,
} from '../types';

export const adminService = {
  getOrders: async (params?: Record<string, any>) => {
    const res = await api.get<ApiResponse<IOrder[]>>('/admin/orders', { params });
    return res.data;
  },

  getOrderById: async (id: string) => {
    const res = await api.get<ApiResponse<IOrder>>(`/admin/orders/${id}`);
    return res.data;
  },

  updateOrderStatus: async (id: string, status: string, note?: string) => {
    const res = await api.patch<ApiResponse<IOrder>>(`/admin/orders/${id}/status`, {
      status,
      note,
    });
    return res.data;
  },

  getInventory: async (params?: Record<string, any>) => {
    const res = await api.get<ApiResponse<IInventoryItem[]>>('/admin/inventory', {
      params,
    });
    return res.data;
  },

  updateProductStock: async (productId: string, data: any) => {
    const res = await api.patch<ApiResponse<any>>(
      `/admin/inventory/${productId}`,
      data
    );
    return res.data;
  },

  getInventoryMovements: async (params?: Record<string, any>) => {
    const res = await api.get<ApiResponse<IInventoryMovement[]>>(
      '/admin/inventory/movements',
      { params }
    );
    return res.data;
  },

  getCustomers: async (params?: Record<string, any>) => {
    const res = await api.get<ApiResponse<any[]>>('/admin/customers', { params });
    return res.data;
  },

  getCustomerById: async (id: string) => {
    const res = await api.get<ApiResponse<any>>(`/admin/customers/${id}`);
    return res.data;
  },

  getReviews: async () => {
    const res = await api.get<ApiResponse<IReview[]>>('/admin/reviews');
    return res.data;
  },

  deleteReview: async (id: string) => {
    const res = await api.delete<ApiResponse<null>>(`/admin/reviews/${id}`);
    return res.data;
  },

  getOverviewStats: async () => {
    const res = await api.get<ApiResponse<any>>('/admin/analytics/overview');
    return res.data;
  },

  getRevenueAnalytics: async () => {
    const res = await api.get<ApiResponse<any[]>>('/admin/analytics/revenue');
    return res.data;
  },

  getOrderAnalytics: async () => {
    const res = await api.get<ApiResponse<any[]>>('/admin/analytics/orders');
    return res.data;
  },

  getTopProducts: async () => {
    const res = await api.get<ApiResponse<any[]>>('/admin/analytics/products');
    return res.data;
  },

  getCategoryAnalytics: async () => {
    const res = await api.get<ApiResponse<any[]>>('/admin/analytics/categories');
    return res.data;
  },
};
