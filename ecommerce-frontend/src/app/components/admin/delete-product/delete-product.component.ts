import { Component } from '@angular/core';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../models/models';

@Component({
    selector: 'app-delete-product',
    template: `
    <app-admin-navbar></app-admin-navbar>
    <div class="page-container">
      <h1 class="page-title">Delete Product</h1>
      <p class="page-subtitle">Soft-delete products (they remain in the database as inactive)</p>

      <div class="card" style="max-width:600px;margin:auto">
        <div *ngIf="errorMsg" class="alert alert-error">❌ {{errorMsg}}</div>
        <div *ngIf="successMsg" class="alert alert-success">✅ {{successMsg}}</div>

        <div *ngIf="!foundProduct && !successMsg">
          <div class="two-col-layout">
            <div class="form-group">
              <label>Product ID</label>
              <input type="number" class="form-control" [(ngModel)]="productId" placeholder="Enter product ID">
            </div>
            <div class="form-group">
              <label>Product Name (case insensitive)</label>
              <input type="text" class="form-control" [(ngModel)]="productName" placeholder="Enter product name">
            </div>
          </div>
          <button class="btn btn-primary" style="width:100%;justify-content:center" (click)="findProduct()" [disabled]="loading">
            {{loading ? 'Searching...' : '🔍 Find Product'}}
          </button>
        </div>

        <div *ngIf="foundProduct && !successMsg">
          <div style="background:var(--bg-surface);border-radius:12px;padding:16px;margin-bottom:16px">
            <h3>Product Found</h3>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:8px">
              <div><span class="text-muted text-sm">ID</span><br><strong>#{{foundProduct.productId}}</strong></div>
              <div><span class="text-muted text-sm">Name</span><br><strong>{{foundProduct.productName}}</strong></div>
              <div><span class="text-muted text-sm">Status</span><br>
                <span class="badge" [ngClass]="foundProduct.isDeleted ? 'badge-cancelled' : 'badge-active'">
                  {{foundProduct.isDeleted ? 'Already Deleted' : foundProduct.productStatus}}
                </span>
              </div>
            </div>
          </div>
          <div style="display:flex;gap:12px;flex-wrap:wrap">
            <button *ngIf="!foundProduct.isDeleted" class="btn btn-danger" style="flex:1;justify-content:center" (click)="confirmDelete()" [disabled]="loading">
              {{loading ? 'Deleting...' : '🗑️ Soft Delete'}}
            </button>
            <button *ngIf="foundProduct.isDeleted" class="btn btn-success" style="flex:1;justify-content:center" (click)="restoreProduct()" [disabled]="loading">
              {{loading ? 'Restoring...' : '♻️ Restore Product'}}
            </button>
            <button class="btn btn-secondary" (click)="reset()">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DeleteProductComponent {
    productId: number | null = null;
    productName = '';
    foundProduct: Product | null = null;
    errorMsg = '';
    successMsg = '';
    loading = false;

    constructor(private productService: ProductService) { }

    findProduct() {
        this.errorMsg = ''; this.foundProduct = null;
        if (!this.productId && !this.productName.trim()) { this.errorMsg = 'Enter Product ID or Product Name'; return; }
        this.loading = true;
        if (this.productId) {
            this.productService.getById(this.productId).subscribe({
                next: res => { this.loading = false; if (res.success) this.foundProduct = res.data || null; else this.errorMsg = 'Product deletion failed, incorrect Product ID'; },
                error: () => { this.loading = false; this.errorMsg = 'Product deletion failed, incorrect Product ID'; }
            });
        } else {
            this.productService.search(undefined, this.productName).subscribe({
                next: res => {
                    this.loading = false;
                    if (res.success) {
                        const data = Array.isArray(res.data) ? res.data : [res.data];
                        if (data.length === 1) this.foundProduct = data[0];
                        else if (data.length > 1) this.errorMsg = 'Multiple products match. Please specify by Product ID.';
                        else this.errorMsg = 'Product deletion failed, incorrect Product Name';
                    } else this.errorMsg = res.message;
                },
                error: err => { this.loading = false; this.errorMsg = err?.error?.message || 'Product deletion failed, incorrect Product Name'; }
            });
        }
    }

    confirmDelete() {
        this.loading = true;
        this.productService.softDelete(this.foundProduct!.productId!).subscribe({
            next: res => {
                this.loading = false;
                if (res.success) { this.successMsg = `Product deleted successfully - #${this.foundProduct?.productId} ${this.foundProduct?.productName}`; this.foundProduct = null; }
                else this.errorMsg = res.message;
            },
            error: err => { this.loading = false; this.errorMsg = err?.error?.message || 'Delete failed'; }
        });
    }

    restoreProduct() {
        this.loading = true;
        this.productService.restore(this.foundProduct!.productId!).subscribe({
            next: res => { this.loading = false; if (res.success) { this.successMsg = `Product restored successfully!`; this.foundProduct = null; } else this.errorMsg = res.message; },
            error: () => { this.loading = false; this.errorMsg = 'Restore failed'; }
        });
    }

    reset() { this.productId = null; this.productName = ''; this.foundProduct = null; this.errorMsg = ''; this.successMsg = ''; }
}
