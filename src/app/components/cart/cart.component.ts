import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../models/menu.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatSnackBarModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cartItems$!: Observable<CartItem[]>;
  cartTotal$!: Observable<number>;
  cartItemsCount$!: Observable<number>;

  constructor(
    private cartService: CartService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.cartItems$ = this.cartService.getCartItems();
    this.cartTotal$ = this.cartService.getCartTotal();
    this.cartItemsCount$ = this.cartService.getCartItemsCount();
  }

  /**
   * Update item quantity using event binding
   */
  updateQuantity(item: CartItem, newQuantity: number): void {
    if (newQuantity < 1) {
      this.removeItem(item);
      return;
    }

    if (newQuantity > 99) {
      this.snackBar.open('Maximum quantity is 99', 'OK', {
        duration: 2000
      });
      return;
    }

    this.cartService.updateQuantity(item, newQuantity);
  }

  /**
   * Increase quantity
   */
  increaseQuantity(item: CartItem): void {
    this.updateQuantity(item, item.quantity + 1);
  }

  /**
   * Decrease quantity
   */
  decreaseQuantity(item: CartItem): void {
    this.updateQuantity(item, item.quantity - 1);
  }

  /**
   * Remove item from cart
   */
  removeItem(item: CartItem): void {
    this.cartService.removeFromCart(item);
    this.snackBar.open(`${item.menuItem.name} removed from cart`, 'Undo', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'bottom'
    }).onAction().subscribe(() => {
      // Undo removal
      this.cartService.addToCart(
        item.menuItem,
        item.quantity,
        item.specialInstructions
      );
    });
  }

  /**
   * Clear entire cart
   */
  clearCart(): void {
    const confirmDialog = confirm('Are you sure you want to clear your cart?');
    if (confirmDialog) {
      this.cartService.clearCart();
      this.snackBar.open('Cart cleared', 'OK', {
        duration: 2000
      });
    }
  }

  /**
   * Navigate to checkout
   */
  proceedToCheckout(): void {
    this.router.navigate(['/checkout']);
  }

  /**
   * Continue shopping
   */
  continueShopping(): void {
    this.router.navigate(['/menu']);
  }

  /**
   * Calculate subtotal for an item
   */
  getItemSubtotal(item: CartItem): number {
    return item.menuItem.price * item.quantity;
  }

  /**
   * Calculate tax (8%)
   */
  calculateTax(total: number): number {
    return total * 0.08;
  }

  /**
   * Calculate delivery fee
   */
  getDeliveryFee(total: number): number {
    return total >= 50 ? 0 : 5.99;
  }

  /**
   * Calculate grand total
   */
  getGrandTotal(cartTotal: number): number {
    const tax = this.calculateTax(cartTotal);
    const deliveryFee = this.getDeliveryFee(cartTotal);
    return cartTotal + tax + deliveryFee;
  }
}
