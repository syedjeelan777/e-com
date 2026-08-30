import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env';
import { IUserPayload } from '../types/index';

export const generateToken = (payload: IUserPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
};

export const verifyToken = (token: string): IUserPayload => {
  return jwt.verify(token, JWT_SECRET) as IUserPayload;
};
