import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(2, 'Product name is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  shortDescription: z.string().optional(),
  price: z.number().min(0, 'Price must be non-negative'),
  compareAtPrice: z.number().min(0).optional(),
  category: z.string().min(1, 'Category ID is required'),
  brand: z.string().min(1, 'Brand is required'),
  images: z.array(z.string()).min(1, 'At least one image URL is required'),
  stock: z.number().min(0, 'Stock cannot be negative'),
  lowStockThreshold: z.number().min(0).optional(),
  unit: z.string().default('Piece'),
  minOrderQuantity: z.number().min(1).optional(),
  specifications: z.array(z.object({
    key: z.string(),
    value: z.string(),
  })).optional(),
  tags: z.array(z.string()).optional(),
  isFeatured: z.boolean().optional(),
  isActive: z.boolean().optional(),
});
