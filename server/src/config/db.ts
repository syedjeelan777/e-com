import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { MONGODB_URI, isProduction } from './env';
import { seedInMemoryStore } from './memoryStore';
let mongoMemoryServer: MongoMemoryServer | null = null;

export const connectDB = async (): Promise<void> => {
  if (mongoose.connection.readyState === 1) return;
  try {
    let uri = MONGODB_URI;
    if (!uri && !isProduction) {
      mongoMemoryServer = await MongoMemoryServer.create({ binary: { version: '7.0.3' } });
      uri = mongoMemoryServer.getUri();
    }
    if (!uri) throw new Error('MONGODB_URI is required');
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log(`MongoDB connected successfully to ${mongoose.connection.host}`);
  } catch (error) {
    if (isProduction) throw error;
    console.warn('MongoDB unavailable in development; using the non-persistent development store.');
    await seedInMemoryStore();
  }
};

export const closeDB = async (): Promise<void> => {
  if (mongoose.connection.readyState !== 0) await mongoose.connection.close();
  if (mongoMemoryServer) { await mongoMemoryServer.stop(); mongoMemoryServer = null; }
};
