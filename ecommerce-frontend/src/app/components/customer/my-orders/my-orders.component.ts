import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OrderService } from '../../../services/order.service';
import { AuthService } from '../../../services/auth.service';
import { Order } from '../../../models/models';

@Component({
    selector: 'app-my-orders',
    template: `
    <app-navbar></app-navbar>
    <div class="page-container">
      <h1 class="page-title">My Orders</h1>
      <p class="page-subtitle">Track all your orders</p>

      <div style="display:flex;gap:12px;margin-bottom:24px;flex-wrap:wrap;align-items:center">
        <select class="form-control" style="width:200px" [(ngModel)]="statusFilter" (change)="applyFilter()">
          <option value="">All Orders</option>
          <option value="Confirmed">Confirmed</option>
          <option value="In Transit">In Transit</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
        <button class="btn btn-secondary btn-sm" (click)="statusFilter='';applyFilter()">Clear Filter</button>
      </div>

      <div *ngIf="loading" class="flex-center" style="padding:60px"><div class="spinner"></div></div>

      <div *ngIf="!loading && filteredOrders.length === 0" class="empty-state">
        <div class="empty-state-icon">📦</div>
        <div class="empty-state-text">No orders found</div>
        <div class="empty-state-subtext">Start shopping to see your orders here!</div>
        <button class="btn btn-primary mt-16" routerLink="/home">Shop Now</button>
      </div>

      <div *ngFor="let order of filteredOrders" class="card" style="margin-bottom:16px">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:12px;margin-bottom:16px">
          <div>
            <h3 style="margin-bottom:4px">Order #{{order.orderId}}</h3>
            <div style="color:var(--text-muted);font-size:13px">{{order.orderDate | date:'MMM d, yyyy h:mm a'}}</div>
          </div>
          <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap">
            <span class="badge" [ngClass]="getBadgeClass(order.orderStatus)">{{order.orderStatus}}</span>
            <span style="font-size:20px;font-weight:800;background:var(--gradient);-webkit-background-clip:text;-webkit-text-fill-color:transparent">
              ₹{{order.totalPrice | number:'1.2-2'}}
            </span>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Product ID</th><th>Product Name</th><th>Category</th><th>Price</th><th>Qty</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let item of order.products">
              <td>#{{item.productId}}</td>
              <td>{{item.productName}}</td>
              <td>{{item.productCategory}}</td>
              <td>₹{{item.productPrice | number:'1.2-2'}}</td>
              <td>{{item.quantity}}</td>
            </tr>
          </tbody>
        </table>

        <div style="display:flex;gap:8px;margin-top:12px;flex-wrap:wrap">
          <button *ngIf="order.orderStatus === 'Confirmed'" class="btn btn-danger btn-sm"
            (click)="cancelOrder(order)">❌ Cancel Order</button>
          <button *ngIf="order.orderStatus === 'Delivered'" class="btn btn-primary btn-sm"
            (click)="addFeedback(order)">💬 Add Feedback</button>
        </div>
      </div>
    </div>
  `
})
export class MyOrdersComponent implements OnInit {
    orders: Order[] = [];
    filteredOrders: Order[] = [];
    statusFilter = '';
    loading = true;
    customerId = '';

    constructor(private orderService: OrderService, private authService: AuthService, private router: Router) { }

    ngOnInit() {
        const customer = this.authService.getCustomer();
        if (customer) { this.customerId = customer.customerId; this.loadOrders(); }
    }

    loadOrders() {
        this.orderService.getCustomerOrders(this.customerId).subscribe({
            next: res => { this.loading = false; this.orders = res.data || []; this.filteredOrders = [...this.orders]; },
            error: () => { this.loading = false; }
        });
    }

    applyFilter() {
        this.filteredOrders = this.statusFilter ? this.orders.filter(o => o.orderStatus === this.statusFilter) : [...this.orders];
    }

    getBadgeClass(status: string): string {
        const map: any = { 'Confirmed': 'badge-confirmed', 'Delivered': 'badge-delivered', 'In Transit': 'badge-transit', 'Cancelled': 'badge-cancelled' };
        return 'badge ' + (map[status] || '');
    }

    cancelOrder(order: Order) { this.router.navigate(['/cancel-order'], { state: { order } }); }
    addFeedback(order: Order) { this.router.navigate(['/add-feedback', order.orderId]); }
}
