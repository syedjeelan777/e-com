import api from '../api/api';
import { ICategory, ApiResponse } from '../types';

export const categoryService = {
  getCategories: async () => {
    const res = await api.get<ApiResponse<ICategory[]>>('/categories');
    return res.data;
  },

  getCategoryById: async (id: string) => {
    const res = await api.get<ApiResponse<ICategory>>(`/categories/${id}`);
    return res.data;
  },

  createCategory: async (data: any) => {
    const res = await api.post<ApiResponse<ICategory>>('/categories', data);
    return res.data;
  },

  updateCategory: async (id: string, data: any) => {
    const res = await api.put<ApiResponse<ICategory>>(`/categories/${id}`, data);
    return res.data;
  },

  deleteCategory: async (id: string) => {
    const res = await api.delete<ApiResponse<null>>(`/categories/${id}`);
    return res.data;
  },
};
