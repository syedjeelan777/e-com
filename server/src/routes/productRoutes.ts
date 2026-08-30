import { Router } from 'express';
import {
  getProducts,
  getProductById,
  getFeaturedProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController';
import { authenticate, requireRole } from '../middleware/authMiddleware';
import { validateBody } from '../middleware/validator';
import { productSchema } from '../validators/productValidator';

const router = Router();

router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/:id', getProductById);
router.post('/', authenticate, requireRole('ADMIN'), validateBody(productSchema), createProduct);
router.put('/:id', authenticate, requireRole('ADMIN'), updateProduct);
router.delete('/:id', authenticate, requireRole('ADMIN'), deleteProduct);

export default router;
