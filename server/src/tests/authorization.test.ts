import request from 'supertest';
import express, { Response } from 'express';
import { generateToken } from '../utils/jwt';
import { authenticate, requireRole } from '../middleware/authMiddleware';
import { AuthRequest } from '../types';

describe('RBAC Authorization Tests', () => {
  let customerToken: string;
  let adminToken: string;
  let testApp: express.Application;

  beforeAll(() => {
    testApp = express();
    testApp.use(express.json());

    // Protected Admin Route
    testApp.get(
      '/api/admin/orders',
      authenticate,
      requireRole('ADMIN'),
      (req: AuthRequest, res: Response) => {
        res.status(200).json({ success: true, message: 'Admin access granted' });
      }
    );

    customerToken = generateToken({
      id: '507f1f77bcf86cd799439011',
      email: 'customer@shaziyakart.local',
      role: 'USER',
      name: 'Test Customer',
    });

    adminToken = generateToken({
      id: '507f1f77bcf86cd799439012',
      email: 'admin@shaziyakart.local',
      role: 'ADMIN',
      name: 'Test Admin',
    });
  });

  it('should return 401 Unauthorized when no JWT token is provided', async () => {
    const res = await request(testApp).get('/api/admin/orders');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('No token provided');
  });

  it('should return 403 Forbidden when customer JWT accesses admin endpoint /api/admin/orders', async () => {
    const res = await request(testApp)
      .get('/api/admin/orders')
      .set('Authorization', `Bearer ${customerToken}`);

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('Forbidden');
  });

  it('should return 200 OK when admin JWT accesses admin endpoint /api/admin/orders', async () => {
    const res = await request(testApp)
      .get('/api/admin/orders')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('Admin access granted');
  });
});
