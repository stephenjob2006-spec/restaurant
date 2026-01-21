# Restaurant Menu and Ordering System

A modern, feature-rich restaurant ordering system built with Angular 17, TypeScript, and Angular Material.

## Features

### Core Functionality
- 🍽️ **Menu Browsing**: Browse dishes organized by categories
- 📋 **Detailed Menu Items**: View ingredients, prices, and nutritional information
- 🛒 **Shopping Cart**: Add, update, and remove items
- 📝 **Order Management**: Place orders with customer details
- 💳 **Multiple Payment Options**: Support for card, online payment, and cash

### Technical Highlights
- **TypeScript**: Strongly-typed models with classes, interfaces, and enums
- **Angular Components**: Modular, reusable components
- **Reactive Forms**: Form validation and error handling
- **RxJS Observables**: Reactive data flow and state management
- **Angular Material**: Modern, responsive UI design
- **Dependency Injection**: Service-based architecture
- **Angular Directives**: `*ngFor`, `*ngIf`, `[ngClass]`, `[ngStyle]`
- **Local Storage**: Persistent cart state

## Project Structure

```
Restaurant/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── navbar/           # Navigation bar
│   │   │   ├── menu-list/        # Menu items grid with filters
│   │   │   ├── menu-detail/      # Detailed item view
│   │   │   ├── cart/             # Shopping cart
│   │   │   └── order-form/       # Checkout form
│   │   ├── models/
│   │   │   └── menu.model.ts     # TypeScript interfaces and classes
│   │   ├── services/
│   │   │   ├── menu.service.ts   # Menu data management
│   │   │   ├── cart.service.ts   # Cart operations
│   │   │   └── order.service.ts  # Order processing
│   │   ├── app.component.ts      # Root component
│   │   ├── app.routes.ts         # Routing configuration
│   │   └── app.config.ts         # App configuration
│   ├── assets/
│   │   └── data/
│   │       └── menu-data.json    # Mock menu data
│   ├── index.html
│   ├── main.ts
│   └── styles.scss
├── angular.json
├── package.json
├── tsconfig.json
└── README.md
```

## Setup and Installation

### Prerequisites
- Node.js (v18 or later)
- npm (v9 or later)

### Installation Steps

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run Development Server**
   ```bash
   npm start
   ```
   or
   ```bash
   ng serve
   ```

3. **Open Browser**
   Navigate to `http://localhost:4200/`

4. **Build for Production**
   ```bash
   npm run build
   ```
   or
   ```bash
   ng build
   ```

## TypeScript Features Demonstrated

### 1. Interfaces and Types
```typescript
interface MenuItem {
  id: number;
  name: string;
  price: number;
  // ... more properties
}
```

### 2. Classes with Access Modifiers
```typescript
export class Customer {
  constructor(
    public id: number,
    public name: string,
    private readonly loyaltyPoints: number = 0
  ) {}
}
```

### 3. Enums
```typescript
export enum OrderStatus {
  Pending = 'PENDING',
  Confirmed = 'CONFIRMED',
  // ...
}
```

### 4. Inheritance
Models inherit common properties and methods.

## Angular Features Demonstrated

### 1. Components
- Standalone components with imports
- Data binding (property, event, two-way)
- Component communication

### 2. Directives
- `*ngFor` - Iterate over collections
- `*ngIf` - Conditional rendering
- `[ngClass]` - Dynamic CSS classes
- `[ngStyle]` - Dynamic inline styles

### 3. Services with Dependency Injection
```typescript
@Injectable({ providedIn: 'root' })
export class CartService {
  constructor(private http: HttpClient) {}
}
```

### 4. Observables and RxJS
- BehaviorSubject for state management
- Observable streams for async data
- RxJS operators (map, filter, combineLatest)

### 5. Reactive Forms
- FormBuilder for form creation
- Validators (required, email, pattern)
- Custom validation logic

### 6. Routing
- Route configuration
- Route parameters
- Navigation guards

### 7. Angular Material
- Pre-built UI components
- Consistent design system
- Responsive layouts

## Usage Guide

### Browsing Menu
1. Navigate to the menu page
2. Use filters to find items:
   - Filter by category
   - Search by name/ingredients
   - Filter by dietary preferences (vegetarian, spicy)
   - Filter by price range

### Adding to Cart
1. Click on a menu item to view details
2. Select quantity
3. Add special instructions (optional)
4. Click "Add to Cart"

### Checkout
1. Navigate to cart
2. Review items and quantities
3. Click "Proceed to Checkout"
4. Fill in delivery information
5. Select payment method
6. Place order

## Key Concepts Learned

1. **TypeScript Fundamentals**
   - Strong typing
   - Interfaces and classes
   - Access modifiers
   - Enums and unions

2. **Angular Architecture**
   - Component-based design
   - Service layer
   - Dependency injection
   - Module organization

3. **Reactive Programming**
   - Observables
   - Subjects
   - RxJS operators
   - Async pipe

4. **Forms**
   - Reactive forms
   - Validation
   - Error handling
   - Form state management

5. **Routing**
   - Route configuration
   - Route parameters
   - Navigation
   - Route guards

6. **Material Design**
   - Component library
   - Theming
   - Responsive design
   - Accessibility

## Mock Data

The application uses a JSON file (`assets/data/menu-data.json`) to simulate a backend API. This includes:
- 4 categories
- 13 menu items
- Complete item details (ingredients, prices, dietary info)

## Future Enhancements

- User authentication
- Order history
- Reviews and ratings
- Real-time order tracking
- Integration with payment gateways
- Admin dashboard
- Inventory management

## License

MIT License - Feel free to use this project for learning purposes.

## Author

Built with Angular 17 and TypeScript
