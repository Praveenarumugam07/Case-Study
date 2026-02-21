import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { AuthService } from '../../../services/auth.service';
import { Product } from '../../../models/models';

@Component({
    selector: 'app-admin-home',
    template: `
    <app-admin-navbar></app-admin-navbar>
    <div class="page-container">
      <h1 class="page-title">Admin Dashboard</h1>
      <p class="page-subtitle">Manage products, orders and customers</p>

      <div style="display:flex;gap:12px;margin-bottom:24px;flex-wrap:wrap;align-items:center">
        <div class="search-input" style="flex:1;min-width:200px">
          <span class="material-icons search-icon">search</span>
          <input [(ngModel)]="searchTerm" (input)="applyFilters()" placeholder="Search products...">
        </div>
        <select class="form-control" style="width:200px" [(ngModel)]="selectedCategory" (change)="applyFilters()">
          <option value="">All Categories</option>
          <option *ngFor="let cat of categories" [value]="cat">{{cat}}</option>
        </select>
      </div>

      <div class="products-grid">
        <div class="product-card" *ngFor="let product of filteredProducts">
          <div class="product-image">
            <span>{{getCategoryEmoji(product.productCategory)}}</span>
          </div>
          <div class="product-info">
            <div class="product-category">{{product.productCategory}}</div>
            <h3 class="product-name">{{product.productName}}</h3>
            <div class="product-price">₹{{product.productPrice | number:'1.2-2'}}</div>
            <div style="font-size:12px;color:var(--text-muted);margin-bottom:8px">
              ID: #{{product.productId}} | Stock: {{product.quantityAvailable}}
            </div>
            <span class="badge" [ngClass]="product.productStatus === 'Active' ? 'badge-active' : 'badge-inactive'">
              {{product.productStatus}}
            </span>
            <span class="badge badge-cancelled" *ngIf="product.isDeleted" style="margin-left:8px">Deleted</span>
          </div>
        </div>
      </div>
      <div class="empty-state" *ngIf="filteredProducts.length === 0 && !loading">
        <div class="empty-state-icon">📦</div>
        <div class="empty-state-text">No products found</div>
      </div>
    </div>
  `
})
export class AdminHomeComponent implements OnInit {
    products: Product[] = [];
    filteredProducts: Product[] = [];
    categories: string[] = [];
    searchTerm = '';
    selectedCategory = '';
    loading = true;

    constructor(private productService: ProductService, private authService: AuthService, private router: Router) { }

    ngOnInit() {
        this.productService.getAllAdmin().subscribe({
            next: res => { this.loading = false; this.products = res.data || []; this.filteredProducts = [...this.products]; },
            error: () => { this.loading = false; }
        });
        this.productService.getCategories().subscribe(res => this.categories = res.data || []);
    }

    applyFilters() {
        this.filteredProducts = this.products.filter(p => {
            const matchSearch = !this.searchTerm || p.productName.toLowerCase().includes(this.searchTerm.toLowerCase());
            const matchCat = !this.selectedCategory || p.productCategory === this.selectedCategory;
            return matchSearch && matchCat;
        });
    }

    getCategoryEmoji(cat: string): string {
        const map: any = { 'Electronics': '💻', 'Fashion': '👗', 'Stationary': '📝', 'Home Decor': '🏠' };
        return map[cat] || '🛍️';
    }
}
