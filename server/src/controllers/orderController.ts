import { Response } from 'express';
import mongoose from 'mongoose';
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
import { NODE_ENV } from '../config/env';

const validTransitions: Record<string, string[]> = {
  Pending: ['Confirmed', 'Cancelled'], Confirmed: ['Processing', 'Cancelled'],
  Processing: ['Shipped'], Shipped: ['Delivered'], Delivered: [], Cancelled: [],
};

export const createOrder = async (req: AuthRequest, res: Response) => {
  if (!req.user) return sendError(res, 'Not authenticated', 401);
  const idempotencyKey = String(req.header('Idempotency-Key') || req.body.idempotencyKey || '').trim();
  if (idempotencyKey.length < 16 || idempotencyKey.length > 128) return sendError(res, 'A valid Idempotency-Key is required', 422);
  const { addressId, address: inputAddress, paymentMethod = 'COD', notes } = req.body;
  if (NODE_ENV === 'production' && paymentMethod === 'DEMO_CARD') return sendError(res, 'Demo payments are disabled in production', 422);

  if (!isMongoConnected()) {
    // The development fallback is deliberately conservative: it never claims payment
    // and uses the same server-side price calculation as the database path.
    const existing = inMemoryStore.orders.find((o: any) => o.user === req.user?.id && o.idempotencyKey === idempotencyKey);
    if (existing) return sendSuccess(res, existing, 'Order already created');
    const address = addressId ? inMemoryStore.addresses.find((a) => a._id === addressId && a.user === req.user?.id) : inputAddress;
    if (!address) return sendError(res, 'Address is required and must belong to the current user', 400);
    const cart = inMemoryStore.carts.find((c) => c.user === req.user?.id);
    if (!cart || !cart.items.length) return sendError(res, 'Cart is empty', 400);
    const orderItems: any[] = [];
    for (const item of cart.items) {
      const product = inMemoryStore.products.find((p) => p._id === (typeof item.product === 'object' ? item.product._id : item.product));
      if (!product || !product.isActive) return sendError(res, 'Cart contains an unavailable product', 409);
      if (!Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > product.stock) return sendError(res, `Insufficient stock for ${product.name}`, 409);
      orderItems.push({ product: product._id, name: product.name, sku: product.sku, price: product.price, quantity: item.quantity, subtotal: product.price * item.quantity, image: product.images?.[0], unit: product.unit });
    }
    const subtotal = orderItems.reduce((sum, item) => sum + item.subtotal, 0);
    const tax = Math.round(subtotal * 0.18); const shipping = subtotal > 5000 ? 0 : 250;
    orderItems.forEach((item) => { const p = inMemoryStore.products.find((x) => x._id === item.product); p.stock -= item.quantity; });
    const order = { _id: `order_${Date.now()}`, orderNumber: generateOrderNumber(), user: req.user.id, items: orderItems, address, subtotal, tax, shipping, discount: 0, totalAmount: subtotal + tax + shipping, paymentMethod, paymentStatus: 'PENDING', status: 'Pending', statusHistory: [{ status: 'Pending', timestamp: new Date() }], notes, idempotencyKey, createdAt: new Date() };
    inMemoryStore.orders.push(order); cart.items = [];
    return sendSuccess(res, order, 'Order created; payment is pending confirmation', 201);
  }

  const session = await mongoose.startSession();
  try {
    let created: any;
    let wasCreated = false;
    await session.withTransaction(async () => {
      const existing = await Order.findOne({ user: req.user!.id, idempotencyKey }).session(session);
      if (existing) { created = existing; return; }
      let shippingAddress: any = inputAddress;
      if (addressId) shippingAddress = await Address.findOne({ _id: addressId, user: req.user!.id }).lean().session(session);
      if (!shippingAddress) throw Object.assign(new Error('Address is required and must belong to the current user'), { statusCode: 400 });
      const cart = await Cart.findOne({ user: req.user!.id }).session(session);
      if (!cart || !cart.items.length) throw Object.assign(new Error('Cart is empty'), { statusCode: 400 });
      const orderItems: any[] = [];
      let subtotal = 0;
      for (const item of cart.items) {
        const productId = item.product.toString();
        const product = await Product.findById(productId).session(session);
        if (!product || !product.isActive) throw Object.assign(new Error('Cart contains an unavailable product'), { statusCode: 409 });
        if (!Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 1000) throw Object.assign(new Error('Invalid cart quantity'), { statusCode: 422 });
        const reserved = await Product.findOneAndUpdate({ _id: product._id, isActive: true, stock: { $gte: item.quantity } }, { $inc: { stock: -item.quantity } }, { new: true, session });
        if (!reserved) throw Object.assign(new Error(`Insufficient stock for ${product.name}`), { statusCode: 409 });
        const itemSubtotal = product.price * item.quantity; subtotal += itemSubtotal;
        orderItems.push({ product: product._id, name: product.name, sku: product.sku, price: product.price, quantity: item.quantity, subtotal: itemSubtotal, image: product.images[0] || '', unit: product.unit });
        await InventoryMovement.create([{ product: product._id, type: 'SALE', quantity: item.quantity, previousStock: product.stock, newStock: reserved.stock, reason: 'Order placement' }], { session });
      }
      const tax = Math.round(subtotal * 0.18); const shipping = subtotal > 5000 ? 0 : 250;
      const docs = await Order.create([{ orderNumber: generateOrderNumber(), user: req.user!.id, items: orderItems, address: shippingAddress, subtotal, shipping, tax, discount: 0, totalAmount: subtotal + tax + shipping, paymentMethod, paymentStatus: 'PENDING', status: 'Pending', statusHistory: [{ status: 'Pending', timestamp: new Date() }], notes, idempotencyKey }], { session });
      created = docs[0];
      wasCreated = true;
      cart.items = []; await cart.save({ session });
      await Notification.create([{ user: req.user!.id, title: 'Order placed', message: `Order #${created.orderNumber} is awaiting payment confirmation.`, type: 'ORDER_STATUS', link: `/dashboard/orders/${created._id}` }], { session });
    });
    return sendSuccess(res, created, wasCreated ? 'Order created; payment is pending confirmation' : 'Order already created', wasCreated ? 201 : 200);
  } catch (error: any) { return sendError(res, error.message || 'Failed to place order', error.statusCode || 500); }
  finally { await session.endSession(); }
};

export const getMyOrders = async (req: AuthRequest, res: Response) => {
  if (!req.user) return sendError(res, 'Not authenticated', 401);
  try { const orders = isMongoConnected() ? await Order.find({ user: req.user.id }).sort({ createdAt: -1 }) : inMemoryStore.orders.filter((o: any) => o.user === req.user?.id); return sendSuccess(res, orders); }
  catch { return sendError(res, 'Failed to fetch orders', 500); }
};

export const getOrderById = async (req: AuthRequest, res: Response) => {
  if (!req.user) return sendError(res, 'Not authenticated', 401);
  try {
    const order: any = isMongoConnected() ? await Order.findOne({ _id: req.params.id, ...(req.user.role === 'ADMIN' ? {} : { user: req.user.id }) }).populate('items.product') : inMemoryStore.orders.find((o: any) => o._id === req.params.id && (o.user === req.user?.id || req.user?.role === 'ADMIN'));
    if (!order) return sendError(res, 'Order not found', 404);
    return sendSuccess(res, order);
  } catch { return sendError(res, 'Order not found', 404); }
};

export const cancelOrder = async (req: AuthRequest, res: Response) => {
  if (!req.user) return sendError(res, 'Not authenticated', 401);
  try {
    if (!isMongoConnected()) { const order: any = inMemoryStore.orders.find((o) => o._id === req.params.id && (o.user === req.user?.id || req.user?.role === 'ADMIN')); if (!order) return sendError(res, 'Order not found', 404); if (!validTransitions[order.status]?.includes('Cancelled')) return sendError(res, 'Order cannot be cancelled in its current state', 409); order.status = 'Cancelled'; order.statusHistory.push({ status: 'Cancelled', timestamp: new Date(), note: 'Cancelled by user' }); return sendSuccess(res, order, 'Order cancelled'); }
    const session = await mongoose.startSession(); let result: any;
    await session.withTransaction(async () => {
      const order = await Order.findOne({ _id: req.params.id, ...(req.user!.role === 'ADMIN' ? {} : { user: req.user!.id }) }).session(session);
      if (!order) throw Object.assign(new Error('Order not found'), { statusCode: 404 });
      if (!validTransitions[order.status]?.includes('Cancelled')) throw Object.assign(new Error('Order cannot be cancelled in its current state'), { statusCode: 409 });
      for (const item of order.items) { await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity } }, { session }); }
      order.status = 'Cancelled'; order.statusHistory.push({ status: 'Cancelled', timestamp: new Date(), note: `Cancelled by ${req.user!.role.toLowerCase()}` }); await order.save({ session }); result = order;
    }); await session.endSession(); return sendSuccess(res, result, 'Order cancelled and stock restored');
  } catch (error: any) { return sendError(res, error.message || 'Failed to cancel order', error.statusCode || 500); }
};
