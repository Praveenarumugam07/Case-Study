import { Component } from '@angular/core';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../models/models';

@Component({
    selector: 'app-search-product',
    template: `
    <app-admin-navbar></app-admin-navbar>
    <div class="page-container">
      <h1 class="page-title">Search Products</h1>
      <p class="page-subtitle">Find products by ID or Name</p>
      <div class="card" style="max-width:600px;margin:auto">
        <div *ngIf="errorMsg" class="alert alert-error">❌ {{errorMsg}}</div>
        <div class="two-col-layout">
          <div class="form-group">
            <label>Product ID</label>
            <input type="number" class="form-control" [(ngModel)]="productId" placeholder="e.g. 101">
          </div>
          <div class="form-group">
            <label>Product Name</label>
            <input type="text" class="form-control" [(ngModel)]="productName" placeholder="e.g. Laptop (case insensitive)">
          </div>
        </div>
        <button class="btn btn-primary" style="width:100%;justify-content:center" (click)="search()" [disabled]="loading">
          {{loading ? 'Searching...' : '🔍 Search'}}
        </button>
      </div>

      <div class="card" style="max-width:600px;margin:auto;margin-top:16px" *ngIf="results.length > 0">
        <h3 style="margin-bottom:16px">Search Results ({{results.length}})</h3>
        <table>
          <thead><tr><th>ID</th><th>Name</th><th>Price</th><th>Category</th><th>Qty</th></tr></thead>
          <tbody>
            <tr *ngFor="let p of results">
              <td>#{{p.productId}}</td><td>{{p.productName}}</td>
              <td>₹{{p.productPrice}}</td><td>{{p.productCategory}}</td><td>{{p.quantityAvailable}}</td>
            </tr>
          </tbody>
        </table>
        <div style="margin-top:12px;color:var(--text-muted);font-size:13px">
          <div *ngFor="let p of results">{{p.productDescription}}</div>
        </div>
      </div>
    </div>
  `
})
export class SearchProductComponent {
    productId: number | null = null;
    productName = '';
    results: Product[] = [];
    errorMsg = '';
    loading = false;

    constructor(private productService: ProductService) { }

    search() {
        this.errorMsg = ''; this.results = [];
        if (!this.productId && !this.productName.trim()) { this.errorMsg = 'Please provide Product ID or Product Name'; return; }
        this.loading = true;
        this.productService.search(this.productId || undefined, this.productName || undefined).subscribe({
            next: res => {
                this.loading = false;
                if (res.success) { this.results = Array.isArray(res.data) ? res.data : [res.data]; }
                else this.errorMsg = res.message;
            },
            error: err => { this.loading = false; this.errorMsg = err?.error?.message || 'Search failed'; }
        });
    }
}
