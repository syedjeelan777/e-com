import { hashPassword, comparePassword } from '../utils/password';
import { generateToken, verifyToken } from '../utils/jwt';
import { registerSchema, loginSchema } from '../validators/authValidator';

describe('Auth Utilities and Validators', () => {
  it('should hash and compare passwords correctly', async () => {
    const plain = 'Admin@12345';
    const hashed = await hashPassword(plain);

    expect(hashed).not.toBe(plain);
    const isMatch = await comparePassword(plain, hashed);
    expect(isMatch).toBe(true);

    const isWrongMatch = await comparePassword('WrongPass', hashed);
    expect(isWrongMatch).toBe(false);
  });

  it('should generate and verify valid JWT tokens', () => {
    const payload = {
      id: '507f1f77bcf86cd799439011',
      email: 'admin@shaziyakart.local',
      role: 'ADMIN' as const,
      name: 'Shaziya Admin',
    };

    const token = generateToken(payload);
    expect(typeof token).toBe('string');

    const decoded = verifyToken(token);
    expect(decoded.id).toBe(payload.id);
    expect(decoded.email).toBe(payload.email);
    expect(decoded.role).toBe(payload.role);
  });

  it('should validate user registration payload correctly', () => {
    const valid = registerSchema.safeParse({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'Password123!',
      company: 'Acme Corp',
    });

    expect(valid.success).toBe(true);

    const invalidEmail = registerSchema.safeParse({
      name: 'John Doe',
      email: 'invalid-email',
      password: 'Password123!',
    });

    expect(invalidEmail.success).toBe(false);
  });

  it('should validate user login payload correctly', () => {
    const valid = loginSchema.safeParse({
      email: 'john@example.com',
      password: 'Password123!',
    });

    expect(valid.success).toBe(true);

    const missingPass = loginSchema.safeParse({
      email: 'john@example.com',
      password: '',
    });

    expect(missingPass.success).toBe(false);
  });
});
