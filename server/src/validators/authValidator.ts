import { z } from 'zod';

const optionalText = (max: number) => z.string().trim().max(max).optional();
export const registerSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(254),
  password: z.string().min(12).max(128),
  phone: optionalText(30), company: optionalText(160), gstin: optionalText(30),
}).strict();
export const loginSchema = z.object({ email: z.string().trim().email().max(254), password: z.string().min(1).max(128) }).strict();
export const updateProfileSchema = z.object({ name: z.string().trim().min(2).max(120).optional(), phone: optionalText(30), company: optionalText(160), gstin: optionalText(30) }).strict();
