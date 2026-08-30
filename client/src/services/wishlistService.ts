import api from '../api/api';
import { ApiResponse } from '../types';

export const wishlistService = {
  getWishlist: async () => {
    const res = await api.get<ApiResponse<any>>('/wishlist');
    return res.data;
  },

  addToWishlist: async (productId: string) => {
    const res = await api.post<ApiResponse<any>>(`/wishlist/${productId}`);
    return res.data;
  },

  removeFromWishlist: async (productId: string) => {
    const res = await api.delete<ApiResponse<any>>(`/wishlist/${productId}`);
    return res.data;
  },
};
