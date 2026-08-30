export interface IUser {
  id: string;
  _id?: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  phone?: string;
  company?: string;
  gstin?: string;
  isActive?: boolean;
  createdAt?: string;
}

export interface ICategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  isActive?: boolean;
}

export interface ISpecification {
  key: string;
  value: string;
}

export interface IProduct {
  _id: string;
  name: string;
  slug: string;
  sku: string;
  description: string;
  shortDescription?: string;
  price: number;
  compareAtPrice?: number;
  category: ICategory | string;
  brand: string;
  images: string[];
  stock: number;
  lowStockThreshold: number;
  unit: string;
  minOrderQuantity?: number;
  specifications: ISpecification[];
  tags: string[];
  rating: number;
  reviewCount: number;
  isFeatured: boolean;
  isActive: boolean;
  createdAt?: string;
}

export interface ICartItem {
  _id: string;
  product: IProduct;
  quantity: number;
  priceAtAddition: number;
  subtotal: number;
  isStockAvailable?: boolean;
  availableStock?: number;
}

export interface ICart {
  id: string;
  items: ICartItem[];
  subtotal: number;
  totalItems: number;
}

export interface IAddress {
  _id: string;
  fullName: string;
  phone: string;
  company?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export interface IOrderItem {
  _id?: string;
  product: IProduct | string;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  subtotal: number;
  image?: string;
  unit?: string;
}

export interface IStatusHistory {
  status: 'Pending' | 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  note?: string;
  timestamp: string;
}

export interface IOrder {
  _id: string;
  orderNumber: string;
  user: IUser | string;
  items: IOrderItem[];
  address: IAddress;
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  totalAmount: number;
  paymentMethod: 'COD' | 'DEMO_CARD' | 'NET_BANKING' | 'UPI';
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED';
  status: 'Pending' | 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  statusHistory: IStatusHistory[];
  notes?: string;
  createdAt: string;
}

export interface IReview {
  _id: string;
  user: IUser;
  product: IProduct | string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface IInventoryItem {
  _id: string;
  name: string;
  sku: string;
  brand: string;
  category: ICategory | string;
  stock: number;
  lowStockThreshold: number;
  unit: string;
  price: number;
  status: 'IN STOCK' | 'LOW STOCK' | 'OUT OF STOCK';
  updatedAt?: string;
}

export interface IInventoryMovement {
  _id: string;
  product: IProduct;
  type: 'RESTOCK' | 'SALE' | 'ADJUSTMENT' | 'RETURN';
  quantity: number;
  previousStock: number;
  newStock: number;
  reason?: string;
  admin?: IUser;
  createdAt: string;
}

export interface INotification {
  _id: string;
  title: string;
  message: string;
  type: 'ORDER_STATUS' | 'LOW_STOCK' | 'SYSTEM' | 'REVIEW';
  isRead: boolean;
  link?: string;
  createdAt: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
