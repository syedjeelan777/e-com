import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/responseFormatter';
import { NODE_ENV } from '../config/env';

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  sendError(res, `Route not found - ${req.originalUrl}`, 404);
};

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Unhandled Error:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  const errors = NODE_ENV === 'development' ? [err.stack] : undefined;

  sendError(res, message, statusCode, errors);
};
