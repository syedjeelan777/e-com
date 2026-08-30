import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  phone?: string;
  company?: string;
  gstin?: string;
  role: 'USER' | 'ADMIN';
  isActive: boolean;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    phone: { type: String, trim: true },
    company: { type: String, trim: true },
    gstin: { type: String, trim: true },
    role: { type: String, enum: ['USER', 'ADMIN'], default: 'USER' },
    isActive: { type: Boolean, default: true },
    avatar: { type: String },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>('User', UserSchema);
