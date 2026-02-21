import { Component } from '@angular/core';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../models/models';

@Component({
    selector: 'app-add-product',
    template: `
    <app-admin-navbar></app-admin-navbar>
    <div class="page-container">
      <h1 class="page-title">Add Product</h1>
      <p class="page-subtitle">Register a new product to the catalog</p>

      <div *ngIf="successData" class="card" style="max-width:600px;margin:auto;text-align:center;padding:40px">
        <div style="font-size:64px;margin-bottom:16px">✅</div>
        <h2 style="color:var(--success);margin-bottom:8px">Product Added Successfully</h2>
        <div style="background:var(--bg-surface);border-radius:12px;padding:20px;text-align:left;margin:16px 0">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
            <div><span class="text-muted text-sm">Product ID</span><br><strong>#{{successData.productId}}</strong></div>
            <div><span class="text-muted text-sm">Name</span><br><strong>{{successData.productName}}</strong></div>
            <div><span class="text-muted text-sm">Price</span><br><strong>₹{{successData.productPrice}}</strong></div>
            <div><span class="text-muted text-sm">Category</span><br><strong>{{successData.productCategory}}</strong></div>
            <div><span class="text-muted text-sm">Quantity</span><br><strong>{{successData.quantityAvailable}}</strong></div>
            <div><span class="text-muted text-sm">Status</span><br><strong>{{successData.productStatus}}</strong></div>
          </div>
          <div style="margin-top:8px"><span class="text-muted text-sm">Description</span><br>{{successData.productDescription}}</div>
        </div>
        <button class="btn btn-primary" (click)="resetForm()">➕ Add Another Product</button>
      </div>

      <div class="card" style="max-width:600px;margin:auto" *ngIf="!successData">
        <div *ngIf="errorMsg" class="alert alert-error">❌ {{errorMsg}}</div>

        <form (ngSubmit)="addProduct()">
          <div class="two-col-layout">
            <div class="form-group">
              <label>Product Name * (unique)</label>
              <input type="text" class="form-control" [(ngModel)]="form.productName" name="productName" maxlength="50" placeholder="Enter product name">
            </div>
            <div class="form-group">
              <label>Product Price *</label>
              <input type="number" class="form-control" [(ngModel)]="form.productPrice" name="productPrice" min="0.01" step="0.01" placeholder="0.00">
            </div>
            <div class="form-group">
              <label>Product Category *</label>
              <input type="text" class="form-control" [(ngModel)]="form.productCategory" name="productCategory" placeholder="Electronics, Fashion, etc.">
            </div>
            <div class="form-group">
              <label>Quantity Available *</label>
              <input type="number" class="form-control" [(ngModel)]="form.quantityAvailable" name="quantityAvailable" min="0" placeholder="0">
            </div>
          </div>
          <div class="form-group">
            <label>Product Description *</label>
            <textarea class="form-control" [(ngModel)]="form.productDescription" name="productDescription" rows="3" placeholder="Describe the product..."></textarea>
          </div>
          <div class="form-group">
            <label>Product Status *</label>
            <select class="form-control" [(ngModel)]="form.productStatus" name="productStatus">
              <option value="Active">Active (visible to customers)</option>
              <option value="Inactive">Inactive (hidden from customers)</option>
            </select>
          </div>
          <button type="submit" class="btn btn-primary" style="width:100%;justify-content:center" [disabled]="loading">
            {{loading ? 'Adding...' : '💾 Add Product'}}
          </button>
        </form>

        <hr style="border-color:var(--border);margin:24px 0">
        <h3 style="margin-bottom:16px">📤 Bulk Upload</h3>
        <div *ngIf="uploadErrors.length > 0" class="alert alert-warning">
          Completed with errors:<br><span *ngFor="let e of uploadErrors">• {{e}}<br></span>
        </div>
        <div *ngIf="uploadSuccess" class="alert alert-success">✅ Bulk upload successful!</div>
        <div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap">
          <input type="file" #fileInput accept=".csv,.xlsx,.xls" (change)="onFileSelected($event)" style="display:none">
          <button class="btn btn-secondary" (click)="fileInput.click()">📎 Choose File (.csv or .xlsx)</button>
          <span style="color:var(--text-muted);font-size:13px">{{selectedFile?.name || 'No file selected'}}</span>
          <button class="btn btn-primary btn-sm" (click)="uploadFile()" [disabled]="!selectedFile || uploadLoading">
            {{uploadLoading ? 'Uploading...' : '⬆️ Upload'}}
          </button>
        </div>
      </div>
    </div>
  `
})
export class AddProductComponent {
    form: any = { productName: '', productPrice: null, productCategory: '', productDescription: '', quantityAvailable: null, productStatus: 'Active', productImage: '' };
    errorMsg = '';
    successData: any = null;
    loading = false;
    selectedFile: File | null = null;
    uploadLoading = false;
    uploadErrors: string[] = [];
    uploadSuccess = false;

    constructor(private productService: ProductService) { }

    addProduct() {
        this.errorMsg = '';
        if (!this.form.productName?.trim()) { this.errorMsg = 'Invalid product name'; return; }
        if (!this.form.productPrice || this.form.productPrice <= 0) { this.errorMsg = 'Invalid Price'; return; }
        if (!this.form.productCategory?.trim()) { this.errorMsg = 'Invalid Category'; return; }
        if (!this.form.productDescription?.trim()) { this.errorMsg = 'Invalid description'; return; }
        if (this.form.quantityAvailable === null || this.form.quantityAvailable < 0) { this.errorMsg = 'Invalid count'; return; }
        this.loading = true;
        this.productService.addProduct(this.form).subscribe({
            next: res => {
                this.loading = false;
                if (res.success) this.successData = res.data;
                else this.errorMsg = res.message;
            },
            error: err => { this.loading = false; this.errorMsg = err?.error?.message || 'Failed to add product'; }
        });
    }

    onFileSelected(e: any) { this.selectedFile = e.target.files[0] || null; }

    uploadFile() {
        if (!this.selectedFile) return;
        this.uploadLoading = true; this.uploadErrors = []; this.uploadSuccess = false;
        this.productService.bulkUpload(this.selectedFile).subscribe({
            next: res => {
                this.uploadLoading = false;
                const errors = Array.isArray(res.data) ? res.data : [];
                if (errors.length === 0) this.uploadSuccess = true;
                else this.uploadErrors = errors;
            },
            error: () => { this.uploadLoading = false; this.uploadErrors = ['Upload failed']; }
        });
    }

    resetForm() { this.form = { productName: '', productPrice: null, productCategory: '', productDescription: '', quantityAvailable: null, productStatus: 'Active', productImage: '' }; this.successData = null; }
}
