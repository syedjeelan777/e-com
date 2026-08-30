import { Response } from 'express';
import { Cart } from '../models/Cart';
import { Product } from '../models/Product';
import { sendSuccess, sendError } from '../utils/responseFormatter';
import { AuthRequest } from '../types/index';
import { isMongoConnected, inMemoryStore } from '../config/memoryStore';

export const getCart = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return sendError(res, 'Not authenticated', 401);

    if (isMongoConnected()) {
      let cart = await Cart.findOne({ user: req.user.id }).populate({
        path: 'items.product',
        populate: { path: 'category', select: 'name slug' },
      });

      if (!cart) {
        cart = await Cart.create({ user: req.user.id, items: [] });
      }

      let subtotal = 0;
      const items = cart.items
        .filter((item: any) => item.product && item.product.isActive)
        .map((item: any) => {
          const itemSubtotal = item.product.price * item.quantity;
          subtotal += itemSubtotal;
          return {
            _id: item._id,
            product: item.product,
            quantity: item.quantity,
            priceAtAddition: item.priceAtAddition,
            subtotal: itemSubtotal,
            isStockAvailable: item.product.stock >= item.quantity,
            availableStock: item.product.stock,
          };
        });

      return sendSuccess(res, {
        id: cart._id,
        items,
        subtotal,
        totalItems: items.reduce((acc: number, item: any) => acc + item.quantity, 0),
      });
    } else {
      let cart = inMemoryStore.carts.find((c) => c.user === req.user?.id);
      if (!cart) {
        cart = { _id: `650000000000000000${Date.now().toString().slice(-6)}`, user: req.user.id, items: [] };
        inMemoryStore.carts.push(cart);
      }

      let subtotal = 0;
      const items = cart.items.map((item: any) => {
        const prod = inMemoryStore.products.find((p) => p._id === item.product._id || p._id === item.product);
        const price = prod ? prod.price : item.priceAtAddition;
        const itemSubtotal = price * item.quantity;
        subtotal += itemSubtotal;
        return {
          _id: item._id,
          product: prod || item.product,
          quantity: item.quantity,
          priceAtAddition: price,
          subtotal: itemSubtotal,
          isStockAvailable: prod ? prod.stock >= item.quantity : true,
          availableStock: prod ? prod.stock : 99,
        };
      });

      return sendSuccess(res, {
        id: cart._id,
        items,
        subtotal,
        totalItems: items.reduce((acc: number, item: any) => acc + item.quantity, 0),
      });
    }
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch cart', 500);
  }
};

export const addToCart = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return sendError(res, 'Not authenticated', 401);
    const { productId, quantity = 1 } = req.body;

    if (quantity <= 0) return sendError(res, 'Quantity must be at least 1', 400);

    if (isMongoConnected()) {
      const product = await Product.findById(productId);
      if (!product || !product.isActive) return sendError(res, 'Product unavailable', 404);
      if (product.stock < quantity) return sendError(res, `Stock insufficient (${product.stock} left)`, 400);

      let cart = await Cart.findOne({ user: req.user.id });
      if (!cart) cart = new Cart({ user: req.user.id, items: [] });

      const idx = cart.items.findIndex((i) => i.product.toString() === productId);
      if (idx > -1) cart.items[idx].quantity += quantity;
      else cart.items.push({ product: product._id as any, quantity, priceAtAddition: product.price });

      await cart.save();
      return getCart(req, res);
    } else {
      const product = inMemoryStore.products.find((p) => p._id === productId);
      if (!product || !product.isActive) return sendError(res, 'Product unavailable', 404);
      if (product.stock < quantity) return sendError(res, `Stock insufficient (${product.stock} left)`, 400);

      let cart = inMemoryStore.carts.find((c) => c.user === req.user?.id);
      if (!cart) {
        cart = { _id: `650000000000000000${Date.now().toString().slice(-6)}`, user: req.user.id, items: [] };
        inMemoryStore.carts.push(cart);
      }

      const idx = cart.items.findIndex((i: any) => i.product === productId || i.product._id === productId);
      if (idx > -1) {
        cart.items[idx].quantity += quantity;
      } else {
        cart.items.push({
          _id: `item_${Date.now()}`,
          product: product,
          quantity,
          priceAtAddition: product.price,
        });
      }

      return getCart(req, res);
    }
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to add item to cart', 500);
  }
};

export const updateCartItem = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return sendError(res, 'Not authenticated', 401);
    const { itemId } = req.params;
    const { quantity } = req.body;

    if (quantity <= 0) return removeFromCart(req, res);

    if (isMongoConnected()) {
      const cart = await Cart.findOne({ user: req.user.id });
      if (!cart) return sendError(res, 'Cart not found', 404);

      const item = cart.items.find((i: any) => i._id.toString() === itemId);
      if (!item) return sendError(res, 'Item not found in cart', 404);

      item.quantity = quantity;
      await cart.save();
      return getCart(req, res);
    } else {
      const cart = inMemoryStore.carts.find((c) => c.user === req.user?.id);
      if (!cart) return sendError(res, 'Cart not found', 404);

      const item = cart.items.find((i: any) => i._id === itemId);
      if (item) item.quantity = quantity;

      return getCart(req, res);
    }
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to update cart item', 500);
  }
};

export const removeFromCart = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return sendError(res, 'Not authenticated', 401);
    const { itemId } = req.params;

    if (isMongoConnected()) {
      const cart = await Cart.findOne({ user: req.user.id });
      if (cart) {
        cart.items = cart.items.filter((i: any) => i._id.toString() !== itemId) as any;
        await cart.save();
      }
      return getCart(req, res);
    } else {
      const cart = inMemoryStore.carts.find((c) => c.user === req.user?.id);
      if (cart) {
        cart.items = cart.items.filter((i: any) => i._id !== itemId);
      }
      return getCart(req, res);
    }
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to remove item', 500);
  }
};

export const clearCart = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return sendError(res, 'Not authenticated', 401);

    if (isMongoConnected()) {
      await Cart.findOneAndUpdate({ user: req.user.id }, { items: [] });
      return sendSuccess(res, null, 'Cart cleared');
    } else {
      const cart = inMemoryStore.carts.find((c) => c.user === req.user?.id);
      if (cart) cart.items = [];
      return sendSuccess(res, null, 'Cart cleared');
    }
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to clear cart', 500);
  }
};
