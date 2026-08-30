import api from '../api/api';
import { ICart, ApiResponse } from '../types';

export const cartService = {
  getCart: async () => {
    const res = await api.get<ApiResponse<ICart>>('/cart');
    return res.data;
  },

  addToCart: async (productId: string, quantity: number = 1) => {
    const res = await api.post<ApiResponse<ICart>>('/cart', {
      productId,
      quantity,
    });
    return res.data;
  },

  updateCartItem: async (itemId: string, quantity: number) => {
    const res = await api.put<ApiResponse<ICart>>(`/cart/${itemId}`, {
      quantity,
    });
    return res.data;
  },

  removeFromCart: async (itemId: string) => {
    const res = await api.delete<ApiResponse<ICart>>(`/cart/${itemId}`);
    return res.data;
  },

  clearCart: async () => {
    const res = await api.delete<ApiResponse<null>>('/cart');
    return res.data;
  },
};
