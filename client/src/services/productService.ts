import api from '../api/api';
import { IProduct, ApiResponse } from '../types';

export const productService = {
  getProducts: async (params?: Record<string, any>) => {
    const res = await api.get<ApiResponse<IProduct[]>>('/products', { params });
    return res.data;
  },

  getFeaturedProducts: async () => {
    const res = await api.get<ApiResponse<IProduct[]>>('/products/featured');
    return res.data;
  },

  getProductById: async (id: string) => {
    const res = await api.get<ApiResponse<IProduct>>(`/products/${id}`);
    return res.data;
  },

  createProduct: async (data: any) => {
    const res = await api.post<ApiResponse<IProduct>>('/products', data);
    return res.data;
  },

  updateProduct: async (id: string, data: any) => {
    const res = await api.put<ApiResponse<IProduct>>(`/products/${id}`, data);
    return res.data;
  },

  deleteProduct: async (id: string) => {
    const res = await api.delete<ApiResponse<null>>(`/products/${id}`);
    return res.data;
  },
};
