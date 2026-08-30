import request from 'supertest';
import express, { Response } from 'express';
import { generateToken } from '../utils/jwt';
import { authenticate } from '../middleware/authMiddleware';
import { AuthRequest } from '../types';

describe('User Data Isolation Tests', () => {
  let userAToken: string;
  let userBToken: string;
  let testApp: express.Application;

  beforeAll(() => {
    testApp = express();
    testApp.use(express.json());

    const mockOrders: Record<string, any> = {
      'order_user_a': { id: 'order_user_a', user: '507f1f77bcf86cd799439011', total: 1000 },
      'order_user_b': { id: 'order_user_b', user: '507f1f77bcf86cd799439012', total: 2500 },
    };

    testApp.get('/api/orders/:id', authenticate, (req: AuthRequest, res: Response) => {
      const order = mockOrders[req.params.id];
      if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
      if (order.user !== req.user?.id && req.user?.role !== 'ADMIN') {
        return res.status(403).json({ success: false, message: 'Access denied' });
      }
      return res.status(200).json({ success: true, data: order });
    });

    userAToken = generateToken({
      id: '507f1f77bcf86cd799439011',
      email: 'usera@shaziyakart.local',
      role: 'USER',
      name: 'User A',
    });

    userBToken = generateToken({
      id: '507f1f77bcf86cd799439012',
      email: 'userb@shaziyakart.local',
      role: 'USER',
      name: 'User B',
    });
  });

  it('User A can access User A own order', async () => {
    const res = await request(testApp)
      .get('/api/orders/order_user_a')
      .set('Authorization', `Bearer ${userAToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBe('order_user_a');
  });

  it('User A receives 403 Forbidden when attempting to access User B order', async () => {
    const res = await request(testApp)
      .get('/api/orders/order_user_b')
      .set('Authorization', `Bearer ${userAToken}`);

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('Access denied');
  });
});
