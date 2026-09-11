import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import crypto from 'crypto';
import { apiLimiter } from './middleware/rateLimiter';
import { notFound, errorHandler } from './middleware/errorMiddleware';
import { CLIENT_URL, NODE_ENV } from './config/env';

import authRoutes from './routes/authRoutes';
import productRoutes from './routes/productRoutes';
import categoryRoutes from './routes/categoryRoutes';
import cartRoutes from './routes/cartRoutes';
import orderRoutes from './routes/orderRoutes';
import adminRoutes from './routes/adminRoutes';
import reviewRoutes from './routes/reviewRoutes';
import wishlistRoutes from './routes/wishlistRoutes';
import addressRoutes from './routes/addressRoutes';
import notificationRoutes from './routes/notificationRoutes';

const app = express();
const allowedOrigins = CLIENT_URL.split(',').map((origin) => origin.trim()).filter(Boolean);

app.disable('x-powered-by');
app.use((req, res, next) => {
  const requestId = req.header('X-Request-ID')?.slice(0, 100) || crypto.randomUUID();
  res.setHeader('X-Request-ID', requestId);
  res.locals.requestId = requestId;
  next();
});
app.use(helmet({
  contentSecurityPolicy: NODE_ENV === 'development' ? false : undefined,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  hsts: NODE_ENV === 'production' ? undefined : false,
}));
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Origin is not allowed'));
  },
  credentials: false,
}));
app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: false, limit: '50kb' }));
app.use(morgan(':remote-addr :method :url :status :response-time ms request_id=:req[x-request-id]'));
app.use('/api', apiLimiter);

app.get('/api/health', (_req, res) => res.status(200).json({ status: 'ok', service: 'SHAZIYAKART API' }));
app.get('/api/ready', (_req, res) => {
  // Keep readiness intentionally non-sensitive; DB readiness is checked by the process.
  res.status(200).json({ status: 'ready' });
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', reviewRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/notifications', notificationRoutes);

app.use(notFound);
app.use(errorHandler);
export default app;
