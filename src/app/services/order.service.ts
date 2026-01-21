import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, delay, of } from 'rxjs';
import { Order, OrderRequest, OrderStatus, Customer } from '../models/menu.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private ordersSubject = new BehaviorSubject<Order[]>([]);
  public orders$ = this.ordersSubject.asObservable();
  
  private orderIdCounter = 1;
  private customerIdCounter = 1;

  constructor() {
    this.loadOrdersFromStorage();
  }

  /**
   * Load orders from local storage
   */
  private loadOrdersFromStorage(): void {
    const savedOrders = localStorage.getItem('restaurant_orders');
    if (savedOrders) {
      try {
        const orders = JSON.parse(savedOrders);
        this.ordersSubject.next(orders);
        
        // Update counter
        if (orders.length > 0) {
          this.orderIdCounter = Math.max(...orders.map((o: Order) => o.id)) + 1;
        }
      } catch (error) {
        console.error('Error loading orders:', error);
      }
    }
  }

  /**
   * Save orders to local storage
   */
  private saveOrdersToStorage(orders: Order[]): void {
    localStorage.setItem('restaurant_orders', JSON.stringify(orders));
  }

  /**
   * Place a new order
   */
  placeOrder(orderRequest: OrderRequest): Observable<Order> {
    // Create customer object
    const customer = new Customer(
      this.customerIdCounter++,
      orderRequest.customerName,
      orderRequest.customerEmail,
      orderRequest.customerPhone
    );

    // Calculate total
    const totalAmount = orderRequest.items.reduce(
      (sum, item) => sum + (item.menuItem.price * item.quantity),
      0
    );

    // Create order
    const newOrder: Order = {
      id: this.orderIdCounter++,
      customer,
      items: orderRequest.items,
      totalAmount,
      status: OrderStatus.Pending,
      paymentMethod: orderRequest.paymentMethod,
      deliveryAddress: orderRequest.deliveryAddress,
      orderDate: new Date(),
      specialRequests: orderRequest.specialRequests
    };

    // Add to orders
    const currentOrders = this.ordersSubject.value;
    const updatedOrders = [...currentOrders, newOrder];
    this.ordersSubject.next(updatedOrders);
    this.saveOrdersToStorage(updatedOrders);

    // Simulate API delay
    return of(newOrder).pipe(delay(1000));
  }

  /**
   * Get all orders
   */
  getOrders(): Observable<Order[]> {
    return this.orders$;
  }

  /**
   * Get order by ID
   */
  getOrderById(orderId: number): Observable<Order | undefined> {
    return new Observable(observer => {
      this.orders$.subscribe(orders => {
        const order = orders.find(o => o.id === orderId);
        observer.next(order);
      });
    });
  }

  /**
   * Update order status
   */
  updateOrderStatus(orderId: number, status: OrderStatus): Observable<boolean> {
    const currentOrders = this.ordersSubject.value;
    const orderIndex = currentOrders.findIndex(o => o.id === orderId);

    if (orderIndex === -1) {
      return of(false);
    }

    const updatedOrders = currentOrders.map(order =>
      order.id === orderId ? { ...order, status } : order
    );

    this.ordersSubject.next(updatedOrders);
    this.saveOrdersToStorage(updatedOrders);

    return of(true).pipe(delay(500));
  }

  /**
   * Cancel order
   */
  cancelOrder(orderId: number): Observable<boolean> {
    return this.updateOrderStatus(orderId, OrderStatus.Cancelled);
  }
}
