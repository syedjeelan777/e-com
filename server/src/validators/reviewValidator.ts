import { z } from 'zod';
export const createReviewSchema = z.object({ rating: z.number().int().min(1).max(5), comment: z.string().trim().min(2).max(2000) }).strict();
export const updateReviewSchema = createReviewSchema.partial().strict();
