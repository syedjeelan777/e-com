import api from '../api/api';
import { IAddress, ApiResponse } from '../types';

export const addressService = {
  getAddresses: async () => {
    const res = await api.get<ApiResponse<IAddress[]>>('/addresses');
    return res.data;
  },

  createAddress: async (data: any) => {
    const res = await api.post<ApiResponse<IAddress>>('/addresses', data);
    return res.data;
  },

  updateAddress: async (id: string, data: any) => {
    const res = await api.put<ApiResponse<IAddress>>(`/addresses/${id}`, data);
    return res.data;
  },

  deleteAddress: async (id: string) => {
    const res = await api.delete<ApiResponse<null>>(`/addresses/${id}`);
    return res.data;
  },

  setDefaultAddress: async (id: string) => {
    const res = await api.patch<ApiResponse<IAddress>>(`/addresses/${id}/default`);
    return res.data;
  },
};
