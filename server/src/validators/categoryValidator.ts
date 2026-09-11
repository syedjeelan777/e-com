import { z } from 'zod';

export const categorySchema = z.object({
  name: z.string().trim().min(2).max(120),
  description: z.string().trim().max(2000).optional(),
  image: z.string().max(2048).optional(),
  isActive: z.boolean().optional(),
}).strict();

export const updateCategorySchema = categorySchema.partial().strict();
