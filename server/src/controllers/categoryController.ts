import { Request, Response } from 'express';
import { Category } from '../models/Category';
import { sendSuccess, sendError } from '../utils/responseFormatter';
import { isMongoConnected, inMemoryStore } from '../config/memoryStore';

export const getCategories = async (req: Request, res: Response) => {
  try {
    if (isMongoConnected()) {
      const categories = await Category.find({ isActive: true }).sort({ name: 1 });
      return sendSuccess(res, categories);
    } else {
      const categories = inMemoryStore.categories.filter((c) => c.isActive);
      return sendSuccess(res, categories);
    }
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch categories', 500);
  }
};

export const getCategoryById = async (req: Request, res: Response) => {
  try {
    if (isMongoConnected()) {
      const category = await Category.findById(req.params.id);
      if (!category) return sendError(res, 'Category not found', 404);
      return sendSuccess(res, category);
    } else {
      const category = inMemoryStore.categories.find((c) => c._id === req.params.id);
      if (!category) return sendError(res, 'Category not found', 404);
      return sendSuccess(res, category);
    }
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch category', 500);
  }
};

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, description, image } = req.body;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    if (isMongoConnected()) {
      const category = await Category.create({ name, slug, description, image });
      return sendSuccess(res, category, 'Category created successfully', 201);
    } else {
      const catId = `650000000000000000${Date.now().toString().slice(-6)}`;
      const newCategory = { _id: catId, name, slug, description, image, isActive: true };
      inMemoryStore.categories.push(newCategory);
      return sendSuccess(res, newCategory, 'Category created successfully', 201);
    }
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to create category', 500);
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;

    if (isMongoConnected()) {
      const category = await Category.findByIdAndUpdate(id, data, { new: true });
      if (!category) return sendError(res, 'Category not found', 404);
      return sendSuccess(res, category, 'Category updated');
    } else {
      const category = inMemoryStore.categories.find((c) => c._id === id);
      if (!category) return sendError(res, 'Category not found', 404);
      Object.assign(category, data);
      return sendSuccess(res, category, 'Category updated');
    }
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to update category', 500);
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (isMongoConnected()) {
      await Category.findByIdAndDelete(id);
      return sendSuccess(res, null, 'Category deleted');
    } else {
      inMemoryStore.categories = inMemoryStore.categories.filter((c) => c._id !== id);
      return sendSuccess(res, null, 'Category deleted');
    }
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to delete category', 500);
  }
};
