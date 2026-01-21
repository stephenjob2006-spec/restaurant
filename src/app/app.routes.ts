import { Routes } from '@angular/router';
import { MenuListComponent } from './components/menu-list/menu-list.component';
import { MenuDetailComponent } from './components/menu-detail/menu-detail.component';
import { CartComponent } from './components/cart/cart.component';
import { OrderFormComponent } from './components/order-form/order-form.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/menu',
    pathMatch: 'full'
  },
  {
    path: 'menu',
    component: MenuListComponent,
    title: 'Menu - Restaurant Ordering System'
  },
  {
    path: 'menu/:id',
    component: MenuDetailComponent,
    title: 'Menu Details - Restaurant Ordering System'
  },
  {
    path: 'cart',
    component: CartComponent,
    title: 'Cart - Restaurant Ordering System'
  },
  {
    path: 'checkout',
    component: OrderFormComponent,
    title: 'Checkout - Restaurant Ordering System'
  },
  {
    path: '**',
    redirectTo: '/menu'
  }
];
