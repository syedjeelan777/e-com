import { Request, Response } from 'express';
import { Product } from '../models/Product';
import { Category } from '../models/Category';
import { InventoryMovement } from '../models/InventoryMovement';
import { sendSuccess, sendError } from '../utils/responseFormatter';
import { AuthRequest } from '../types/index';
import { isMongoConnected, inMemoryStore } from '../config/memoryStore';

export const getProducts = async (req: Request, res: Response) => {
  try {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      sort,
      page = '1',
      limit = '12',
      inStock,
      isFeatured,
      brand,
    } = req.query;

    if (isMongoConnected()) {
      const query: any = { isActive: true };

      if (search && typeof search === 'string' && search.trim() !== '') {
        const escapedSearch = search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const searchRegex = new RegExp(escapedSearch, 'i');
        query.$or = [
          { name: searchRegex },
          { description: searchRegex },
          { brand: searchRegex },
          { sku: searchRegex },
          { tags: searchRegex },
        ];
      }

      if (category && typeof category === 'string') {
        if (category.match(/^[0-9a-fA-F]{24}$/)) {
          query.category = category;
        } else {
          const foundCategory = await Category.findOne({ slug: category });
          if (foundCategory) {
            query.category = foundCategory._id;
          } else {
            query.category = null;
          }
        }
      }

      if (brand && typeof brand === 'string') {
        const escapedBrand = brand.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        query.brand = new RegExp(escapedBrand, 'i');
      }

      if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = Number(minPrice);
        if (maxPrice) query.price.$lte = Number(maxPrice);
      }

      if (inStock === 'true') {
        query.stock = { $gt: 0 };
      }

      if (isFeatured === 'true') {
        query.isFeatured = true;
      }

      let sortOption: any = { createdAt: -1 };
      if (sort === 'price_asc') sortOption = { price: 1 };
      else if (sort === 'price_desc') sortOption = { price: -1 };
      else if (sort === 'rating') sortOption = { rating: -1 };
      else if (sort === 'popular') sortOption = { reviewCount: -1 };
      else if (sort === 'newest') sortOption = { createdAt: -1 };

      const pageNum = Math.max(1, parseInt(page as string, 10));
      const limitNum = Math.max(1, Math.min(100, parseInt(limit as string, 10)));
      const skip = (pageNum - 1) * limitNum;

      const [products, total] = await Promise.all([
        Product.find(query)
          .populate('category', 'name slug')
          .sort(sortOption)
          .skip(skip)
          .limit(limitNum),
        Product.countDocuments(query),
      ]);

      const pages = Math.ceil(total / limitNum) || 1;

      return sendSuccess(res, products, 'Products retrieved successfully', 200, {
        page: pageNum,
        limit: limitNum,
        total,
        pages,
      });
    } else {
      // In Memory Search & Filter
      let filtered = [...inMemoryStore.products].filter((p) => p.isActive);

      if (search && typeof search === 'string' && search.trim() !== '') {
        const term = search.trim().toLowerCase();
        filtered = filtered.filter(
          (p) =>
            p.name.toLowerCase().includes(term) ||
            p.description.toLowerCase().includes(term) ||
            p.sku.toLowerCase().includes(term) ||
            p.brand.toLowerCase().includes(term)
        );
      }

      if (category && typeof category === 'string') {
        filtered = filtered.filter((p) => {
          const catSlug = typeof p.category === 'object' ? p.category.slug : p.category;
          const catId = typeof p.category === 'object' ? p.category._id : p.category;
          return catSlug === category || catId === category;
        });
      }

      if (minPrice) filtered = filtered.filter((p) => p.price >= Number(minPrice));
      if (maxPrice) filtered = filtered.filter((p) => p.price <= Number(maxPrice));
      if (inStock === 'true') filtered = filtered.filter((p) => p.stock > 0);
      if (isFeatured === 'true') filtered = filtered.filter((p) => p.isFeatured);

      if (sort === 'price_asc') filtered.sort((a, b) => a.price - b.price);
      else if (sort === 'price_desc') filtered.sort((a, b) => b.price - a.price);

      const pageNum = Math.max(1, parseInt(page as string, 10));
      const limitNum = Math.max(1, parseInt(limit as string, 10));
      const total = filtered.length;
      const pages = Math.ceil(total / limitNum) || 1;
      const paginated = filtered.slice((pageNum - 1) * limitNum, pageNum * limitNum);

      return sendSuccess(res, paginated, 'Products retrieved successfully', 200, {
        page: pageNum,
        limit: limitNum,
        total,
        pages,
      });
    }
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch products', 500);
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (isMongoConnected()) {
      let product;
      if (id.match(/^[0-9a-fA-F]{24}$/)) {
        product = await Product.findById(id).populate('category', 'name slug');
      } else {
        product = await Product.findOne({ slug: id }).populate('category', 'name slug');
      }

      if (!product) {
        return sendError(res, 'Product not found', 404);
      }
      return sendSuccess(res, product);
    } else {
      const product = inMemoryStore.products.find(
        (p) => p._id === id || p.slug === id
      );
      if (!product) {
        return sendError(res, 'Product not found', 404);
      }
      return sendSuccess(res, product);
    }
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch product', 500);
  }
};

export const getFeaturedProducts = async (req: Request, res: Response) => {
  try {
    if (isMongoConnected()) {
      const products = await Product.find({ isActive: true, isFeatured: true })
        .populate('category', 'name slug')
        .limit(8);
      return sendSuccess(res, products);
    } else {
      const products = inMemoryStore.products.filter((p) => p.isFeatured && p.isActive).slice(0, 8);
      return sendSuccess(res, products);
    }
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch featured products', 500);
  }
};

export const createProduct = async (req: AuthRequest, res: Response) => {
  try {
    const data = req.body;
    const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const sku = data.sku || `SKU-${Date.now()}`;

    if (isMongoConnected()) {
      const existingSku = await Product.findOne({ sku });
      if (existingSku) return sendError(res, 'Product with this SKU already exists', 409);

      const product = await Product.create({ ...data, slug, sku });
      return sendSuccess(res, product, 'Product created successfully', 201);
    } else {
      const prodId = `650000000000000000${Date.now().toString().slice(-6)}`;
      const newProduct = {
        _id: prodId,
        ...data,
        slug,
        sku,
        rating: 5,
        reviewCount: 1,
        isActive: true,
        createdAt: new Date(),
      };
      inMemoryStore.products.push(newProduct);
      return sendSuccess(res, newProduct, 'Product created successfully', 201);
    }
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to create product', 500);
  }
};

export const updateProduct = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;

    if (isMongoConnected()) {
      const product = await Product.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true, strict: true }).populate('category', 'name slug');
      if (!product) return sendError(res, 'Product not found', 404);
      return sendSuccess(res, product, 'Product updated successfully');
    } else {
      const product = inMemoryStore.products.find((p) => p._id === id);
      if (!product) return sendError(res, 'Product not found', 404);
      Object.assign(product, data);
      return sendSuccess(res, product, 'Product updated successfully');
    }
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to update product', 500);
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (isMongoConnected()) {
      const product = await Product.findByIdAndUpdate(id, { isActive: false }, { new: true });
      if (!product) return sendError(res, 'Product not found', 404);
      return sendSuccess(res, null, 'Product deactivated successfully');
    } else {
      const product = inMemoryStore.products.find((p) => p._id === id);
      if (!product) return sendError(res, 'Product not found', 404);
      product.isActive = false;
      return sendSuccess(res, null, 'Product deactivated successfully');
    }
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to delete product', 500);
  }
};
