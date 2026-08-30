import mongoose from 'mongoose';
import { connectDB, closeDB } from '../config/db';
import { isMongoConnected, inMemoryStore } from '../config/memoryStore';
import { User } from '../models/User';
import { Category } from '../models/Category';
import { Product } from '../models/Product';
import { Address } from '../models/Address';
import { Order } from '../models/Order';
import { Review } from '../models/Review';
import { Cart } from '../models/Cart';
import { Wishlist } from '../models/Wishlist';
import { InventoryMovement } from '../models/InventoryMovement';
import { Notification } from '../models/Notification';
import { hashPassword } from '../utils/password';

const seedDatabase = async () => {
  console.log('🌱 Starting Database Seeding for SHAZIYAKART...');
  await connectDB();

  if (!isMongoConnected()) {
    console.log('\n✅ In-Memory Data Store Seeded Successfully for Development!');
    console.log('==================================================');
    console.log('DEMO ACCOUNTS READY:');
    console.log('Admin Email:    admin@shaziyakart.local');
    console.log('Admin Password: Admin@12345');
    console.log('--------------------------------------------------');
    console.log('Customer Email: customer@shaziyakart.local');
    console.log('Customer Pass:  Customer@12345');
    console.log('==================================================\n');
    process.exit(0);
  }

  try {
    // Clear existing collections
    await Promise.all([
      User.deleteMany({}),
      Category.deleteMany({}),
      Product.deleteMany({}),
      Address.deleteMany({}),
      Order.deleteMany({}),
      Review.deleteMany({}),
      Cart.deleteMany({}),
      Wishlist.deleteMany({}),
      InventoryMovement.deleteMany({}),
      Notification.deleteMany({}),
    ]);

    console.log('🧹 Cleared existing development data.');

    // 1. Create Users
    const adminPassword = await hashPassword('Admin@12345');
    const customerPassword = await hashPassword('Customer@12345');

    const admin = await User.create({
      name: 'Shaziya Admin',
      email: 'admin@shaziyakart.local',
      password: adminPassword,
      role: 'ADMIN',
      phone: '+91 9876543210',
      company: 'Shaziya Industrial Solutions Pvt Ltd',
      gstin: '27AAAAA0000A1Z5',
    });

    const customer = await User.create({
      name: 'Rajesh Sharma',
      email: 'customer@shaziyakart.local',
      password: customerPassword,
      role: 'USER',
      phone: '+91 9123456789',
      company: 'Apex Electricals & Hardware',
      gstin: '27BBBBB1111B1Z2',
    });

    const customer2 = await User.create({
      name: 'Vikram Mehta',
      email: 'vikram.mehta@buildtech.com',
      password: customerPassword,
      role: 'USER',
      phone: '+91 9822011223',
      company: 'BuildTech Contractors',
      gstin: '27CCCCC2222C1Z8',
    });

    console.log('👤 Created Users (Admin & Customers).');

    // 2. Create Categories
    const categoriesData = [
      {
        name: 'Electrical Components',
        slug: 'electrical-components',
        description: 'Industrial switches, copper cables, MCBs, junction boxes & connectors.',
        image: 'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Plumbing & PVC',
        slug: 'plumbing-pvc',
        description: 'Heavy duty PVC pipes, brass ball valves, GI fittings & elbows.',
        image: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Hardware & Fasteners',
        slug: 'hardware-fasteners',
        description: 'Stainless steel bolts, anchor fasteners, rivets, threaded rods & washers.',
        image: 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Industrial Supplies',
        slug: 'industrial-supplies',
        description: 'Coating powders, bearings, industrial lubricants & adhesives.',
        image: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Safety Equipment',
        slug: 'safety-equipment',
        description: 'PPE helmets, high-grip gloves, safety boots & reflective jackets.',
        image: 'https://images.unsplash.com/photo-1508873696983-2df515122519?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Tools & Power Tools',
        slug: 'tools-power-tools',
        description: 'Heavy rotary drills, angle grinders, drill bit sets & torque wrenches.',
        image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80',
      },
    ];

    const categories = await Category.insertMany(categoriesData);
    const catMap: Record<string, mongoose.Types.ObjectId> = {};
    categories.forEach((c) => {
      catMap[c.slug] = c._id as any;
    });

    console.log('🏷️ Created Categories.');

    // 3. Create Products
    const productsData = [
      {
        name: 'ElectraMax 3-Phase 32A MCB Breaker (Pack of 10)',
        slug: 'electramax-3-phase-32a-mcb-breaker',
        sku: 'ELE-MCB-032',
        description: 'Heavy duty thermal magnetic miniature circuit breaker designed for industrial electrical panels and distribution boards. Features C-Curve trip characteristics with 10kA breaking capacity.',
        shortDescription: 'Industrial C-Curve 32A 3-Phase MCB Breaker with high breaking capacity.',
        price: 3450,
        compareAtPrice: 4200,
        category: catMap['electrical-components'],
        brand: 'ElectraMax',
        images: [
          'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&w=800&q=80',
        ],
        stock: 85,
        lowStockThreshold: 15,
        unit: 'Pack of 10',
        minOrderQuantity: 1,
        specifications: [
          { key: 'Voltage Rating', value: '415V AC' },
          { key: 'Current Rating', value: '32A' },
          { key: 'Number of Poles', value: '3 Pole' },
          { key: 'Breaking Capacity', value: '10 kA' },
          { key: 'Standard', value: 'IEC 60898-1' },
        ],
        tags: ['MCB', 'Electrical', 'Breaker', '3-Phase', 'Panel'],
        rating: 4.8,
        reviewCount: 12,
        isFeatured: true,
      },
      {
        name: 'PowerLine Multi-Strand Flexible Copper Wire 2.5 sq mm (90m Roll)',
        slug: 'powerline-copper-wire-2-5-sqmm',
        sku: 'ELE-WIR-25M',
        description: 'Flame retardant (FR) PVC insulated multi-strand flexible copper wire for heavy commercial and industrial wiring installations. 100% electrolytic grade pure copper conductor.',
        shortDescription: '90-meter roll 2.5 sq mm FR PVC insulated copper wire.',
        price: 2150,
        compareAtPrice: 2600,
        category: catMap['electrical-components'],
        brand: 'PowerLine',
        images: [
          'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=800&q=80',
        ],
        stock: 120,
        lowStockThreshold: 20,
        unit: 'Roll',
        minOrderQuantity: 2,
        specifications: [
          { key: 'Conductor Material', value: 'Pure Copper' },
          { key: 'Cross Section', value: '2.5 sq mm' },
          { key: 'Insulation', value: 'Flame Retardant PVC' },
          { key: 'Length', value: '90 Meters' },
          { key: 'Voltage Grade', value: 'up to 1100V' },
        ],
        tags: ['Cable', 'Copper Wire', 'Wiring', 'Flame Retardant'],
        rating: 4.7,
        reviewCount: 18,
        isFeatured: true,
      },
      {
        name: 'PipeCore Heavy Duty Schedule 80 PVC Pipes 2-Inch (6-Meter Length)',
        slug: 'pipecore-schedule-80-pvc-pipe-2inch',
        sku: 'PVC-PIP-200',
        description: 'Industrial grade thick-wall PVC pressure pipe ideal for chemical transfer, water supply, and industrial plumbing systems. High pressure rating with UV resistance.',
        shortDescription: 'Heavy-duty 2-inch Schedule 80 PVC industrial pressure pipe.',
        price: 1850,
        compareAtPrice: 2200,
        category: catMap['plumbing-pvc'],
        brand: 'PipeCore',
        images: [
          'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=800&q=80',
        ],
        stock: 8,
        lowStockThreshold: 15,
        unit: 'Length (6m)',
        minOrderQuantity: 5,
        specifications: [
          { key: 'Diameter', value: '2 Inches (50mm)' },
          { key: 'Schedule', value: 'Schedule 80' },
          { key: 'Pressure Rating', value: '280 PSI' },
          { key: 'Length', value: '6 Meters' },
          { key: 'Material', value: 'Unplasticized PVC (uPVC)' },
        ],
        tags: ['PVC Pipe', 'Plumbing', 'Schedule 80', 'uPVC'],
        rating: 4.6,
        reviewCount: 9,
        isFeatured: true,
      },
      {
        name: 'InduTech Industrial Brass Ball Valve 1.5-Inch Full Port',
        slug: 'indutech-brass-ball-valve-1-5-inch',
        sku: 'PLM-VAL-150',
        description: 'Forged brass ball valve featuring full port flow design, PTFE seats, and stainless steel lever handle. Rated for hot water, oil, and non-corrosive industrial fluids.',
        shortDescription: '1.5-inch full port forged brass ball valve with female NPT threads.',
        price: 1250,
        compareAtPrice: 1500,
        category: catMap['plumbing-pvc'],
        brand: 'InduTech',
        images: [
          'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=800&q=80',
        ],
        stock: 45,
        lowStockThreshold: 10,
        unit: 'Piece',
        minOrderQuantity: 1,
        specifications: [
          { key: 'Body Material', value: 'Forged Brass' },
          { key: 'Port Type', value: 'Full Port' },
          { key: 'Thread Standard', value: 'NPT Female' },
          { key: 'Working Pressure', value: '600 WOG' },
          { key: 'Temperature Range', value: '-20°C to 120°C' },
        ],
        tags: ['Ball Valve', 'Brass Valve', 'Plumbing', 'Industrial Valve'],
        rating: 4.9,
        reviewCount: 22,
        isFeatured: false,
      },
      {
        name: 'BuildPro Stainless Steel 316 Hex Bolt M12 x 50mm (Box of 100)',
        slug: 'buildpro-ss316-hex-bolt-m12x50',
        sku: 'FAS-BLT-M12',
        description: 'Marine-grade SS316 corrosion-resistant full thread hexagon head bolts designed for chemical plants, construction, and marine environments.',
        shortDescription: 'Box of 100 marine grade SS316 M12 x 50mm hexagon bolts.',
        price: 4850,
        compareAtPrice: 5500,
        category: catMap['hardware-fasteners'],
        brand: 'BuildPro',
        images: [
          'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&w=800&q=80',
        ],
        stock: 30,
        lowStockThreshold: 10,
        unit: 'Box of 100',
        minOrderQuantity: 1,
        specifications: [
          { key: 'Material', value: 'Stainless Steel 316' },
          { key: 'Thread Size', value: 'M12' },
          { key: 'Length', value: '50 mm' },
          { key: 'Standard', value: 'DIN 933' },
          { key: 'Finish', value: 'Bright Finish' },
        ],
        tags: ['Fasteners', 'Bolts', 'SS316', 'Hex Bolt', 'Construction'],
        rating: 4.8,
        reviewCount: 15,
        isFeatured: true,
      },
      {
        name: 'Shaziya Industrial Epoxy Powder Coating White (25 kg Bag)',
        slug: 'shaziya-industrial-epoxy-powder-coating-white',
        sku: 'IND-COA-025',
        description: 'Thermosetting epoxy polyester powder coating offering exceptional chemical resistance, smooth glossy finish, and high durability for metal fixtures and industrial cabinets.',
        shortDescription: '25 kg bag high gloss white thermosetting powder coating powder.',
        price: 12500,
        compareAtPrice: 14000,
        category: catMap['industrial-supplies'],
        brand: 'Shaziya Industrial',
        images: [
          'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80',
        ],
        stock: 0,
        lowStockThreshold: 5,
        unit: '25 kg Bag',
        minOrderQuantity: 1,
        specifications: [
          { key: 'Type', value: 'Epoxy Polyester Hybrid' },
          { key: 'Color', value: 'Pure White (RAL 9010)' },
          { key: 'Finish', value: 'High Gloss (>85%)' },
          { key: 'Curing Schedule', value: '180°C for 15 min' },
          { key: 'Pack Size', value: '25 Kg Box/Bag' },
        ],
        tags: ['Coating', 'Epoxy Powder', 'Industrial', 'Chemical Resistance'],
        rating: 4.5,
        reviewCount: 6,
        isFeatured: false,
      },
      {
        name: 'SafePro Cut-Resistant Nitrile Grip Gloves Grade 5 (Pack of 12 Pairs)',
        slug: 'safepro-cut-resistant-nitrile-gloves',
        sku: 'SAF-GLV-C05',
        description: 'EN388 Level 5 cut-resistant seamless knit liner gloves coated with micro-foam nitrile palm for superior grip in oily and mechanical environments.',
        shortDescription: '12 pairs EN388 Level 5 cut resistant micro-foam nitrile palm coated gloves.',
        price: 1650,
        compareAtPrice: 1950,
        category: catMap['safety-equipment'],
        brand: 'SafePro',
        images: [
          'https://images.unsplash.com/photo-1508873696983-2df515122519?auto=format&fit=crop&w=800&q=80',
        ],
        stock: 200,
        lowStockThreshold: 30,
        unit: 'Pack of 12 Pairs',
        minOrderQuantity: 1,
        specifications: [
          { key: 'Cut Level', value: 'ANSI Level A5 / EN388 Level 5' },
          { key: 'Coating', value: 'Micro-Foam Nitrile' },
          { key: 'Liner', value: 'HPPE Fiber Knit' },
          { key: 'Size', value: 'Large / L' },
          { key: 'Washable', value: 'Yes' },
        ],
        tags: ['Safety Gloves', 'Cut Resistant', 'PPE', 'Nitrile Coating'],
        rating: 4.9,
        reviewCount: 31,
        isFeatured: true,
      },
      {
        name: 'PowerLine 20V Cordless Brushless Rotary Hammer Drill Kit',
        slug: 'powerline-20v-brushless-rotary-hammer-drill',
        sku: 'TOO-DRL-020',
        description: 'Heavy duty 20V brushless SDS-Plus rotary hammer drill featuring 2.6 Joules impact energy, 3-mode operation (drill, hammer drill, chisel), and dual 4.0Ah batteries.',
        shortDescription: 'Industrial 20V brushless SDS-Plus rotary hammer drill with 2 batteries.',
        price: 8950,
        compareAtPrice: 10500,
        category: catMap['tools-power-tools'],
        brand: 'PowerLine',
        images: [
          'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80',
        ],
        stock: 25,
        lowStockThreshold: 8,
        unit: 'Kit',
        minOrderQuantity: 1,
        specifications: [
          { key: 'Motor', value: 'Brushless DC Motor' },
          { key: 'Impact Energy', value: '2.6 Joules' },
          { key: 'Chuck Type', value: 'SDS-Plus' },
          { key: 'Battery Capacity', value: '2x 20V 4.0Ah Li-ion' },
          { key: 'Concrete Capacity', value: '26 mm' },
        ],
        tags: ['Drill', 'Power Tools', 'Rotary Hammer', 'SDS-Plus', 'Brushless'],
        rating: 4.9,
        reviewCount: 14,
        isFeatured: true,
      },
    ];

    const products = await Product.insertMany(productsData);

    console.log('📦 Created 8 Core Products.');

    // 4. Create Addresses
    const address = await Address.create({
      user: customer._id,
      fullName: 'Rajesh Sharma',
      phone: '+91 9123456789',
      company: 'Apex Electricals & Hardware',
      addressLine1: 'Plot No. 42, MIDC Industrial Area, Phase II',
      addressLine2: 'Near Central Warehousing',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400093',
      country: 'India',
      isDefault: true,
    });

    console.log('📍 Created Customer Address.');

    // 5. Create Cart
    await Cart.create({
      user: customer._id,
      items: [
        {
          product: products[0]._id,
          quantity: 2,
          priceAtAddition: products[0].price,
        },
      ],
    });

    // 6. Create Wishlist
    await Wishlist.create({
      user: customer._id,
      products: [products[1]._id, products[4]._id],
    });

    // 7. Create Orders
    const order1 = await Order.create({
      orderNumber: 'SZK-2026-100245',
      user: customer._id,
      items: [
        {
          product: products[0]._id,
          name: products[0].name,
          sku: products[0].sku,
          price: products[0].price,
          quantity: 2,
          subtotal: products[0].price * 2,
          image: products[0].images[0],
          unit: products[0].unit,
        },
        {
          product: products[1]._id,
          name: products[1].name,
          sku: products[1].sku,
          price: products[1].price,
          quantity: 3,
          subtotal: products[1].price * 3,
          image: products[1].images[0],
          unit: products[1].unit,
        },
      ],
      address: {
        fullName: address.fullName,
        phone: address.phone,
        company: address.company,
        addressLine1: address.addressLine1,
        addressLine2: address.addressLine2,
        city: address.city,
        state: address.state,
        postalCode: address.postalCode,
        country: address.country,
      },
      subtotal: products[0].price * 2 + products[1].price * 3,
      tax: Math.round((products[0].price * 2 + products[1].price * 3) * 0.18),
      shipping: 0,
      discount: 0,
      totalAmount: Math.round((products[0].price * 2 + products[1].price * 3) * 1.18),
      paymentMethod: 'COD',
      paymentStatus: 'PAID',
      status: 'Delivered',
      statusHistory: [
        { status: 'Pending', timestamp: new Date(Date.now() - 7 * 86400000) },
        { status: 'Confirmed', timestamp: new Date(Date.now() - 6 * 86400000) },
        { status: 'Processing', timestamp: new Date(Date.now() - 5 * 86400000) },
        { status: 'Shipped', timestamp: new Date(Date.now() - 3 * 86400000) },
        { status: 'Delivered', timestamp: new Date(Date.now() - 1 * 86400000) },
      ],
    });

    const order2 = await Order.create({
      orderNumber: 'SZK-2026-100289',
      user: customer._id,
      items: [
        {
          product: products[4]._id,
          name: products[4].name,
          sku: products[4].sku,
          price: products[4].price,
          quantity: 1,
          subtotal: products[4].price,
          image: products[4].images[0],
          unit: products[4].unit,
        },
      ],
      address: {
        fullName: address.fullName,
        phone: address.phone,
        company: address.company,
        addressLine1: address.addressLine1,
        city: address.city,
        state: address.state,
        postalCode: address.postalCode,
        country: address.country,
      },
      subtotal: products[4].price,
      tax: Math.round(products[4].price * 0.18),
      shipping: 0,
      discount: 0,
      totalAmount: Math.round(products[4].price * 1.18),
      paymentMethod: 'DEMO_CARD',
      paymentStatus: 'PAID',
      status: 'Processing',
      statusHistory: [
        { status: 'Pending', timestamp: new Date(Date.now() - 2 * 86400000) },
        { status: 'Confirmed', timestamp: new Date(Date.now() - 1 * 86400000) },
        { status: 'Processing', timestamp: new Date() },
      ],
    });

    console.log('🧾 Created Sample Customer Orders.');

    // 8. Create Reviews
    await Review.create({
      user: customer._id,
      product: products[0]._id,
      rating: 5,
      comment: 'Excellent build quality and certified 10kA trip capacity. Used in 4 industrial panel boards with zero tripping issues under high motor start currents.',
    });

    await Review.create({
      user: customer2._id,
      product: products[1]._id,
      rating: 5,
      comment: 'Top quality pure copper conductor with smooth insulation stripping. Prompt dispatch from ShaziyaKart team.',
    });

    console.log('⭐ Created Product Reviews.');

    // 9. Create Notifications
    await Notification.create({
      user: customer._id,
      title: 'Order Delivered',
      message: `Your order #${order1.orderNumber} has been delivered successfully. Thank you for buying with ShaziyaKart!`,
      type: 'ORDER_STATUS',
      isRead: false,
      link: `/dashboard/orders/${order1._id}`,
    });

    console.log('🔔 Created Initial Notifications.');

    console.log('\n✅ Database Seeding Completed Successfully!');
    console.log('==================================================');
    console.log('DEMO ACCOUNTS READY:');
    console.log('Admin Email:    admin@shaziyakart.local');
    console.log('Admin Password: Admin@12345');
    console.log('--------------------------------------------------');
    console.log('Customer Email: customer@shaziyakart.local');
    console.log('Customer Pass:  Customer@12345');
    console.log('==================================================\n');

  } catch (error) {
    console.error('❌ Seeding Error:', error);
  } finally {
    await closeDB();
    process.exit(0);
  }
};

seedDatabase();
