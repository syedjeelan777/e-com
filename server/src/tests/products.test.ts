import { productSchema } from '../validators/productValidator';
import { generateOrderNumber } from '../utils/orderNumber';

describe('Product Validators and Order Number Utility', () => {
  it('should generate valid human-readable order numbers', () => {
    const orderNum1 = generateOrderNumber();
    const orderNum2 = generateOrderNumber();

    expect(orderNum1).toMatch(/^SZK-202\d-\d{6}$/);
    expect(orderNum2).toMatch(/^SZK-202\d-\d{6}$/);
    expect(orderNum1).not.toBe(orderNum2);
  });

  it('should validate product creation schema', () => {
    const validProduct = {
      name: 'Industrial PVC Conduit Pipe 25mm',
      description: 'Heavy duty flame retardant conduit pipe for cable protection.',
      price: 1850,
      category: '507f1f77bcf86cd799439011',
      brand: 'PipeCore',
      images: ['https://example.com/pvc.jpg'],
      stock: 100,
      unit: 'Length (6m)',
    };

    const result = productSchema.safeParse(validProduct);
    expect(result.success).toBe(true);

    const negativePrice = productSchema.safeParse({
      ...validProduct,
      price: -500,
    });
    expect(negativePrice.success).toBe(false);
  });
});
