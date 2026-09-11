import { z } from 'zod';
const productId = z.string().regex(/^[0-9a-fA-F]{24}$/);
export const addCartSchema = z.object({ productId, quantity: z.number().int().min(1).max(1000).default(1) }).strict();
export const updateCartSchema = z.object({ quantity: z.number().int().min(1).max(1000) }).strict();
