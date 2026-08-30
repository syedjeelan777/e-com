import { Router } from 'express';
import {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
} from '../controllers/orderController';
import { authenticate } from '../middleware/authMiddleware';
import { validateBody } from '../middleware/validator';
import { createOrderSchema } from '../validators/orderValidator';

const router = Router();

router.use(authenticate);

router.post('/', validateBody(createOrderSchema), createOrder);
router.get('/', getMyOrders);
router.get('/:id', getOrderById);
router.patch('/:id/cancel', cancelOrder);

export default router;
