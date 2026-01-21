// Category interface for menu organization
export interface Category {
  id: number;
  name: string;
  description: string;
  imageUrl?: string;
}

// MenuItem interface representing individual dishes
export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  categoryId: number;
  imageUrl: string;
  ingredients: string[];
  isVegetarian: boolean;
  isSpicy: boolean;
  preparationTime: number; // in minutes
  calories?: number;
  isAvailable: boolean;
}

// CartItem interface for items in shopping cart
export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  specialInstructions?: string;
}

// Customer interface with access modifiers
export class Customer {
  constructor(
    public id: number,
    public name: string,
    public email: string,
    public phone: string,
    private readonly loyaltyPoints: number = 0
  ) {}

  // Method to get loyalty points (demonstrates encapsulation)
  getLoyaltyPoints(): number {
    return this.loyaltyPoints;
  }
}

// Order status enum
export enum OrderStatus {
  Pending = 'PENDING',
  Confirmed = 'CONFIRMED',
  Preparing = 'PREPARING',
  Ready = 'READY',
  Delivered = 'DELIVERED',
  Cancelled = 'CANCELLED'
}

// Payment method enum
export enum PaymentMethod {
  Cash = 'CASH',
  Card = 'CARD',
  OnlinePayment = 'ONLINE'
}

// Order interface
export interface Order {
  id: number;
  customer: Customer;
  items: CartItem[];
  totalAmount: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  deliveryAddress?: string;
  orderDate: Date;
  specialRequests?: string;
}

// Order request DTO (Data Transfer Object)
export interface OrderRequest {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: CartItem[];
  paymentMethod: PaymentMethod;
  deliveryAddress?: string;
  specialRequests?: string;
}
