import { createOrderSchema } from '../validators/orderValidator';

describe('Order Validator Schemas', () => {
  it('should validate order checkout payload correctly', () => {
    const validOrder = {
      address: {
        fullName: 'Rajesh Sharma',
        phone: '9123456789',
        addressLine1: 'Plot 42 Industrial Area',
        city: 'Mumbai',
        state: 'Maharashtra',
        postalCode: '400093',
      },
      paymentMethod: 'COD',
      notes: 'Please deliver during business hours 9am to 6pm.',
    };

    const result = createOrderSchema.safeParse(validOrder);
    expect(result.success).toBe(true);
  });

  it('should reject order payload missing required address fields', () => {
    const invalidOrder = {
      address: {
        fullName: 'Rajesh Sharma',
        phone: '123', // invalid phone length
      },
    };

    const result = createOrderSchema.safeParse(invalidOrder);
    expect(result.success).toBe(false);
  });
});
