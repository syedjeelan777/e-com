import api from '../api/api';
import { IOrder, ApiResponse } from '../types';

export const orderService = {
  createOrder: async (data: any) => {
    const res = await api.post<ApiResponse<IOrder>>('/orders', data);
    return res.data;
  },

  getMyOrders: async (params?: Record<string, any>) => {
    const res = await api.get<ApiResponse<IOrder[]>>('/orders', { params });
    return res.data;
  },

  getOrderById: async (id: string) => {
    const res = await api.get<ApiResponse<IOrder>>(`/orders/${id}`);
    return res.data;
  },

  cancelOrder: async (id: string) => {
    const res = await api.patch<ApiResponse<IOrder>>(`/orders/${id}/cancel`);
    return res.data;
  },
};
