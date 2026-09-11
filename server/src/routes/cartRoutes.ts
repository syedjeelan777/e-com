import { Router } from 'express';
import { getCart, addToCart, updateCartItem, removeFromCart, clearCart } from '../controllers/cartController';
import { authenticate } from '../middleware/authMiddleware';
import { validateBody } from '../middleware/validator';
import { addCartSchema, updateCartSchema } from '../validators/cartValidator';
const router = Router(); router.use(authenticate);
router.get('/', getCart); router.post('/', validateBody(addCartSchema), addToCart); router.put('/:itemId', validateBody(updateCartSchema), updateCartItem); router.delete('/:itemId', removeFromCart); router.delete('/', clearCart);
export default router;
