import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { MenuService } from '../../services/menu.service';
import { CartService } from '../../services/cart.service';
import { MenuItem } from '../../models/menu.model';
import { Observable, switchMap } from 'rxjs';

@Component({
  selector: 'app-menu-detail',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule
  ],
  templateUrl: './menu-detail.component.html',
  styleUrls: ['./menu-detail.component.scss']
})
export class MenuDetailComponent implements OnInit {
  menuItem$!: Observable<MenuItem | undefined>;
  quantity: number = 1;
  specialInstructions: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private menuService: MenuService,
    private cartService: CartService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    // Use RxJS switchMap to get menu item based on route parameter
    this.menuItem$ = this.route.paramMap.pipe(
      switchMap(params => {
        const id = Number(params.get('id'));
        return this.menuService.getMenuItemById(id);
      })
    );
  }

  /**
   * Increase quantity
   */
  increaseQuantity(): void {
    if (this.quantity < 99) {
      this.quantity++;
    }
  }

  /**
   * Decrease quantity
   */
  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  /**
   * Add to cart with quantity and special instructions
   */
  addToCart(menuItem: MenuItem): void {
    if (!menuItem.isAvailable) {
      this.snackBar.open('This item is currently unavailable', 'OK', {
        duration: 3000
      });
      return;
    }

    this.cartService.addToCart(
      menuItem,
      this.quantity,
      this.specialInstructions || undefined
    );

    this.snackBar.open(
      `${this.quantity}x ${menuItem.name} added to cart!`,
      'View Cart',
      {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'bottom'
      }
    ).onAction().subscribe(() => {
      this.router.navigate(['/cart']);
    });

    // Reset form
    this.quantity = 1;
    this.specialInstructions = '';
  }

  /**
   * Go back to menu
   */
  goBack(): void {
    this.router.navigate(['/menu']);
  }

  /**
   * Calculate total price
   */
  getTotalPrice(price: number): number {
    return price * this.quantity;
  }
}
