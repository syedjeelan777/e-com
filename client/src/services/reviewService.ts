import api from '../api/api';
import { IReview, ApiResponse } from '../types';

export const reviewService = {
  getProductReviews: async (productId: string) => {
    const res = await api.get<ApiResponse<IReview[]>>(
      `/products/${productId}/reviews`
    );
    return res.data;
  },

  createReview: async (productId: string, data: { rating: number; comment: string }) => {
    const res = await api.post<ApiResponse<IReview>>(
      `/products/${productId}/reviews`,
      data
    );
    return res.data;
  },

  updateReview: async (id: string, data: { rating?: number; comment?: string }) => {
    const res = await api.put<ApiResponse<IReview>>(`/reviews/${id}`, data);
    return res.data;
  },

  deleteReview: async (id: string) => {
    const res = await api.delete<ApiResponse<null>>(`/reviews/${id}`);
    return res.data;
  },
};
