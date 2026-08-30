import request from 'supertest';
import app from '../app';

describe('Health Check API Endpoint', () => {
  it('should return 200 OK for GET /api/health', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.service).toBe('SHAZIYAKART API');
  });
});
