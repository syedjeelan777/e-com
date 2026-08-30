import { Response } from 'express';
import { Wishlist } from '../models/Wishlist';
import { sendSuccess, sendError } from '../utils/responseFormatter';
import { AuthRequest } from '../types/index';
import { isMongoConnected, inMemoryStore } from '../config/memoryStore';

export const getWishlist = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return sendError(res, 'Not authenticated', 401);

    if (isMongoConnected()) {
      let wishlist = await Wishlist.findOne({ user: req.user.id }).populate('products');
      if (!wishlist) wishlist = await Wishlist.create({ user: req.user.id, products: [] });
      return sendSuccess(res, wishlist);
    } else {
      let wishlist = inMemoryStore.wishlists.find((w) => w.user === req.user?.id);
      if (!wishlist) {
        wishlist = { _id: `wish_${Date.now()}`, user: req.user.id, products: [inMemoryStore.products[0]] };
        inMemoryStore.wishlists.push(wishlist);
      }
      return sendSuccess(res, wishlist);
    }
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch wishlist', 500);
  }
};

export const addToWishlist = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return sendError(res, 'Not authenticated', 401);
    const { productId } = req.params;

    if (isMongoConnected()) {
      let wishlist = await Wishlist.findOne({ user: req.user.id });
      if (!wishlist) wishlist = new Wishlist({ user: req.user.id, products: [] });
      if (!wishlist.products.includes(productId as any)) {
        wishlist.products.push(productId as any);
        await wishlist.save();
      }
      return getWishlist(req, res);
    } else {
      let wishlist = inMemoryStore.wishlists.find((w) => w.user === req.user?.id);
      if (!wishlist) {
        wishlist = { _id: `wish_${Date.now()}`, user: req.user.id, products: [] };
        inMemoryStore.wishlists.push(wishlist);
      }
      const prod = inMemoryStore.products.find((p) => p._id === productId);
      if (prod && !wishlist.products.some((p: any) => p._id === productId)) {
        wishlist.products.push(prod);
      }
      return getWishlist(req, res);
    }
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to add to wishlist', 500);
  }
};

export const removeFromWishlist = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return sendError(res, 'Not authenticated', 401);
    const { productId } = req.params;

    if (isMongoConnected()) {
      const wishlist = await Wishlist.findOne({ user: req.user.id });
      if (wishlist) {
        wishlist.products = wishlist.products.filter((p) => p.toString() !== productId);
        await wishlist.save();
      }
      return getWishlist(req, res);
    } else {
      const wishlist = inMemoryStore.wishlists.find((w) => w.user === req.user?.id);
      if (wishlist) {
        wishlist.products = wishlist.products.filter((p: any) => p._id !== productId);
      }
      return getWishlist(req, res);
    }
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to remove from wishlist', 500);
  }
};
