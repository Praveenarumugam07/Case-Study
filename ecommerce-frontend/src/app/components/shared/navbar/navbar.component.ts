import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CartService } from '../../../services/cart.service';

@Component({
    selector: 'app-navbar',
    template: `
    <nav class="navbar">
      <a class="navbar-brand" routerLink="/home">🛒 EShopX</a>
      <ul class="navbar-nav">
        <li><button class="nav-link" (click)="navigate('/home')" [class.active]="isActive('/home')">🏠 Home</button></li>
        <li>
          <button class="nav-link cart-badge" (click)="navigate('/cart')" [class.active]="isActive('/cart')">
            🛒 My Cart
            <span class="cart-count" *ngIf="cartCount > 0">{{cartCount}}</span>
          </button>
        </li>
        <li><button class="nav-link" (click)="navigate('/my-orders')" [class.active]="isActive('/my-orders')">📦 My Orders</button></li>
      </ul>
      <div class="navbar-right">
        <span class="welcome-text">Welcome, <span>{{customerName}}</span></span>
        <button class="nav-link" (click)="navigate('/profile')" title="Profile">👤</button>
        <button class="btn btn-danger btn-sm" (click)="logout()">Logout</button>
      </div>
    </nav>
  `
})
export class NavbarComponent implements OnInit {
    customerName = '';
    cartCount = 0;

    constructor(private authService: AuthService, private router: Router, private cartService: CartService) { }

    ngOnInit() {
        const customer = this.authService.getCustomer();
        if (customer) {
            this.customerName = customer.name;
            this.cartService.getCart(customer.customerId).subscribe(res => {
                this.cartCount = res.data ? res.data.length : 0;
            });
        }
    }

    isActive(path: string): boolean {
        return this.router.url === path;
    }

    navigate(path: string) {
        this.router.navigate([path]);
    }

    logout() {
        this.authService.logoutCustomer();
        this.router.navigate(['/login']);
    }
}
