import api from '../api/api';
import { IUser, ApiResponse } from '../types';

export const authService = {
  register: async (payload: any) => {
    const res = await api.post<ApiResponse<{ token: string; user: IUser }>>(
      '/auth/register',
      payload
    );
    return res.data;
  },

  login: async (payload: any) => {
    const res = await api.post<ApiResponse<{ token: string; user: IUser }>>(
      '/auth/login',
      payload
    );
    return res.data;
  },

  getMe: async () => {
    const res = await api.get<ApiResponse<IUser>>('/auth/me');
    return res.data;
  },

  updateProfile: async (payload: any) => {
    const res = await api.put<ApiResponse<IUser>>('/auth/profile', payload);
    return res.data;
  },

  logout: async () => {
    const res = await api.post<ApiResponse<null>>('/auth/logout');
    return res.data;
  },
};
