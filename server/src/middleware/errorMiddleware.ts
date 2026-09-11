import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/responseFormatter';
import { NODE_ENV } from '../config/env';

export const notFound = (req: Request, res: Response) => sendError(res, 'Route not found', 404);

export const errorHandler = (err: any, _req: Request, res: Response, _next: NextFunction) => {
  // Detailed errors belong in centralized server logging, never in production responses.
  console.error('Unhandled request error', { requestId: res.locals.requestId, error: err?.message });
  const statusCode = Number.isInteger(err?.statusCode) ? err.statusCode : 500;
  const safeMessage = statusCode >= 500 && NODE_ENV === 'production' ? 'Internal server error' : (err?.message || 'Internal server error');
  return sendError(res, safeMessage, statusCode, NODE_ENV === 'development' && statusCode < 500 ? [err?.stack] : undefined);
};
