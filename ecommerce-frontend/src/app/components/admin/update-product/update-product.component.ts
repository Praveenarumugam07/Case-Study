import { Component } from '@angular/core';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../models/models';

@Component({
    selector: 'app-update-product',
    template: `
    <app-admin-navbar></app-admin-navbar>
    <div class="page-container">
      <h1 class="page-title">Update Product</h1>
      <p class="page-subtitle">Search and update product details</p>

      <div class="card" style="max-width:600px;margin:auto">
        <div *ngIf="errorMsg" class="alert alert-error">❌ {{errorMsg}}</div>
        <div *ngIf="successMsg" class="alert alert-success" style="color:var(--success)">✅ {{successMsg}}</div>

        <div *ngIf="!productToUpdate">
          <div class="form-group">
            <label>Product ID *</label>
            <input type="number" class="form-control" [(ngModel)]="searchId" placeholder="Enter 3-digit product ID">
          </div>
          <button class="btn btn-primary" style="width:100%;justify-content:center" (click)="findProduct()" [disabled]="loading">
            {{loading ? 'Searching...' : '🔍 Find Product'}}
          </button>
        </div>

        <form (ngSubmit)="confirmUpdate()" *ngIf="productToUpdate && !successMsg">
          <div class="form-group">
            <label>Product ID (read-only)</label>
            <input type="text" class="form-control" [value]="productToUpdate.productId" readonly style="opacity:0.6">
          </div>
          <div class="two-col-layout">
            <div class="form-group">
              <label>Product Name</label>
              <input type="text" class="form-control" [(ngModel)]="form.productName" name="productName" maxlength="50">
            </div>
            <div class="form-group">
              <label>Product Price</label>
              <input type="number" class="form-control" [(ngModel)]="form.productPrice" name="productPrice" min="0.01" step="0.01">
            </div>
            <div class="form-group">
              <label>Product Category</label>
              <input type="text" class="form-control" [(ngModel)]="form.productCategory" name="productCategory">
            </div>
            <div class="form-group">
              <label>Quantity Available</label>
              <input type="number" class="form-control" [(ngModel)]="form.quantityAvailable" name="quantityAvailable" min="0">
            </div>
          </div>
          <div class="form-group">
            <label>Product Description (max 200 chars)</label>
            <textarea class="form-control" [(ngModel)]="form.productDescription" name="productDescription" maxlength="200" rows="3"></textarea>
          </div>
          <div class="form-group">
            <label>Product Status</label>
            <select class="form-control" [(ngModel)]="form.productStatus" name="productStatus">
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div style="display:flex;gap:12px;flex-wrap:wrap">
            <button type="submit" class="btn btn-primary" style="flex:1;justify-content:center" [disabled]="loading">
              {{loading ? 'Updating...' : '💾 Update'}}
            </button>
            <button type="button" class="btn btn-secondary" (click)="reset()">↺ Reset</button>
          </div>
        </form>

        <div *ngIf="successMsg" style="margin-top:16px;background:var(--bg-surface);border-radius:12px;padding:16px">
          <h4 style="margin-bottom:8px">Updated Product Details</h4>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:13px">
            <div>ID: <strong>#{{form.productId}}</strong></div>
            <div>Name: <strong>{{form.productName}}</strong></div>
            <div>Price: <strong>₹{{form.productPrice}}</strong></div>
            <div>Category: <strong>{{form.productCategory}}</strong></div>
            <div>Quantity: <strong>{{form.quantityAvailable}}</strong></div>
            <div>Status: <strong>{{form.productStatus}}</strong></div>
          </div>
        </div>
        <button *ngIf="successMsg" class="btn btn-primary mt-16" (click)="reset()">Update Another</button>
      </div>
    </div>
  `
})
export class UpdateProductComponent {
    searchId: number | null = null;
    productToUpdate: Product | null = null;
    form: any = {};
    errorMsg = '';
    successMsg = '';
    loading = false;

    constructor(private productService: ProductService) { }

    findProduct() {
        this.errorMsg = '';
        if (!this.searchId) { this.errorMsg = 'Product ID is required'; return; }
        this.loading = true;
        this.productService.getById(this.searchId).subscribe({
            next: res => { this.loading = false; if (res.success && res.data) { this.productToUpdate = res.data; this.form = { ...res.data }; } else this.errorMsg = 'Product not found'; },
            error: () => { this.loading = false; this.errorMsg = 'Product not found'; }
        });
    }

    confirmUpdate() {
        if (!confirm('Do you want to update the product information with the given changes?')) return;
        if (!this.form.productName?.trim()) { this.errorMsg = 'Product Name is required'; return; }
        if (!this.form.productPrice || this.form.productPrice <= 0) { this.errorMsg = 'Invalid Price'; return; }
        this.loading = true;
        this.productService.updateProduct(this.productToUpdate!.productId!, this.form).subscribe({
            next: res => { this.loading = false; if (res.success) this.successMsg = 'Product Updated Successfully.'; else this.errorMsg = res.message; },
            error: err => { this.loading = false; this.errorMsg = err?.error?.message || 'Update failed'; }
        });
    }

    reset() { this.productToUpdate = null; this.form = {}; this.searchId = null; this.errorMsg = ''; this.successMsg = ''; }
}
