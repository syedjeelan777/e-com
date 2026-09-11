import { Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { sendError } from '../utils/responseFormatter';
import { AuthRequest } from '../types/index';
import { User } from '../models/User';
import { isMongoConnected, inMemoryStore } from '../config/memoryStore';

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !/^Bearer\s+\S+$/.test(authHeader)) {
    return sendError(res, 'Authentication required. No token provided.', 401);
  }

  try {
    const token = authHeader.slice(7).trim();
    const claims = verifyToken(token);

    // A signed token is not a user record. Reloading the account makes deactivation
    // and role changes effective immediately and prevents stale authorization.
    if (isMongoConnected()) {
      const user = await User.findById(claims.id).select('_id email name role isActive');
      if (!user || !user.isActive) return sendError(res, 'Invalid or inactive account', 401);
      req.user = { id: user._id.toString(), email: user.email, role: user.role, name: user.name };
    } else {
      const user = inMemoryStore.users.find((candidate) => candidate._id === claims.id);
      if (user && user.isActive === false) return sendError(res, 'Invalid or inactive account', 401);
      req.user = user
        ? { id: user._id, email: user.email, role: user.role, name: user.name }
        : claims;
    }
    return next();
  } catch {
    return sendError(res, 'Invalid or expired authentication token', 401);
  }
};

export const requireRole = (role: 'USER' | 'ADMIN') => (
  req: AuthRequest, res: Response, next: NextFunction
) => {
  if (!req.user) return sendError(res, 'Authentication required', 401);
  if (req.user.role !== role) return sendError(res, 'Forbidden. You do not have permission to access this resource.', 403);
  return next();
};
