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
  try {
    if (!req.user) return sendError(res, 'Not authenticated', 401);
    const { id } = req.params;
    const { rating, comment } = req.body;

    if (isMongoConnected()) {
      const review = await Review.findOneAndUpdate(
        { _id: id, user: req.user.id },
        { rating, comment },
        { new: true }
      );
      if (!review) return sendError(res, 'Review not found or unauthorized', 404);
      return sendSuccess(res, review, 'Review updated');
    } else {
      const review = inMemoryStore.reviews.find((r) => r._id === id && (typeof r.user === 'object' ? r.user._id : r.user) === req.user?.id);
      if (!review) return sendError(res, 'Review not found or unauthorized', 404);
      if (rating) review.rating = rating;
      if (comment) review.comment = comment;
      return sendSuccess(res, review, 'Review updated');
    }
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to update review', 500);
  }
};

export const deleteReview = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return sendError(res, 'Not authenticated', 401);
    const { id } = req.params;

    if (isMongoConnected()) {
      const query: any = { _id: id };
      if (req.user.role !== 'ADMIN') {
        query.user = req.user.id;
      }
      const deleted = await Review.findOneAndDelete(query);
      if (!deleted) return sendError(res, 'Review not found or unauthorized', 404);
      return sendSuccess(res, null, 'Review deleted');
    } else {
      const review = inMemoryStore.reviews.find((r) => r._id === id && (req.user?.role === 'ADMIN' || (typeof r.user === 'object' ? r.user._id : r.user) === req.user?.id));
      if (!review) return sendError(res, 'Review not found or unauthorized', 404);
      inMemoryStore.reviews = inMemoryStore.reviews.filter((r) => r !== review);
      return sendSuccess(res, null, 'Review deleted');
    }
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to delete review', 500);
  }
};
