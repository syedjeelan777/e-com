import mongoose, { Schema, Document } from 'mongoose';

export interface ISpecification {
  key: string;
  value: string;
}

export interface IProduct extends Document {
  name: string;
  slug: string;
  sku: string;
  description: string;
  shortDescription?: string;
  price: number;
  compareAtPrice?: number;
  category: mongoose.Types.ObjectId;
  brand: string;
  images: string[];
  stock: number;
  lowStockThreshold: number;
  unit: string;
  minOrderQuantity: number;
  specifications: ISpecification[];
  tags: string[];
  rating: number;
  reviewCount: number;
  isFeatured: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    sku: { type: String, required: true, unique: true, trim: true },
    description: { type: String, required: true },
    shortDescription: { type: String, trim: true },
    price: { type: Number, required: true, min: 0 },
    compareAtPrice: { type: Number, min: 0 },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true, index: true },
    brand: { type: String, required: true, trim: true },
    images: [{ type: String, required: true }],
    stock: { type: Number, required: true, min: 0, default: 0 },
    lowStockThreshold: { type: Number, default: 10 },
    unit: { type: String, required: true, default: 'Piece' },
    minOrderQuantity: { type: Number, default: 1, min: 1 },
    specifications: [
      {
        key: { type: String, required: true, trim: true },
        value: { type: String, required: true, trim: true },
      },
    ],
    tags: [{ type: String, trim: true }],
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0, min: 0 },
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

ProductSchema.index({ name: 'text', description: 'text', brand: 'text', tags: 'text' });
ProductSchema.index({ price: 1 });
ProductSchema.index({ category: 1, price: 1 });

export const Product = mongoose.model<IProduct>('Product', ProductSchema);
