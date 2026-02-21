import { Component } from '@angular/core';
import { AdminService } from '../../../services/admin.service';
import { OrderService } from '../../../services/order.service';
import { Order } from '../../../models/models';

@Component({
    selector: 'app-admin-cancel-order',
    template: `
    <app-admin-navbar></app-admin-navbar>
    <div class="page-container">
      <h1 class="page-title">Order Status Management</h1>
      <p class="page-subtitle">Change order status or cancel orders</p>

      <div class="card" style="max-width:600px;margin:auto">
        <div *ngIf="errorMsg" class="alert alert-error">❌ {{errorMsg}}</div>
        <div *ngIf="successMsg" class="alert alert-success">✅ {{successMsg}}</div>

        <div *ngIf="!foundOrder">
          <div class="form-group">
            <label>Order ID *</label>
            <input type="text" class="form-control" [(ngModel)]="orderId" placeholder="Enter Order ID (e.g. ORD1234567890)">
          </div>
          <button class="btn btn-primary" style="width:100%;justify-content:center" (click)="findOrder()" [disabled]="loading">
            {{loading ? 'Searching...' : '🔍 Find Order'}}
          </button>
        </div>

        <div *ngIf="foundOrder && !updatedOrder">
          <div style="background:var(--bg-surface);border-radius:12px;padding:16px;margin-bottom:16px">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
              <div><span class="text-muted text-sm">Order ID</span><br><strong>{{foundOrder.orderId}}</strong></div>
              <div><span class="text-muted text-sm">Customer</span><br><strong>{{foundOrder.customerId}}</strong></div>
              <div><span class="text-muted text-sm">Current Status</span><br>
                <span class="badge" [ngClass]="getBadgeClass(foundOrder.orderStatus)">{{foundOrder.orderStatus}}</span>
              </div>
              <div><span class="text-muted text-sm">Total</span><br><strong>₹{{foundOrder.totalPrice}}</strong></div>
            </div>
          </div>

          <div class="form-group">
            <label>Change Status To</label>
            <select class="form-control" [(ngModel)]="newStatus">
              <option value="">-- Select Status --</option>
              <option *ngFor="let s of getAvailableStatuses()" [value]="s">{{s}}</option>
            </select>
          </div>

          <div class="form-group" *ngIf="newStatus === 'Cancelled'">
            <label>Cancellation Reason</label>
            <textarea class="form-control" [(ngModel)]="cancelReason" rows="2" placeholder="Enter cancellation reason..."></textarea>
          </div>

          <div style="display:flex;gap:12px;flex-wrap:wrap">
            <button class="btn btn-primary" style="flex:1;justify-content:center" (click)="updateStatus()" [disabled]="loading || !newStatus">
              {{loading ? 'Updating...' : '💾 Update Status'}}
            </button>
            <button class="btn btn-secondary" (click)="reset()">← Back</button>
          </div>
        </div>

        <div *ngIf="updatedOrder" style="text-align:center;padding:20px">
          <div style="font-size:48px;margin-bottom:12px">✅</div>
          <h3 style="color:var(--success);margin-bottom:12px">Status Updated Successfully!</h3>
          <p>Order <strong>{{updatedOrder.orderId}}</strong> is now <span class="badge" [ngClass]="getBadgeClass(updatedOrder.orderStatus)">{{updatedOrder.orderStatus}}</span></p>
          <button class="btn btn-primary mt-16" (click)="reset()">Update Another Order</button>
        </div>
      </div>
    </div>
  `
})
export class AdminCancelOrderComponent {
    orderId = '';
    newStatus = '';
    cancelReason = 'Cancelled by admin';
    foundOrder: Order | null = null;
    updatedOrder: Order | null = null;
    errorMsg = '';
    successMsg = '';
    loading = false;

    constructor(private adminService: AdminService, private orderService: OrderService) { }

    findOrder() {
        this.errorMsg = '';
        if (!this.orderId.trim()) { this.errorMsg = 'Order ID is required'; return; }
        this.loading = true;
        this.orderService.getOrderById(this.orderId).subscribe({
            next: res => { this.loading = false; if (res.success && res.data) this.foundOrder = res.data; else this.errorMsg = 'Order not found'; },
            error: () => { this.loading = false; this.errorMsg = 'Order not found'; }
        });
    }

    getAvailableStatuses(): string[] {
        const current = this.foundOrder?.orderStatus;
        const transitions: any = { 'Confirmed': ['In Transit', 'Cancelled'], 'In Transit': ['Delivered', 'Cancelled'], 'Delivered': [], 'Cancelled': [] };
        return transitions[current || ''] || [];
    }

    updateStatus() {
        this.loading = true;
        if (this.newStatus === 'Cancelled') {
            this.adminService.cancelOrder(this.orderId).subscribe({
                next: res => { this.loading = false; if (res.success) { this.updatedOrder = { ...this.foundOrder!, orderStatus: 'Cancelled' }; } else this.errorMsg = res.message; },
                error: err => { this.loading = false; this.errorMsg = err?.error?.message || 'Failed to cancel order'; }
            });
        } else {
            this.adminService.changeOrderStatus(this.orderId, this.newStatus).subscribe({
                next: res => { this.loading = false; if (res.success) { this.updatedOrder = { ...this.foundOrder!, orderStatus: this.newStatus }; } else this.errorMsg = res.message; },
                error: err => { this.loading = false; this.errorMsg = err?.error?.message || 'Failed to update status'; }
            });
        }
    }

    getBadgeClass(status: string): string {
        const map: any = { 'Confirmed': 'badge-confirmed', 'Delivered': 'badge-delivered', 'In Transit': 'badge-transit', 'Cancelled': 'badge-cancelled' };
        return 'badge ' + (map[status] || '');
    }

    reset() { this.orderId = ''; this.newStatus = ''; this.foundOrder = null; this.updatedOrder = null; this.errorMsg = ''; this.successMsg = ''; }
}
