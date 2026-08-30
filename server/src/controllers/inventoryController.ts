import { Request, Response } from 'express';
import { Product } from '../models/Product';
import { InventoryMovement } from '../models/InventoryMovement';
import { sendSuccess, sendError } from '../utils/responseFormatter';
import { AuthRequest } from '../types/index';
import { isMongoConnected, inMemoryStore } from '../config/memoryStore';

export const getInventory = async (req: Request, res: Response) => {
  try {
    const { status, search } = req.query;

    if (isMongoConnected()) {
      const query: any = { isActive: true };
      const products = await Product.find(query).populate('category');
      const items = products.map((p) => ({
        _id: p._id,
        name: p.name,
        sku: p.sku,
        brand: p.brand,
        category: p.category,
        stock: p.stock,
        lowStockThreshold: p.lowStockThreshold,
        unit: p.unit,
        price: p.price,
        status: p.stock === 0 ? 'OUT OF STOCK' : p.stock <= p.lowStockThreshold ? 'LOW STOCK' : 'IN STOCK',
        updatedAt: p.updatedAt,
      }));
      return sendSuccess(res, items);
    } else {
      let products = [...inMemoryStore.products].filter((p) => p.isActive);
      if (search && typeof search === 'string') {
        const term = search.toLowerCase();
        products = products.filter((p) => p.name.toLowerCase().includes(term) || p.sku.toLowerCase().includes(term));
      }

      const items = products.map((p) => ({
        _id: p._id,
        name: p.name,
        sku: p.sku,
        brand: p.brand,
        category: p.category,
        stock: p.stock,
        lowStockThreshold: p.lowStockThreshold,
        unit: p.unit,
        price: p.price,
        status: p.stock === 0 ? 'OUT OF STOCK' : p.stock <= p.lowStockThreshold ? 'LOW STOCK' : 'IN STOCK',
        updatedAt: new Date(),
      }));

      return sendSuccess(res, items);
    }
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch inventory', 500);
  }
};

export const updateProductStock = async (req: AuthRequest, res: Response) => {
  try {
    const { productId } = req.params;
    const { stock, lowStockThreshold, reason } = req.body;

    if (stock < 0) return sendError(res, 'Stock cannot be negative', 400);

    if (isMongoConnected()) {
      const product = await Product.findById(productId);
      if (!product) return sendError(res, 'Product not found', 404);

      const prev = product.stock;
      product.stock = stock;
      if (lowStockThreshold !== undefined) product.lowStockThreshold = lowStockThreshold;
      await product.save();

      const movement = await InventoryMovement.create({
        product: product._id,
        type: 'ADJUSTMENT',
        quantity: Math.abs(stock - prev),
        previousStock: prev,
        newStock: stock,
        reason: reason || 'Admin Update',
      });

      return sendSuccess(res, { product, movement }, 'Inventory updated');
    } else {
      const product = inMemoryStore.products.find((p) => p._id === productId);
      if (!product) return sendError(res, 'Product not found', 404);

      const prev = product.stock;
      product.stock = stock;
      if (lowStockThreshold !== undefined) product.lowStockThreshold = lowStockThreshold;

      const movement = {
        _id: `mov_${Date.now()}`,
        product,
        type: 'ADJUSTMENT' as const,
        quantity: Math.abs(stock - prev),
        previousStock: prev,
        newStock: stock,
        reason: reason || 'Admin Update',
        createdAt: new Date(),
      };
      inMemoryStore.movements.push(movement);

      return sendSuccess(res, { product, movement }, 'Inventory updated');
    }
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to update inventory', 500);
  }
};

export const getInventoryMovements = async (req: Request, res: Response) => {
  try {
    if (isMongoConnected()) {
      const movements = await InventoryMovement.find().populate('product').sort({ createdAt: -1 });
      return sendSuccess(res, movements);
    } else {
      return sendSuccess(res, inMemoryStore.movements);
    }
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch movements', 500);
  }
};
