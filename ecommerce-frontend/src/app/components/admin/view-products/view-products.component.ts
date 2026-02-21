import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../models/models';

@Component({
    selector: 'app-view-products',
    template: `
    <app-admin-navbar></app-admin-navbar>
    <div class="page-container">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;flex-wrap:wrap;gap:12px">
        <div>
          <h1 class="page-title">View All Products</h1>
          <p class="page-subtitle">{{products.length}} total products (including soft-deleted)</p>
        </div>
        <div style="display:flex;gap:12px;flex-wrap:wrap">
          <button class="btn btn-secondary btn-sm" (click)="loadProducts()">🔄 Refresh</button>
          <button class="btn btn-success btn-sm" (click)="downloadExcel()" *ngIf="products.length > 10">📥 Download Excel</button>
        </div>
      </div>

      <div style="display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap">
        <input type="text" class="form-control" style="width:180px" [(ngModel)]="filters.id" placeholder="Filter by ID" (input)="applyFilters()">
        <input type="text" class="form-control" style="width:180px" [(ngModel)]="filters.name" placeholder="Filter by Name" (input)="applyFilters()">
        <input type="text" class="form-control" style="width:160px" [(ngModel)]="filters.category" placeholder="Filter by Category" (input)="applyFilters()">
        <input type="number" class="form-control" style="width:140px" [(ngModel)]="filters.maxPrice" placeholder="Max Price" (input)="applyFilters()">
        <button class="btn btn-secondary btn-sm" (click)="clearFilters()">Clear</button>
      </div>

      <div *ngIf="loading" class="flex-center" style="padding:40px"><div class="spinner"></div></div>

      <div style="overflow-x:auto" *ngIf="!loading">
        <table>
          <thead>
            <tr>
              <th>Product ID</th><th>Name</th><th>Price</th><th>Category</th><th>Description</th><th>Qty</th><th>Status</th><th>Deleted</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let p of paginatedProducts">
              <td>#{{p.productId}}</td>
              <td>{{p.productName}}</td>
              <td>₹{{p.productPrice | number:'1.2-2'}}</td>
              <td>{{p.productCategory}}</td>
              <td style="max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">{{p.productDescription}}</td>
              <td>{{p.quantityAvailable}}</td>
              <td><span class="badge" [ngClass]="p.productStatus === 'Active' ? 'badge-active' : 'badge-inactive'">{{p.productStatus}}</span></td>
              <td><span class="badge" [ngClass]="p.isDeleted ? 'badge-cancelled' : 'badge-active'">{{p.isDeleted ? 'Yes' : 'No'}}</span></td>
            </tr>
          </tbody>
        </table>
        <div *ngIf="filteredProducts.length === 0" class="empty-state" style="padding:40px">No products match the filters</div>
      </div>

      <div class="pagination" *ngIf="totalPages > 1">
        <button class="page-btn" (click)="currentPage=1" [disabled]="currentPage===1">«</button>
        <button class="page-btn" (click)="currentPage=currentPage-1" [disabled]="currentPage===1">‹</button>
        <button class="page-btn" *ngFor="let p of getPages()" (click)="currentPage=p" [class.active]="currentPage===p">{{p}}</button>
        <button class="page-btn" (click)="currentPage=currentPage+1" [disabled]="currentPage===totalPages">›</button>
        <button class="page-btn" (click)="currentPage=totalPages" [disabled]="currentPage===totalPages">»</button>
      </div>
    </div>
  `
})
export class ViewProductsComponent implements OnInit {
    products: Product[] = [];
    filteredProducts: Product[] = [];
    filters: any = { id: '', name: '', category: '', maxPrice: null };
    currentPage = 1;
    pageSize = 10;
    loading = true;

    get totalPages() { return Math.ceil(this.filteredProducts.length / this.pageSize); }
    get paginatedProducts() { return this.filteredProducts.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize); }

    constructor(private productService: ProductService) { }

    ngOnInit() { this.loadProducts(); }

    loadProducts() {
        this.loading = true;
        this.productService.getAllAdmin().subscribe({
            next: res => { this.loading = false; this.products = res.data || []; this.filteredProducts = [...this.products]; },
            error: () => { this.loading = false; }
        });
    }

    applyFilters() {
        this.currentPage = 1;
        this.filteredProducts = this.products.filter(p => {
            const matchId = !this.filters.id || p.productId?.toString().includes(this.filters.id);
            const matchName = !this.filters.name || p.productName.toLowerCase().includes(this.filters.name.toLowerCase());
            const matchCat = !this.filters.category || p.productCategory.toLowerCase().includes(this.filters.category.toLowerCase());
            const matchPrice = !this.filters.maxPrice || p.productPrice <= this.filters.maxPrice;
            return matchId && matchName && matchCat && matchPrice;
        });
    }

    clearFilters() { this.filters = { id: '', name: '', category: '', maxPrice: null }; this.filteredProducts = [...this.products]; }

    getPages(): number[] {
        const pages: number[] = [];
        const start = Math.max(1, this.currentPage - 2);
        const end = Math.min(this.totalPages, this.currentPage + 2);
        for (let i = start; i <= end; i++) pages.push(i);
        return pages;
    }

    downloadExcel() {
        const csv = ['Product ID,Name,Price,Category,Description,Quantity,Status,Deleted',
            ...this.filteredProducts.map(p => `${p.productId},${p.productName},${p.productPrice},${p.productCategory},"${p.productDescription}",${p.quantityAvailable},${p.productStatus},${p.isDeleted}`)
        ].join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'products.csv';
        link.click();
    }
}
