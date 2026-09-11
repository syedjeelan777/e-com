import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const nodeEnv = process.env.NODE_ENV || 'development';
const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret || jwtSecret.length < 32) {
  throw new Error('JWT_SECRET must be configured and at least 32 characters long');
}

if (nodeEnv === 'production' && !process.env.MONGODB_URI) {
  throw new Error('MONGODB_URI must be configured in production');
}

export const PORT = Number(process.env.PORT || 5000);
export const MONGODB_URI = process.env.MONGODB_URI || '';
export const JWT_SECRET = jwtSecret;
export const NODE_ENV = nodeEnv;
export const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
export const PAYMENT_MODE = process.env.PAYMENT_MODE || (nodeEnv === 'production' ? 'live' : 'mock');

if (nodeEnv === 'production' && PAYMENT_MODE !== 'live') {
  throw new Error('PAYMENT_MODE must be live in production');
}

export const isProduction = nodeEnv === 'production';
