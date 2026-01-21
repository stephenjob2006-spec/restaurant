import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CartItem, MenuItem } from '../models/menu.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  // Private state
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  private readonly CART_STORAGE_KEY = 'restaurant_cart';

  // Public observables
  public cartItems$ = this.cartItemsSubject.asObservable();

  constructor() {
    this.loadCartFromStorage();
  }

  /**
   * Load cart from local storage
   */
  private loadCartFromStorage(): void {
    const savedCart = localStorage.getItem(this.CART_STORAGE_KEY);
    if (savedCart) {
      try {
        const items = JSON.parse(savedCart);
        this.cartItemsSubject.next(items);
      } catch (error) {
        console.error('Error loading cart from storage:', error);
      }
    }
  }

  /**
   * Save cart to local storage
   */
  private saveCartToStorage(items: CartItem[]): void {
    localStorage.setItem(this.CART_STORAGE_KEY, JSON.stringify(items));
  }

  /**
   * Get current cart items
   */
  getCartItems(): Observable<CartItem[]> {
    return this.cartItems$;
  }

  /**
   * Add item to cart
   */
  addToCart(menuItem: MenuItem, quantity: number = 1, specialInstructions?: string): void {
    const currentItems = this.cartItemsSubject.value;
    const existingItemIndex = currentItems.findIndex(
      item => item.menuItem.id === menuItem.id && item.specialInstructions === specialInstructions
    );

    let updatedItems: CartItem[];

    if (existingItemIndex > -1) {
      // Update quantity of existing item
      updatedItems = currentItems.map((item, index) =>
        index === existingItemIndex
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      // Add new item
      const newItem: CartItem = {
        menuItem,
        quantity,
        specialInstructions
      };
      updatedItems = [...currentItems, newItem];
    }

    this.cartItemsSubject.next(updatedItems);
    this.saveCartToStorage(updatedItems);
  }

  /**
   * Update item quantity
   */
  updateQuantity(cartItem: CartItem, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(cartItem);
      return;
    }

    const currentItems = this.cartItemsSubject.value;
    const updatedItems = currentItems.map(item =>
      item === cartItem ? { ...item, quantity } : item
    );

    this.cartItemsSubject.next(updatedItems);
    this.saveCartToStorage(updatedItems);
  }

  /**
   * Remove item from cart
   */
  removeFromCart(cartItem: CartItem): void {
    const currentItems = this.cartItemsSubject.value;
    const updatedItems = currentItems.filter(item => item !== cartItem);
    
    this.cartItemsSubject.next(updatedItems);
    this.saveCartToStorage(updatedItems);
  }

  /**
   * Clear entire cart
   */
  clearCart(): void {
    this.cartItemsSubject.next([]);
    localStorage.removeItem(this.CART_STORAGE_KEY);
  }

  /**
   * Get cart total amount
   */
  getCartTotal(): Observable<number> {
    return new Observable(observer => {
      this.cartItems$.subscribe(items => {
        const total = items.reduce(
          (sum, item) => sum + (item.menuItem.price * item.quantity),
          0
        );
        observer.next(total);
      });
    });
  }

  /**
   * Get total items count
   */
  getCartItemsCount(): Observable<number> {
    return new Observable(observer => {
      this.cartItems$.subscribe(items => {
        const count = items.reduce((sum, item) => sum + item.quantity, 0);
        observer.next(count);
      });
    });
  }

  /**
   * Check if item is in cart
   */
  isInCart(menuItemId: number): Observable<boolean> {
    return new Observable(observer => {
      this.cartItems$.subscribe(items => {
        const exists = items.some(item => item.menuItem.id === menuItemId);
        observer.next(exists);
      });
    });
  }
}
