import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map, catchError, of } from 'rxjs';
import { MenuItem, Category } from '../models/menu.model';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private menuDataUrl = 'assets/data/menu-data.json';
  
  // BehaviorSubjects for state management
  private categoriesSubject = new BehaviorSubject<Category[]>([]);
  private menuItemsSubject = new BehaviorSubject<MenuItem[]>([]);
  
  // Public observables
  public categories$ = this.categoriesSubject.asObservable();
  public menuItems$ = this.menuItemsSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadMenuData();
  }

  /**
   * Load menu data from JSON file
   */
  private loadMenuData(): void {
    this.http.get<{ categories: Category[], menuItems: MenuItem[] }>(this.menuDataUrl)
      .pipe(
        catchError(error => {
          console.error('Error loading menu data:', error);
          return of({ categories: [], menuItems: [] });
        })
      )
      .subscribe(data => {
        this.categoriesSubject.next(data.categories);
        this.menuItemsSubject.next(data.menuItems);
      });
  }

  /**
   * Get all categories
   */
  getCategories(): Observable<Category[]> {
    return this.categories$;
  }

  /**
   * Get all menu items
   */
  getMenuItems(): Observable<MenuItem[]> {
    return this.menuItems$;
  }

  /**
   * Get menu items by category ID
   */
  getMenuItemsByCategory(categoryId: number): Observable<MenuItem[]> {
    return this.menuItems$.pipe(
      map(items => items.filter(item => item.categoryId === categoryId))
    );
  }

  /**
   * Get a single menu item by ID
   */
  getMenuItemById(id: number): Observable<MenuItem | undefined> {
    return this.menuItems$.pipe(
      map(items => items.find(item => item.id === id))
    );
  }

  /**
   * Filter menu items (vegetarian, spicy, etc.)
   */
  filterMenuItems(filters: {
    isVegetarian?: boolean;
    isSpicy?: boolean;
    maxPrice?: number;
    searchTerm?: string;
  }): Observable<MenuItem[]> {
    return this.menuItems$.pipe(
      map(items => {
        let filtered = items;

        if (filters.isVegetarian !== undefined) {
          filtered = filtered.filter(item => item.isVegetarian === filters.isVegetarian);
        }

        if (filters.isSpicy !== undefined) {
          filtered = filtered.filter(item => item.isSpicy === filters.isSpicy);
        }

        if (filters.maxPrice !== undefined) {
          filtered = filtered.filter(item => item.price <= filters.maxPrice!);
        }

        if (filters.searchTerm) {
          const term = filters.searchTerm.toLowerCase();
          filtered = filtered.filter(item =>
            item.name.toLowerCase().includes(term) ||
            item.description.toLowerCase().includes(term)
          );
        }

        return filtered;
      })
    );
  }

  /**
   * Get available menu items only
   */
  getAvailableMenuItems(): Observable<MenuItem[]> {
    return this.menuItems$.pipe(
      map(items => items.filter(item => item.isAvailable))
    );
  }
}
