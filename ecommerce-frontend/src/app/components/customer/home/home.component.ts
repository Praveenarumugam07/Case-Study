import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { CartService } from '../../../services/cart.service';
import { AuthService } from '../../../services/auth.service';
import { Product } from '../../../models/models';

@Component({
    selector: 'app-home',
    template: `
    <app-navbar></app-navbar>
    <div class="page-container">
      <div style="margin-bottom:32px">
        <h1 class="page-title">Explore Products</h1>
        <p class="page-subtitle">Discover amazing products at great prices</p>
      </div>

      <div style="display:flex;gap:16px;flex-wrap:wrap;margin-bottom:24px;align-items:center">
        <div class="search-input" style="flex:1;min-width:200px">
          <span class="material-icons search-icon">search</span>
          <input [(ngModel)]="searchTerm" (input)="applyFilters()" placeholder="Search by product name or ID...">
        </div>
        <select class="form-control" style="width:200px" [(ngModel)]="selectedCategory" (change)="applyFilters()">
          <option value="">All Categories</option>
          <option *ngFor="let cat of categories" [value]="cat">{{cat}}</option>
        </select>
        <button class="btn btn-secondary btn-sm" (click)="clearFilters()">Clear Filters</button>
      </div>

      <div *ngIf="addedMsg" class="alert alert-success" style="margin-bottom:16px">✅ {{addedMsg}}</div>
      <div *ngIf="errorMsg" class="alert alert-error" style="margin-bottom:16px">❌ {{errorMsg}}</div>
      <div *ngIf="loading" class="flex-center" style="padding:60px"><div class="spinner"></div></div>

      <div class="products-grid" *ngIf="!loading">
        <div class="product-card" *ngFor="let product of filteredProducts">
          <div class="product-image">
            <span>{{getCategoryEmoji(product.productCategory)}}</span>
          </div>
          <div class="product-info">
            <div class="product-category">{{product.productCategory}}</div>
            <h3 class="product-name">{{product.productName}}</h3>
            <div class="product-price">₹{{product.productPrice | number:'1.2-2'}}</div>
            <p class="product-desc">{{product.productDescription}}</p>
            <div style="font-size:12px;color:var(--text-muted);margin-bottom:12px">
              ID: #{{product.productId}} &nbsp;|&nbsp; Stock: {{product.quantityAvailable}}
            </div>
            <button *ngIf="product.quantityAvailable >= 1" class="btn btn-primary btn-sm" style="width:100%;justify-content:center"
              (click)="addToCart(product)">🛒 Add to Cart</button>
            <div *ngIf="product.quantityAvailable < 1" class="alert alert-error" style="text-align:center;margin:0;padding:10px">
              ❌ Product not available
            </div>
          </div>
        </div>
      </div>

      <div class="empty-state" *ngIf="!loading && filteredProducts.length === 0">
        <div class="empty-state-icon">🔍</div>
        <div class="empty-state-text">No products found</div>
        <div class="empty-state-subtext">Try clearing filters or search terms</div>
      </div>
    </div>
  `
})
export class HomeComponent implements OnInit {
    products: Product[] = [];
    filteredProducts: Product[] = [];
    categories: string[] = [];
    searchTerm = '';
    selectedCategory = '';
    addedMsg = '';
    errorMsg = '';
    loading = true;
    customerId = '';

    constructor(private productService: ProductService, private cartService: CartService,
        private authService: AuthService, private router: Router) { }

    ngOnInit() {
        const customer = this.authService.getCustomer();
        if (customer) this.customerId = customer.customerId;
        this.loadProducts();
        this.loadCategories();
    }

    loadProducts() {
        this.productService.getAll().subscribe({
            next: res => {
                this.loading = false;
                this.products = res.data || [];
                this.filteredProducts = [...this.products];
            },
            error: () => { this.loading = false; }
        });
    }

    loadCategories() {
        this.productService.getCategories().subscribe(res => this.categories = res.data || []);
    }

    applyFilters() {
        this.filteredProducts = this.products.filter(p => {
            const matchSearch = !this.searchTerm ||
                p.productName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                p.productId?.toString().includes(this.searchTerm);
            const matchCategory = !this.selectedCategory || p.productCategory === this.selectedCategory;
            return matchSearch && matchCategory;
        });
    }

    clearFilters() {
        this.searchTerm = '';
        this.selectedCategory = '';
        this.filteredProducts = [...this.products];
    }

    addToCart(product: Product) {
        this.addedMsg = '';
        this.errorMsg = '';
        this.cartService.addToCart(this.customerId, product.productId!, 1).subscribe({
            next: res => {
                if (res.success) { this.addedMsg = `${product.productName} added to cart!`; setTimeout(() => this.addedMsg = '', 3000); }
                else { this.errorMsg = res.message; setTimeout(() => this.errorMsg = '', 3000); }
            },
            error: err => { this.errorMsg = err?.error?.message || 'Failed to add to cart'; setTimeout(() => this.errorMsg = '', 3000); }
        });
    }

    getCategoryEmoji(cat: string): string {
        const map: any = { 'Electronics': '💻', 'Fashion': '👗', 'Stationary': '📝', 'Home Decor': '🏠', 'Sports': '⚽', 'Books': '📚' };
        return map[cat] || '🛍️';
    }
}
