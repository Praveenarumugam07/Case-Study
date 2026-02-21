import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
    selector: 'app-admin-navbar',
    template: `
    <nav class="navbar">
      <a class="navbar-brand">🛍️ EShopX Admin</a>
      <ul class="navbar-nav">
        <li><button class="nav-link" (click)="navigate('/admin/home')" [class.active]="isActive('/admin/home')">🏠 Home</button></li>
        <li><button class="nav-link" (click)="navigate('/admin/add-product')" [class.active]="isActive('/admin/add-product')">➕ Add Products</button></li>
        <li><button class="nav-link" (click)="navigate('/admin/update-product')" [class.active]="isActive('/admin/update-product')">✏️ Update Products</button></li>
        <li><button class="nav-link" (click)="navigate('/admin/view-products')" [class.active]="isActive('/admin/view-products')">📋 View All Products</button></li>
        <li><button class="nav-link" (click)="navigate('/admin/view-customers')" [class.active]="isActive('/admin/view-customers')">👥 View All Customers</button></li>
        <li><button class="nav-link" (click)="navigate('/admin/orders')" [class.active]="isActive('/admin/orders')">📦 View All Orders</button></li>
        <li><button class="nav-link" (click)="navigate('/admin/cancel-order')" [class.active]="isActive('/admin/cancel-order')">🚫 Change Status</button></li>
      </ul>
      <div class="navbar-right">
        <span class="welcome-text">Welcome, <span>{{adminName}}</span></span>
        <button class="btn btn-danger btn-sm" (click)="logout()">Logout</button>
      </div>
    </nav>
  `
})
export class AdminNavbarComponent implements OnInit {
    adminName = '';

    constructor(private authService: AuthService, private router: Router) { }

    ngOnInit() {
        const admin = this.authService.getAdmin();
        if (admin) this.adminName = admin.username;
    }

    isActive(path: string): boolean {
        return this.router.url === path;
    }

    navigate(path: string) {
        this.router.navigate([path]);
    }

    logout() {
        this.authService.logoutAdmin();
        this.router.navigate(['/admin/login']);
    }
}
