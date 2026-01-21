import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MenuService } from '../../services/menu.service';
import { CartService } from '../../services/cart.service';
import { MenuItem, Category } from '../../models/menu.model';
import { Observable, combineLatest, map } from 'rxjs';

@Component({
  selector: 'app-menu-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatCheckboxModule,
    MatSnackBarModule
  ],
  templateUrl: './menu-list.component.html',
  styleUrls: ['./menu-list.component.scss']
})
export class MenuListComponent implements OnInit {
  categories$!: Observable<Category[]>;
  filteredMenuItems$!: Observable<MenuItem[]>;
  
  // Filters
  selectedCategoryId: number | null = null;
  searchTerm: string = '';
  isVegetarianOnly: boolean = false;
  isSpicyOnly: boolean = false;
  maxPrice: number | null = null;

  constructor(
    private menuService: MenuService,
    private cartService: CartService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.categories$ = this.menuService.getCategories();
    this.applyFilters();
  }

  /**
   * Apply filters to menu items using RxJS operators
   */
  applyFilters(): void {
    this.filteredMenuItems$ = combineLatest([
      this.menuService.getAvailableMenuItems(),
      this.categories$
    ]).pipe(
      map(([items, categories]) => {
        let filtered = items;

        // Filter by category
        if (this.selectedCategoryId !== null) {
          filtered = filtered.filter(item => item.categoryId === this.selectedCategoryId);
        }

        // Filter by vegetarian
        if (this.isVegetarianOnly) {
          filtered = filtered.filter(item => item.isVegetarian);
        }

        // Filter by spicy
        if (this.isSpicyOnly) {
          filtered = filtered.filter(item => item.isSpicy);
        }

        // Filter by price
        if (this.maxPrice !== null && this.maxPrice > 0) {
          filtered = filtered.filter(item => item.price <= this.maxPrice!);
        }

        // Filter by search term
        if (this.searchTerm.trim()) {
          const term = this.searchTerm.toLowerCase().trim();
          filtered = filtered.filter(item =>
            item.name.toLowerCase().includes(term) ||
            item.description.toLowerCase().includes(term) ||
            item.ingredients.some(ing => ing.toLowerCase().includes(term))
          );
        }

        return filtered;
      })
    );
  }

  /**
   * Filter by category using *ngFor and event binding
   */
  onCategoryChange(categoryId: number | null): void {
    this.selectedCategoryId = categoryId;
    this.applyFilters();
  }

  /**
   * Handle search input using event binding
   */
  onSearchChange(): void {
    this.applyFilters();
  }

  /**
   * Handle filter checkboxes using two-way data binding
   */
  onFilterChange(): void {
    this.applyFilters();
  }

  /**
   * Add item to cart with dependency injection
   */
  addToCart(menuItem: MenuItem): void {
    this.cartService.addToCart(menuItem, 1);
    this.snackBar.open(`${menuItem.name} added to cart!`, 'View Cart', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'bottom'
    }).onAction().subscribe(() => {
      this.router.navigate(['/cart']);
    });
  }

  /**
   * View item details using Angular routing
   */
  viewDetails(menuItem: MenuItem): void {
    this.router.navigate(['/menu', menuItem.id]);
  }

  /**
   * Clear all filters
   */
  clearFilters(): void {
    this.selectedCategoryId = null;
    this.searchTerm = '';
    this.isVegetarianOnly = false;
    this.isSpicyOnly = false;
    this.maxPrice = null;
    this.applyFilters();
  }

  /**
   * Get category name by ID
   */
  getCategoryName(categoryId: number): Observable<string> {
    return this.categories$.pipe(
      map(categories => {
        const category = categories.find(c => c.id === categoryId);
        return category ? category.name : 'Unknown';
      })
    );
  }
}
