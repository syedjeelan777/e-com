import { Router } from 'express';
import {
  getAdminOrders,
  getAdminOrderById,
  updateOrderStatus,
  getAdminCustomers,
  getCustomerById,
  getAdminReviews,
  deleteReview,
} from '../controllers/adminController';
import {
  getInventory,
  updateProductStock,
  getInventoryMovements,
} from '../controllers/inventoryController';
import {
  getOverviewStats,
  getRevenueAnalytics,
  getOrderAnalytics,
  getTopProducts,
  getCategoryAnalytics,
} from '../controllers/analyticsController';
import { authenticate, requireRole } from '../middleware/authMiddleware';
import { validateBody } from '../middleware/validator';
import { updateOrderStatusSchema } from '../validators/orderValidator';

const router = Router();

router.use(authenticate, requireRole('ADMIN'));

router.get('/orders', getAdminOrders);
router.get('/orders/:id', getAdminOrderById);
router.patch('/orders/:id/status', validateBody(updateOrderStatusSchema), updateOrderStatus);

router.get('/inventory', getInventory);
router.patch('/inventory/:productId', updateProductStock);
router.get('/inventory/movements', getInventoryMovements);

router.get('/customers', getAdminCustomers);
router.get('/customers/:id', getCustomerById);

router.get('/reviews', getAdminReviews);
router.delete('/reviews/:id', deleteReview);

router.get('/analytics/overview', getOverviewStats);
router.get('/analytics/revenue', getRevenueAnalytics);
router.get('/analytics/orders', getOrderAnalytics);
router.get('/analytics/products', getTopProducts);
router.get('/analytics/categories', getCategoryAnalytics);

export default router;
