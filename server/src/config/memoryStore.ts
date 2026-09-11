import mongoose from 'mongoose';
import { hashPassword } from '../utils/password';
import { NODE_ENV } from './env';

export const isMongoConnected = (): boolean => {
  return mongoose.connection.readyState === 1;
};

// In-Memory Data Store Fallback
export const inMemoryStore = {
  users: [] as any[],
  categories: [] as any[],
  products: [] as any[],
  addresses: [] as any[],
  carts: [] as any[],
  orders: [] as any[],
  reviews: [] as any[],
  wishlists: [] as any[],
  movements: [] as any[],
  notifications: [] as any[],
};

let isSeeded = false;

export const seedInMemoryStore = async () => {
  if (isSeeded) return;

  if (NODE_ENV === 'production') throw new Error('In-memory data store is disabled in production');
  const adminEmail = process.env.SEED_ADMIN_EMAIL;
  const adminPlaintext = process.env.SEED_ADMIN_PASSWORD;
  const customerEmail = process.env.SEED_CUSTOMER_EMAIL;
  const customerPlaintext = process.env.SEED_CUSTOMER_PASSWORD;
  if (!adminEmail || !adminPlaintext || !customerEmail || !customerPlaintext) {
    isSeeded = true;
    return;
  }
  const adminPassword = await hashPassword(adminPlaintext);
  const customerPassword = await hashPassword(customerPlaintext);

  const adminId = '650000000000000000000001';
  const customerId = '650000000000000000000002';
  const cat1Id = '650000000000000000000010';
  const cat2Id = '650000000000000000000011';
  const prod1Id = '650000000000000000000100';
  const prod2Id = '650000000000000000000101';
  const prod3Id = '650000000000000000000102';

  // Users
  inMemoryStore.users = [
    {
      _id: adminId,
      name: 'Shaziya Admin',
      email: adminEmail,
      password: adminPassword,
      role: 'ADMIN',
      phone: '+91 9876543210',
      company: 'Shaziya Industrial Solutions Pvt Ltd',
      gstin: '27AAAAA0000A1Z5',
      isActive: true,
      createdAt: new Date(),
    },
    {
      _id: customerId,
      name: 'Rajesh Sharma',
      email: customerEmail,
      password: customerPassword,
      role: 'USER',
      phone: '+91 9123456789',
      company: 'Apex Electricals & Hardware',
      gstin: '27BBBBB1111B1Z2',
      isActive: true,
      createdAt: new Date(),
    },
  ];

  // Categories
  inMemoryStore.categories = [
    {
      _id: cat1Id,
      name: 'Electrical Components',
      slug: 'electrical-components',
      description: 'Industrial switches, copper cables, MCBs, junction boxes & connectors.',
      image: 'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&w=800&q=80',
      isActive: true,
    },
    {
      _id: cat2Id,
      name: 'Plumbing & PVC',
      slug: 'plumbing-pvc',
      description: 'Heavy duty PVC pipes, brass ball valves, GI fittings & elbows.',
      image: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=800&q=80',
      isActive: true,
    },
  ];

  // Products
  inMemoryStore.products = [
    {
      _id: prod1Id,
      name: 'ElectraMax 3-Phase 32A MCB Breaker (Pack of 10)',
      slug: 'electramax-3-phase-32a-mcb-breaker',
      sku: 'ELE-MCB-032',
      description: 'Heavy duty thermal magnetic miniature circuit breaker designed for industrial electrical panels and distribution boards. Features C-Curve trip characteristics with 10kA breaking capacity.',
      shortDescription: 'Industrial C-Curve 32A 3-Phase MCB Breaker with high breaking capacity.',
      price: 3450,
      compareAtPrice: 4200,
      category: { _id: cat1Id, name: 'Electrical Components', slug: 'electrical-components' },
      brand: 'ElectraMax',
      images: ['https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&w=800&q=80'],
      stock: 85,
      lowStockThreshold: 15,
      unit: 'Pack of 10',
      minOrderQuantity: 1,
      specifications: [
        { key: 'Voltage Rating', value: '415V AC' },
        { key: 'Current Rating', value: '32A' },
        { key: 'Breaking Capacity', value: '10 kA' },
      ],
      tags: ['MCB', 'Electrical', 'Breaker'],
      rating: 4.8,
      reviewCount: 12,
      isFeatured: true,
      isActive: true,
    },
    {
      _id: prod2Id,
      name: 'PowerLine Multi-Strand Flexible Copper Wire 2.5 sq mm (90m Roll)',
      slug: 'powerline-copper-wire-2-5-sqmm',
      sku: 'ELE-WIR-25M',
      description: 'Flame retardant (FR) PVC insulated multi-strand flexible copper wire for heavy commercial and industrial wiring installations. 100% electrolytic grade pure copper conductor.',
      shortDescription: '90-meter roll 2.5 sq mm FR PVC insulated copper wire.',
      price: 2150,
      compareAtPrice: 2600,
      category: { _id: cat1Id, name: 'Electrical Components', slug: 'electrical-components' },
      brand: 'PowerLine',
      images: ['https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=800&q=80'],
      stock: 120,
      lowStockThreshold: 20,
      unit: 'Roll',
      minOrderQuantity: 2,
      specifications: [
        { key: 'Conductor Material', value: 'Pure Copper' },
        { key: 'Cross Section', value: '2.5 sq mm' },
      ],
      tags: ['Cable', 'Copper Wire'],
      rating: 4.7,
      reviewCount: 18,
      isFeatured: true,
      isActive: true,
    },
    {
      _id: prod3Id,
      name: 'PipeCore Heavy Duty Schedule 80 PVC Pipes 2-Inch (6-Meter Length)',
      slug: 'pipecore-schedule-80-pvc-pipe-2inch',
      sku: 'PVC-PIP-200',
      description: 'Industrial grade thick-wall PVC pressure pipe ideal for chemical transfer, water supply, and industrial plumbing systems.',
      shortDescription: 'Heavy-duty 2-inch Schedule 80 PVC industrial pressure pipe.',
      price: 1850,
      compareAtPrice: 2200,
      category: { _id: cat2Id, name: 'Plumbing & PVC', slug: 'plumbing-pvc' },
      brand: 'PipeCore',
      images: ['https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=800&q=80'],
      stock: 8,
      lowStockThreshold: 15,
      unit: 'Length (6m)',
      minOrderQuantity: 5,
      specifications: [
        { key: 'Diameter', value: '2 Inches (50mm)' },
        { key: 'Schedule', value: 'Schedule 80' },
      ],
      tags: ['PVC Pipe', 'Plumbing'],
      rating: 4.6,
      reviewCount: 9,
      isFeatured: true,
      isActive: true,
    },
  ];

  // Addresses
  inMemoryStore.addresses = [
    {
      _id: '650000000000000000000200',
      user: customerId,
      fullName: 'Rajesh Sharma',
      phone: '+91 9123456789',
      company: 'Apex Electricals & Hardware',
      addressLine1: 'Plot No. 42, MIDC Industrial Area, Phase II',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400093',
      country: 'India',
      isDefault: true,
    },
  ];

  // Cart
  inMemoryStore.carts = [
    {
      _id: '650000000000000000000300',
      user: customerId,
      items: [],
    },
  ];

  // Orders
  inMemoryStore.orders = [
    {
      _id: '650000000000000000000400',
      orderNumber: 'SZK-2026-100245',
      user: {
        _id: customerId,
        name: 'Rajesh Sharma',
        email: customerEmail,
        company: 'Apex Electricals & Hardware',
      },
      items: [
        {
          product: prod1Id,
          name: 'ElectraMax 3-Phase 32A MCB Breaker (Pack of 10)',
          sku: 'ELE-MCB-032',
          price: 3450,
          quantity: 2,
          subtotal: 6900,
          image: 'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&w=800&q=80',
          unit: 'Pack of 10',
        },
      ],
      address: inMemoryStore.addresses[0],
      subtotal: 6900,
      tax: 1242,
      shipping: 0,
      discount: 0,
      totalAmount: 8142,
      paymentMethod: 'COD',
      paymentStatus: 'PENDING',
      status: 'Delivered',
      statusHistory: [{ status: 'Delivered', timestamp: new Date() }],
      createdAt: new Date(),
    },
  ];

  // Wishlist
  inMemoryStore.wishlists = [
    {
      _id: '650000000000000000000500',
      user: customerId,
      products: [inMemoryStore.products[1]],
    },
  ];

  // Notifications
  inMemoryStore.notifications = [
    {
      _id: '650000000000000000000600',
      user: customerId,
      title: 'Order Delivered',
      message: 'Your order #SZK-2026-100245 has been delivered successfully.',
      type: 'ORDER_STATUS',
      isRead: false,
      createdAt: new Date(),
    },
  ];

  isSeeded = true;
  console.log('✅ In-Memory Store Seeded Successfully.');
};
