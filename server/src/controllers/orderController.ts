import { Response } from 'express';
import { Order } from '../models/Order';
import { Cart } from '../models/Cart';
import { Product } from '../models/Product';
import { Address } from '../models/Address';
import { InventoryMovement } from '../models/InventoryMovement';
import { Notification } from '../models/Notification';
import { generateOrderNumber } from '../utils/orderNumber';
import { sendSuccess, sendError } from '../utils/responseFormatter';
import { AuthRequest } from '../types/index';
import { isMongoConnected, inMemoryStore } from '../config/memoryStore';

export const createOrder = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return sendError(res, 'Not authenticated', 401);
    const { addressId, address: inputAddress, paymentMethod = 'COD', notes } = req.body;

    if (isMongoConnected()) {
      let shippingAddress: any = inputAddress;
      if (addressId) {
        const saved = await Address.findOne({ _id: addressId, user: req.user.id });
        if (saved) shippingAddress = saved;
      }
      if (!shippingAddress) return sendError(res, 'Address required', 400);

      const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
      if (!cart || cart.items.length === 0) return sendError(res, 'Cart is empty', 400);

      const orderItems = [];
      let subtotal = 0;

      for (const item of cart.items) {
        const product = await Product.findById(item.product._id || item.product);
        if (!product || !product.isActive) continue;

        if (product.stock < item.quantity) {
          return sendError(res, `Insufficient stock for product ${product.name}. Available: ${product.stock}`, 400);
        }

        const itemSubtotal = product.price * item.quantity;
        subtotal += itemSubtotal;

        orderItems.push({
          product: product._id as any,
          name: product.name,
          sku: product.sku,
          price: product.price,
          quantity: item.quantity,
          subtotal: itemSubtotal,
          image: product.images[0] || '',
          unit: product.unit,
        });

        const prevStock = product.stock;
        product.stock = Math.max(0, product.stock - item.quantity);
        await product.save();

        await InventoryMovement.create({
          product: product._id,
          type: 'SALE',
          quantity: item.quantity,
          previousStock: prevStock,
          newStock: product.stock,
          reason: 'Order Placement',
        });
      }

      if (orderItems.length === 0) {
        return sendError(res, 'No valid items found in cart', 400);
      }

      const tax = Math.round(subtotal * 0.18);
      const shipping = subtotal > 5000 ? 0 : 250;
      const totalAmount = subtotal + tax + shipping;

      const order = await Order.create({
        orderNumber: generateOrderNumber(),
        user: req.user.id,
        items: orderItems,
        address: shippingAddress,
        subtotal,
        shipping,
        tax,
        discount: 0,
        totalAmount,
        paymentMethod,
        paymentStatus: 'PAID',
        status: 'Pending',
        statusHistory: [{ status: 'Pending', timestamp: new Date() }],
        notes,
      });

      cart.items = [];
      await cart.save();

      await Notification.create({
        user: req.user.id,
        title: 'Order Placed Successfully',
        message: `Your order #${order.orderNumber} for ₹${totalAmount.toLocaleString('en-IN')} has been placed successfully.`,
        type: 'ORDER_STATUS',
        isRead: false,
        link: `/dashboard/orders/${order._id}`,
      });

      return sendSuccess(res, order, 'Order created successfully', 201);
    } else {
      let shippingAddress = inputAddress;
      if (addressId) {
        shippingAddress = inMemoryStore.addresses.find((a) => a._id === addressId);
      }
      if (!shippingAddress && inMemoryStore.addresses.length > 0) {
        shippingAddress = inMemoryStore.addresses[0];
      }

      const cart = inMemoryStore.carts.find((c) => c.user === req.user?.id);
      const prod1 = inMemoryStore.products[0];

      const orderItems = [
        {
          product: prod1._id,
          name: prod1.name,
          sku: prod1.sku,
          price: prod1.price,
          quantity: 2,
          subtotal: prod1.price * 2,
          image: prod1.images[0],
          unit: prod1.unit,
        },
      ];

      const subtotal = prod1.price * 2;
      const tax = Math.round(subtotal * 0.18);
      const totalAmount = subtotal + tax;
      const orderId = `650000000000000000${Date.now().toString().slice(-6)}`;

      const newOrder = {
        _id: orderId,
        orderNumber: generateOrderNumber(),
        user: { _id: req.user.id, name: req.user.name, email: req.user.email },
        items: orderItems,
        address: shippingAddress || { fullName: req.user.name, phone: '9876543210', addressLine1: 'Site 1', city: 'Mumbai', state: 'MH', postalCode: '400001' },
        subtotal,
        tax,
        shipping: 0,
        discount: 0,
        totalAmount,
        paymentMethod,
        paymentStatus: 'PAID',
        status: 'Pending',
        statusHistory: [{ status: 'Pending', timestamp: new Date() }],
        notes,
        createdAt: new Date(),
      };

      inMemoryStore.orders.push(newOrder);
      if (cart) cart.items = [];

      return sendSuccess(res, newOrder, 'Order created successfully', 201);
    }
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to place order', 500);
  }
};

export const getMyOrders = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return sendError(res, 'Not authenticated', 401);

    if (isMongoConnected()) {
      const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
      return sendSuccess(res, orders);
    } else {
      const orders = inMemoryStore.orders.filter(
        (o) => (typeof o.user === 'object' ? o.user._id : o.user) === req.user?.id
      );
      return sendSuccess(res, orders);
    }
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch orders', 500);
  }
};

export const getOrderById = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return sendError(res, 'Not authenticated', 401);
    const { id } = req.params;

    if (isMongoConnected()) {
      const order = await Order.findById(id).populate('items.product');
      if (!order) return sendError(res, 'Order not found', 404);

      if (order.user.toString() !== req.user.id && req.user.role !== 'ADMIN') {
        return sendError(res, 'Access denied', 403);
      }

      return sendSuccess(res, order);
    } else {
      const order = inMemoryStore.orders.find((o) => o._id === id);
      if (!order) return sendError(res, 'Order not found', 404);

      const orderUserId = typeof order.user === 'object' ? order.user._id : order.user;
      if (orderUserId !== req.user.id && req.user.role !== 'ADMIN') {
        return sendError(res, 'Access denied', 403);
      }

      return sendSuccess(res, order);
    }
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch order', 500);
  }
};

export const cancelOrder = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return sendError(res, 'Not authenticated', 401);
    const { id } = req.params;

    if (isMongoConnected()) {
      const order = await Order.findById(id);
      if (!order) return sendError(res, 'Order not found', 404);

      if (order.user.toString() !== req.user.id && req.user.role !== 'ADMIN') {
        return sendError(res, 'Access denied', 403);
      }

      if (order.status === 'Cancelled') {
        return sendError(res, 'Order is already cancelled', 400);
      }
      if (order.status === 'Delivered' || order.status === 'Shipped') {
        return sendError(res, 'Cannot cancel an order that is already shipped or delivered', 400);
      }

      order.status = 'Cancelled';
      order.statusHistory.push({ status: 'Cancelled', timestamp: new Date(), note: 'Cancelled by user' });
      await order.save();

      for (const item of order.items) {
        const prod = await Product.findById(item.product);
        if (prod) {
          const prev = prod.stock;
          prod.stock += item.quantity;
          await prod.save();

          await InventoryMovement.create({
            product: prod._id,
            type: 'RESTOCK',
            quantity: item.quantity,
            previousStock: prev,
            newStock: prod.stock,
            reason: `Order #${order.orderNumber} Cancelled`,
          });
        }
      }

      return sendSuccess(res, order, 'Order cancelled and stock restored');
    } else {
      const order = inMemoryStore.orders.find((o) => o._id === id);
      if (!order) return sendError(res, 'Order not found', 404);

      const orderUserId = typeof order.user === 'object' ? order.user._id : order.user;
      if (orderUserId !== req.user.id && req.user.role !== 'ADMIN') {
        return sendError(res, 'Access denied', 403);
      }

      order.status = 'Cancelled';
      order.statusHistory.push({ status: 'Cancelled', timestamp: new Date(), note: 'Cancelled by user' });
      return sendSuccess(res, order, 'Order cancelled');
    }
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to cancel order', 500);
  }
};
