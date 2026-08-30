import { Response } from 'express';
import { ApiResponse } from '../types/index.js';

export const sendSuccess = <T>(
  res: Response,
  data?: T,
  message?: string,
  statusCode: number = 200,
  pagination?: ApiResponse['pagination']
): Response => {
  const response: ApiResponse<T> = {
    success: true,
    message,
    data,
    pagination,
  };
  return res.status(statusCode).json(response);
};

export const sendError = (
  res: Response,
  message: string = 'An error occurred',
  statusCode: number = 500,
  errors?: any[]
): Response => {
  const response: ApiResponse = {
    success: false,
    message,
    errors,
  };
  return res.status(statusCode).json(response);
};
