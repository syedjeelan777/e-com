import { Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { sendError } from '../utils/responseFormatter';
import { AuthRequest } from '../types/index';

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return sendError(res, 'Authentication required. No token provided.', 401);
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return sendError(res, 'Invalid or expired authentication token', 401);
  }
};

export const requireRole = (role: 'USER' | 'ADMIN') => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return sendError(res, 'Authentication required', 401);
    }

    if (req.user.role !== role) {
      return sendError(
        res,
        'Forbidden. You do not have permission to access this resource.',
        403
      );
    }

    next();
  };
};
