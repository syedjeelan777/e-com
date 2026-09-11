import crypto from 'crypto';
// Test-only configuration. Production and development require an explicitly supplied secret.
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET ||= crypto.randomBytes(32).toString('hex');
