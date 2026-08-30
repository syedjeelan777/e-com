import { Response } from 'express';
import { Address } from '../models/Address';
import { sendSuccess, sendError } from '../utils/responseFormatter';
import { AuthRequest } from '../types/index';
import { isMongoConnected, inMemoryStore } from '../config/memoryStore';

export const getAddresses = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return sendError(res, 'Not authenticated', 401);

    if (isMongoConnected()) {
      const addresses = await Address.find({ user: req.user.id });
      return sendSuccess(res, addresses);
    } else {
      const addresses = inMemoryStore.addresses.filter((a) => a.user === req.user?.id);
      return sendSuccess(res, addresses);
    }
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch addresses', 500);
  }
};

export const createAddress = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return sendError(res, 'Not authenticated', 401);
    const data = req.body;

    if (isMongoConnected()) {
      const address = await Address.create({ ...data, user: req.user.id });
      return sendSuccess(res, address, 'Address added', 201);
    } else {
      const addrId = `650000000000000000${Date.now().toString().slice(-6)}`;
      const newAddress = {
        _id: addrId,
        user: req.user.id,
        ...data,
        isDefault: inMemoryStore.addresses.length === 0,
      };
      inMemoryStore.addresses.push(newAddress);
      return sendSuccess(res, newAddress, 'Address added', 201);
    }
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to add address', 500);
  }
};

export const updateAddress = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return sendError(res, 'Not authenticated', 401);
    const { id } = req.params;
    const data = req.body;

    if (isMongoConnected()) {
      const address = await Address.findOneAndUpdate({ _id: id, user: req.user.id }, data, { new: true });
      if (!address) return sendError(res, 'Address not found or unauthorized', 404);
      return sendSuccess(res, address, 'Address updated');
    } else {
      const address = inMemoryStore.addresses.find((a) => a._id === id && a.user === req.user?.id);
      if (!address) return sendError(res, 'Address not found or unauthorized', 404);
      Object.assign(address, data);
      return sendSuccess(res, address, 'Address updated');
    }
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to update address', 500);
  }
};

export const deleteAddress = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return sendError(res, 'Not authenticated', 401);
    const { id } = req.params;

    if (isMongoConnected()) {
      await Address.findOneAndDelete({ _id: id, user: req.user.id });
      return sendSuccess(res, null, 'Address deleted');
    } else {
      inMemoryStore.addresses = inMemoryStore.addresses.filter((a) => a._id === id && a.user === req.user?.id);
      return sendSuccess(res, null, 'Address deleted');
    }
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to delete address', 500);
  }
};

export const setDefaultAddress = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return sendError(res, 'Not authenticated', 401);
    const { id } = req.params;

    if (isMongoConnected()) {
      await Address.updateMany({ user: req.user.id }, { isDefault: false });
      const address = await Address.findOneAndUpdate({ _id: id, user: req.user.id }, { isDefault: true }, { new: true });
      return sendSuccess(res, address, 'Default address set');
    } else {
      inMemoryStore.addresses.forEach((a) => {
        if (a.user === req.user?.id) a.isDefault = a._id === id;
      });
      return sendSuccess(res, null, 'Default address set');
    }
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to set default address', 500);
  }
};
