import { z } from 'zod';

const urlOrPath = z.string().max(2048);
const specification = z.object({ key: z.string().trim().min(1).max(80), value: z.string().trim().min(1).max(500) }).strict();

export const productSchema = z.object({
  name: z.string().trim().min(2).max(200),
  description: z.string().trim().min(10).max(10000),
  shortDescription: z.string().trim().max(500).optional(),
  price: z.number().finite().min(0).max(1_000_000_000),
  compareAtPrice: z.number().finite().min(0).max(1_000_000_000).optional(),
  category: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid category ID'),
  brand: z.string().trim().min(1).max(100),
  images: z.array(urlOrPath).min(1).max(12),
  stock: z.number().int().min(0).max(1_000_000),
  lowStockThreshold: z.number().int().min(0).max(1_000_000).optional(),
  unit: z.string().trim().min(1).max(50).default('Piece'),
  minOrderQuantity: z.number().int().min(1).max(1000).optional(),
  specifications: z.array(specification).max(50).optional(),
  tags: z.array(z.string().trim().min(1).max(50)).max(50).optional(),
  isFeatured: z.boolean().optional(),
  isActive: z.boolean().optional(),
}).strict();

export const updateProductSchema = productSchema.partial().strict();
