import { z } from 'zod';

export const addressSchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  phone: z.string().regex(/^\+?[0-9 ()-]{10,20}$/),
  company: z.string().trim().max(160).optional(),
  addressLine1: z.string().trim().min(5).max(200),
  addressLine2: z.string().trim().max(200).optional(),
  city: z.string().trim().min(2).max(80),
  state: z.string().trim().min(2).max(80),
  postalCode: z.string().regex(/^[A-Za-z0-9 -]{5,12}$/),
  country: z.string().trim().min(2).max(80).default('India'),
}).strict();

export const createOrderSchema = z.object({
  addressId: z.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
  address: addressSchema.optional(),
  paymentMethod: z.enum(['COD', 'DEMO_CARD', 'NET_BANKING', 'UPI']).default('COD'),
  notes: z.string().trim().max(1000).optional(),
  idempotencyKey: z.string().trim().min(16).max(128).optional(),
}).strict().refine((value) => Boolean(value.addressId || value.address), { message: 'An address or addressId is required', path: ['address'] });

export const updateOrderStatusSchema = z.object({
  status: z.enum(['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled']),
  note: z.string().trim().max(1000).optional(),
}).strict();

export const addressMutationSchema = addressSchema.strict();
export const updateAddressSchema = addressSchema.partial().strict();
