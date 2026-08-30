import { Request } from 'express';
import { Document, Types } from 'mongoose';

export interface IUserPayload {
  id: string;
  email: string;
  role: 'USER' | 'ADMIN';
  name: string;
}

export interface AuthRequest extends Request {
  user?: IUserPayload;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: any[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
