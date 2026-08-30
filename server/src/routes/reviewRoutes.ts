import { Router } from 'express';
import {
  getProductReviews,
  createReview,
  updateReview,
  deleteReview,
} from '../controllers/reviewController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router({ mergeParams: true });

router.get('/products/:productId/reviews', getProductReviews);
router.post('/products/:productId/reviews', authenticate, createReview);
router.put('/reviews/:id', authenticate, updateReview);
router.delete('/reviews/:id', authenticate, deleteReview);

export default router;
