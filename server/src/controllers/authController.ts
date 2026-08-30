import { Request, Response } from 'express';
import { User } from '../models/User';
import { hashPassword, comparePassword } from '../utils/password';
import { generateToken } from '../utils/jwt';
import { sendSuccess, sendError } from '../utils/responseFormatter';
import { AuthRequest } from '../types/index';
import { isMongoConnected, inMemoryStore } from '../config/memoryStore';

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, phone, company, gstin } = req.body;
    const lowerEmail = email.toLowerCase();

    if (isMongoConnected()) {
      const existingUser = await User.findOne({ email: lowerEmail });
      if (existingUser) {
        return sendError(res, 'User with this email already exists', 409);
      }

      const hashedPassword = await hashPassword(password);
      const user = await User.create({
        name,
        email: lowerEmail,
        password: hashedPassword,
        phone,
        company,
        gstin,
        role: 'USER',
      });

      const token = generateToken({
        id: (user._id as any).toString(),
        email: user.email,
        role: user.role,
        name: user.name,
      });

      return sendSuccess(
        res,
        {
          token,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            phone: user.phone,
            company: user.company,
            gstin: user.gstin,
          },
        },
        'User registered successfully',
        201
      );
    } else {
      const existingUser = inMemoryStore.users.find((u) => u.email === lowerEmail);
      if (existingUser) {
        return sendError(res, 'User with this email already exists', 409);
      }

      const hashedPassword = await hashPassword(password);
      const userId = `650000000000000000${Date.now().toString().slice(-6)}`;
      const newUser = {
        _id: userId,
        name,
        email: lowerEmail,
        password: hashedPassword,
        phone,
        company,
        gstin,
        role: 'USER' as const,
        isActive: true,
        createdAt: new Date(),
      };

      inMemoryStore.users.push(newUser);

      const token = generateToken({
        id: userId,
        email: lowerEmail,
        role: 'USER',
        name,
      });

      return sendSuccess(
        res,
        {
          token,
          user: {
            id: userId,
            name,
            email: lowerEmail,
            role: 'USER',
            phone,
            company,
            gstin,
          },
        },
        'User registered successfully',
        201
      );
    }
  } catch (error: any) {
    return sendError(res, error.message || 'Registration failed', 500);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const lowerEmail = email.toLowerCase();

    if (isMongoConnected()) {
      const user = await User.findOne({ email: lowerEmail }).select('+password');
      if (!user) {
        return sendError(res, 'Invalid credentials', 401);
      }

      if (!user.isActive) {
        return sendError(res, 'Account is deactivated. Please contact support.', 403);
      }

      const isMatch = await comparePassword(password, user.password || '');
      if (!isMatch) {
        return sendError(res, 'Invalid credentials', 401);
      }

      const token = generateToken({
        id: (user._id as any).toString(),
        email: user.email,
        role: user.role,
        name: user.name,
      });

      return sendSuccess(
        res,
        {
          token,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            phone: user.phone,
            company: user.company,
            gstin: user.gstin,
          },
        },
        'Login successful'
      );
    } else {
      const user = inMemoryStore.users.find((u) => u.email === lowerEmail);
      if (!user) {
        return sendError(res, 'Invalid credentials', 401);
      }

      const isMatch = await comparePassword(password, user.password);
      if (!isMatch) {
        return sendError(res, 'Invalid credentials', 401);
      }

      const token = generateToken({
        id: user._id,
        email: user.email,
        role: user.role,
        name: user.name,
      });

      return sendSuccess(
        res,
        {
          token,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            phone: user.phone,
            company: user.company,
            gstin: user.gstin,
          },
        },
        'Login successful'
      );
    }
  } catch (error: any) {
    return sendError(res, error.message || 'Login failed', 500);
  }
};

export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return sendError(res, 'Not authenticated', 401);

    if (isMongoConnected()) {
      const user = await User.findById(req.user.id);
      if (!user) return sendError(res, 'User not found', 404);

      return sendSuccess(res, {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        company: user.company,
        gstin: user.gstin,
        isActive: user.isActive,
      });
    } else {
      const user = inMemoryStore.users.find((u) => u._id === req.user?.id);
      if (!user) return sendError(res, 'User not found', 404);

      return sendSuccess(res, {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        company: user.company,
        gstin: user.gstin,
        isActive: user.isActive,
      });
    }
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch user profile', 500);
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return sendError(res, 'Not authenticated', 401);
    const { name, phone, company, gstin } = req.body;

    if (isMongoConnected()) {
      const user = await User.findByIdAndUpdate(
        req.user.id,
        { name, phone, company, gstin },
        { new: true, runValidators: true }
      );
      if (!user) return sendError(res, 'User not found', 404);

      return sendSuccess(res, {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        company: user.company,
        gstin: user.gstin,
      });
    } else {
      const user = inMemoryStore.users.find((u) => u._id === req.user?.id);
      if (!user) return sendError(res, 'User not found', 404);

      if (name) user.name = name;
      if (phone) user.phone = phone;
      if (company) user.company = company;
      if (gstin) user.gstin = gstin;

      return sendSuccess(res, {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        company: user.company,
        gstin: user.gstin,
      });
    }
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to update profile', 500);
  }
};

export const logout = async (req: Request, res: Response) => {
  return sendSuccess(res, null, 'Logged out successfully');
};
