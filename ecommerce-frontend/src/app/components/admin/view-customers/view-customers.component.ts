import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../services/admin.service';
import { Customer } from '../../../models/models';

@Component({
    selector: 'app-view-customers',
    template: `
    <app-admin-navbar></app-admin-navbar>
    <div class="page-container">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;flex-wrap:wrap;gap:12px">
        <div>
          <h1 class="page-title">View All Customers</h1>
          <p class="page-subtitle">{{customers.length}} registered customers</p>
        </div>
        <button class="btn btn-success btn-sm" (click)="downloadCsv()" *ngIf="customers.length > 10">📥 Download CSV</button>
      </div>

      <div style="display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap">
        <input type="text" class="form-control" style="width:200px" [(ngModel)]="searchTerm" (input)="applyFilters()" placeholder="Search by ID, Name, Email, Phone...">
        <button class="btn btn-secondary btn-sm" (click)="searchTerm='';applyFilters()">Clear</button>
      </div>

      <div *ngIf="loading" class="flex-center" style="padding:40px"><div class="spinner"></div></div>

      <div *ngIf="filteredCustomers.length === 0 && !loading" class="empty-state" style="padding:40px">
        <div class="empty-state-icon">👥</div>
        <div class="empty-state-text">No customers found</div>
      </div>

      <div style="overflow-x:auto" *ngIf="!loading && filteredCustomers.length > 0">
        <table>
          <thead>
            <tr><th>Customer ID</th><th>Name</th><th>Country</th><th>State</th><th>City</th><th>Phone</th><th>Email</th><th>Address</th></tr>
          </thead>
          <tbody>
            <tr *ngFor="let c of paginatedCustomers">
              <td><strong>{{c.customerId}}</strong></td>
              <td>{{c.name}}</td>
              <td>{{c.country}}</td>
              <td>{{c.state}}</td>
              <td>{{c.city}}</td>
              <td>{{c.phoneNumber}}</td>
              <td>{{c.email}}</td>
              <td style="max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">{{c.address1}}</td>
            </tr>
          </tbody>
        </table>
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
export class ViewCustomersComponent implements OnInit {
    customers: Customer[] = [];
    filteredCustomers: Customer[] = [];
    searchTerm = '';
    currentPage = 1;
    pageSize = 10;
    loading = true;

    get totalPages() { return Math.ceil(this.filteredCustomers.length / this.pageSize); }
    get paginatedCustomers() { return this.filteredCustomers.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize); }

    constructor(private adminService: AdminService) { }

    ngOnInit() {
        this.adminService.getAllCustomers().subscribe({
            next: res => { this.loading = false; this.customers = res.data || []; this.filteredCustomers = [...this.customers]; },
            error: () => { this.loading = false; }
        });
    }

    applyFilters() {
        const term = this.searchTerm.toLowerCase();
        this.currentPage = 1;
        this.filteredCustomers = !term ? [...this.customers] : this.customers.filter(c =>
            c.customerId?.toLowerCase().includes(term) || c.name.toLowerCase().includes(term) ||
            c.email.toLowerCase().includes(term) || c.phoneNumber.toLowerCase().includes(term) ||
            c.country.toLowerCase().includes(term) || c.state.toLowerCase().includes(term) ||
            c.city.toLowerCase().includes(term));
    }

    getPages(): number[] {
        const pages: number[] = []; const start = Math.max(1, this.currentPage - 2); const end = Math.min(this.totalPages, this.currentPage + 2);
        for (let i = start; i <= end; i++) pages.push(i); return pages;
    }

    downloadCsv() {
        const csv = ['Customer ID,Name,Country,State,City,Phone,Email,Address1',
            ...this.filteredCustomers.map(c => `${c.customerId},${c.name},${c.country},${c.state},${c.city},${c.phoneNumber},${c.email},"${c.address1}"`)
        ].join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'customers.csv';
        link.click();
    }
}
