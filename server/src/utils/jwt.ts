import jwt, { JwtPayload } from 'jsonwebtoken';
import crypto from 'crypto';
import { JWT_SECRET } from '../config/env';
import { IUserPayload } from '../types/index';

const ALGORITHM = 'HS256' as const;

export const generateToken = (payload: IUserPayload): string => jwt.sign(
  { sub: payload.id, jti: crypto.randomUUID(), email: payload.email, role: payload.role, name: payload.name },
  JWT_SECRET,
  { expiresIn: '15m', algorithm: ALGORITHM }
);

export const verifyToken = (token: string): IUserPayload => {
  const decoded = jwt.verify(token, JWT_SECRET, { algorithms: [ALGORITHM] }) as JwtPayload;
  if (typeof decoded.sub !== 'string' || (decoded.role !== 'USER' && decoded.role !== 'ADMIN')) {
    throw new Error('Invalid token claims');
  }
  return {
    id: decoded.sub,
    email: typeof decoded.email === 'string' ? decoded.email : '',
    role: decoded.role,
    name: typeof decoded.name === 'string' ? decoded.name : '',
  };
};
