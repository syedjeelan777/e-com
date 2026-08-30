import { Request, Response } from 'express';
import { Review } from '../models/Review';
import { sendSuccess, sendError } from '../utils/responseFormatter';
import { AuthRequest } from '../types/index';
import { isMongoConnected, inMemoryStore } from '../config/memoryStore';

export const getProductReviews = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    if (isMongoConnected()) {
      const reviews = await Review.find({ product: productId }).populate('user', 'name company');
      return sendSuccess(res, reviews);
    } else {
      const reviews = inMemoryStore.reviews.filter(
        (r) => (typeof r.product === 'object' ? r.product._id : r.product) === productId
      );
      return sendSuccess(res, reviews);
    }
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch reviews', 500);
  }
};

export const createReview = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return sendError(res, 'Not authenticated', 401);
    const { productId } = req.params;
    const { rating, comment } = req.body;

    if (isMongoConnected()) {
      const review = await Review.create({ user: req.user.id, product: productId, rating, comment });
      return sendSuccess(res, review, 'Review created', 201);
    } else {
      const review = {
        _id: `rev_${Date.now()}`,
        user: { _id: req.user.id, name: req.user.name },
        product: productId,
        rating,
        comment,
        createdAt: new Date(),
      };
      inMemoryStore.reviews.push(review);
      return sendSuccess(res, review, 'Review created', 201);
    }
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to create review', 500);
  }
};

export const updateReview = async (req: AuthRequest, res: Response) => {
  return sendSuccess(res, null, 'Review updated');
};

export const deleteReview = async (req: AuthRequest, res: Response) => {
  return sendSuccess(res, null, 'Review deleted');
};
