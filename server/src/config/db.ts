import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { MONGODB_URI } from './env';
import { seedInMemoryStore } from './memoryStore';

let mongoMemoryServer: MongoMemoryServer | null = null;

export const connectDB = async (): Promise<void> => {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  try {
    let uri = MONGODB_URI;

    if (!uri) {
      try {
        console.log('Attempting MongoMemoryServer startup...');
        mongoMemoryServer = await MongoMemoryServer.create({
          binary: { version: '7.0.3' },
        });
        uri = mongoMemoryServer.getUri();
      } catch (memErr) {
        console.warn('MongoMemoryServer download failed. Initializing in-memory fallback store...');
        await seedInMemoryStore();
        return;
      }
    }

    await mongoose.connect(uri);
    console.log(`MongoDB connected successfully to ${mongoose.connection.host}`);
  } catch (error) {
    console.warn('MongoDB URI connection failed. Initializing in-memory fallback store...');
    await seedInMemoryStore();
  }
};

export const closeDB = async (): Promise<void> => {
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
    if (mongoMemoryServer) {
      await mongoMemoryServer.stop();
      mongoMemoryServer = null;
    }
  } catch (error) {
    console.error('Error closing MongoDB connection:', error);
  }
};
