import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { CartItem, OrderRequest, PaymentMethod } from '../../models/menu.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-order-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatRadioModule,
    MatIconModule,
    MatDividerModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './order-form.component.html',
  styleUrls: ['./order-form.component.scss']
})
export class OrderFormComponent implements OnInit {
  orderForm!: FormGroup;
  cartItems$!: Observable<CartItem[]>;
  cartTotal$!: Observable<number>;
  isSubmitting = false;

  // Payment methods enum for template
  PaymentMethod = PaymentMethod;

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.cartItems$ = this.cartService.getCartItems();
    this.cartTotal$ = this.cartService.getCartTotal();

    // Initialize reactive form with validators
    this.orderForm = this.fb.group({
      customerName: ['', [Validators.required, Validators.minLength(2)]],
      customerEmail: ['', [Validators.required, Validators.email]],
      customerPhone: ['', [Validators.required, Validators.pattern(/^[\d\s\-\+\(\)]+$/)]],
      deliveryAddress: ['', [Validators.required, Validators.minLength(10)]],
      paymentMethod: [PaymentMethod.Card, Validators.required],
      specialRequests: ['']
    });

    // Check if cart is empty
    this.cartItems$.subscribe(items => {
      if (items.length === 0) {
        this.snackBar.open('Your cart is empty!', 'OK', { duration: 3000 });
        this.router.navigate(['/menu']);
      }
    });
  }

  /**
   * Get form control for validation messages
   */
  get f() {
    return this.orderForm.controls;
  }

  /**
   * Check if form field has error
   */
  hasError(fieldName: string, errorType: string): boolean {
    const field = this.orderForm.get(fieldName);
    return !!(field && field.hasError(errorType) && (field.dirty || field.touched));
  }

  /**
   * Calculate tax
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

  /**
   * Submit order - demonstrates reactive forms
   */
  async onSubmit(): Promise<void> {
    if (this.orderForm.invalid) {
      // Mark all fields as touched to show validation errors
      Object.keys(this.orderForm.controls).forEach(key => {
        this.orderForm.get(key)?.markAsTouched();
      });
      
      this.snackBar.open('Please fill in all required fields correctly', 'OK', {
        duration: 4000
      });
      return;
    }

    this.isSubmitting = true;

    // Get cart items
    this.cartItems$.subscribe(async items => {
      const orderRequest: OrderRequest = {
        customerName: this.orderForm.value.customerName,
        customerEmail: this.orderForm.value.customerEmail,
        customerPhone: this.orderForm.value.customerPhone,
        items: items,
        paymentMethod: this.orderForm.value.paymentMethod,
        deliveryAddress: this.orderForm.value.deliveryAddress,
        specialRequests: this.orderForm.value.specialRequests || undefined
      };

      // Place order using service with observables
      this.orderService.placeOrder(orderRequest).subscribe({
        next: (order) => {
          this.isSubmitting = false;
          
          // Clear cart
          this.cartService.clearCart();
          
          // Show success message
          this.snackBar.open(
            `Order #${order.id} placed successfully!`,
            'OK',
            { duration: 5000 }
          );
          
          // Navigate to success page or menu
          this.router.navigate(['/menu']);
        },
        error: (error) => {
          this.isSubmitting = false;
          console.error('Order placement error:', error);
          this.snackBar.open(
            'Failed to place order. Please try again.',
            'OK',
            { duration: 4000 }
          );
        }
      });
    }).unsubscribe();
  }

  /**
   * Go back to cart
   */
  goBackToCart(): void {
    this.router.navigate(['/cart']);
  }
}
