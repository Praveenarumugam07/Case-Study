import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../services/admin.service';
import { Order } from '../../../models/models';

@Component({
    selector: 'app-admin-orders',
    template: `
    <app-admin-navbar></app-admin-navbar>
    <div class="page-container">
      <h1 class="page-title">View All Orders</h1>
      <p class="page-subtitle">Manage and track all customer orders</p>

      <div style="display:flex;gap:12px;margin-bottom:24px;flex-wrap:wrap;align-items:center">
        <select class="form-control" style="width:200px" [(ngModel)]="statusFilter" (change)="applyFilter()">
          <option value="">All Orders</option>
          <option value="Confirmed">Confirmed</option>
          <option value="In Transit">In Transit</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
        <button class="btn btn-secondary btn-sm" (click)="statusFilter='';applyFilter()">Clear</button>
      </div>

      <div *ngIf="successMsg" class="alert alert-success">✅ {{successMsg}}</div>
      <div *ngIf="errorMsg" class="alert alert-error">❌ {{errorMsg}}</div>
      <div *ngIf="loading" class="flex-center" style="padding:40px"><div class="spinner"></div></div>

      <div *ngFor="let order of filteredOrders" class="card" style="margin-bottom:16px">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:12px;margin-bottom:16px">
          <div>
            <h3 style="margin-bottom:4px">Order #{{order.orderId}}</h3>
            <div style="color:var(--text-muted);font-size:13px">Customer: {{order.customerId}} | Date: {{order.orderDate | date:'MMM d, yyyy'}}</div>
            <div style="color:var(--text-muted);font-size:13px" *ngIf="order.shippingAddress">Address: {{order.shippingAddress}}</div>
          </div>
          <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap">
            <span class="badge" [ngClass]="getBadgeClass(order.orderStatus)">{{order.orderStatus}}</span>
            <span style="font-size:18px;font-weight:800;background:var(--gradient);-webkit-background-clip:text;-webkit-text-fill-color:transparent">
              ₹{{order.totalPrice | number:'1.2-2'}}
            </span>
          </div>
        </div>

        <table style="margin-bottom:12px">
          <thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Qty</th></tr></thead>
          <tbody>
            <tr *ngFor="let item of order.products">
              <td>{{item.productName}}</td><td>{{item.productCategory}}</td>
              <td>₹{{item.productPrice}}</td><td>{{item.quantity}}</td>
            </tr>
          </tbody>
        </table>

        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <ng-container *ngIf="order.orderStatus === 'Confirmed'">
            <button class="btn btn-success btn-sm" (click)="changeStatus(order, 'In Transit')">🚚 Mark In Transit</button>
            <button class="btn btn-danger btn-sm" (click)="cancelOrder(order)">❌ Cancel</button>
          </ng-container>
          <button *ngIf="order.orderStatus === 'In Transit'" class="btn btn-primary btn-sm" (click)="changeStatus(order, 'Delivered')">✅ Mark Delivered</button>
          <span *ngIf="order.orderStatus === 'Cancelled'" style="color:var(--text-muted);font-size:13px">Cancelled on {{order.cancelledDate | date:'MMM d, yyyy'}}</span>
        </div>
      </div>

      <div class="empty-state" *ngIf="!loading && filteredOrders.length === 0">
        <div class="empty-state-icon">📦</div>
        <div class="empty-state-text">No orders found</div>
      </div>
    </div>
  `
})
export class AdminOrdersComponent implements OnInit {
    orders: Order[] = [];
    filteredOrders: Order[] = [];
    statusFilter = '';
    successMsg = '';
    errorMsg = '';
    loading = true;

    constructor(private adminService: AdminService) { }

    ngOnInit() { this.loadOrders(); }

    loadOrders() {
        this.adminService.getAllOrders().subscribe({
            next: res => { this.loading = false; this.orders = res.data || []; this.filteredOrders = [...this.orders]; },
            error: () => { this.loading = false; }
        });
    }

    applyFilter() {
        this.filteredOrders = this.statusFilter ? this.orders.filter(o => o.orderStatus === this.statusFilter) : [...this.orders];
    }

    changeStatus(order: Order, newStatus: string) {
        this.successMsg = ''; this.errorMsg = '';
        this.adminService.changeOrderStatus(order.orderId, newStatus).subscribe({
            next: res => {
                if (res.success) { this.successMsg = `Order ${order.orderId} marked as ${newStatus}`; this.loadOrders(); setTimeout(() => this.successMsg = '', 3000); }
                else this.errorMsg = res.message;
            },
            error: err => { this.errorMsg = err?.error?.message || 'Failed to update status'; }
        });
    }

    cancelOrder(order: Order) {
        if (!confirm(`Are you sure you want to cancel the order for ${order.orderId}?`)) return;
        this.adminService.cancelOrder(order.orderId).subscribe({
            next: res => {
                if (res.success) { this.successMsg = `Order ${order.orderId} cancelled`; this.loadOrders(); setTimeout(() => this.successMsg = '', 3000); }
                else this.errorMsg = res.message;
            },
            error: err => { this.errorMsg = err?.error?.message || 'Failed to cancel order'; }
        });
    }

    getBadgeClass(status: string): string {
        const map: any = { 'Confirmed': 'badge-confirmed', 'Delivered': 'badge-delivered', 'In Transit': 'badge-transit', 'Cancelled': 'badge-cancelled' };
        return 'badge ' + (map[status] || '');
    }
}
