import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OrderService } from '../../../services/order.service';
import { AuthService } from '../../../services/auth.service';
import { Order } from '../../../models/models';

@Component({
    selector: 'app-cancel-order',
    template: `
    <app-navbar></app-navbar>
    <div class="page-container">
      <h1 class="page-title">Cancel Order</h1>
      <p class="page-subtitle">Request cancellation for your confirmed orders</p>

      <div *ngIf="cancelledOrder" class="card" style="text-align:center;padding:40px">
        <div style="font-size:64px;margin-bottom:16px">✅</div>
        <h2 style="color:var(--success);margin-bottom:8px">Order Cancelled Successfully!</h2>
        <p style="color:var(--text-muted);margin-bottom:16px">The amount will refund to your account in 5 working days</p>
        <div style="background:var(--bg-surface);border-radius:12px;padding:20px;margin-bottom:20px;text-align:left">
          <div><span style="color:var(--text-muted)">Order ID:</span> <strong>{{cancelledOrder.orderId}}</strong></div>
          <div style="margin-top:8px"><span style="color:var(--text-muted)">Status:</span> <span class="badge badge-cancelled">Cancelled</span></div>
        </div>
        <button class="btn btn-primary" routerLink="/my-orders">My Orders</button>
      </div>

      <div *ngIf="!cancelledOrder" class="card" style="max-width:500px;margin:auto">
        <div *ngIf="errorMsg" class="alert alert-error">❌ {{errorMsg}}</div>
        <div *ngIf="!confirmingOrder">
          <div class="form-group">
            <label>Order ID *</label>
            <input type="text" class="form-control" [(ngModel)]="orderId" placeholder="Enter Order ID (e.g. ORD1234567890)">
          </div>
          <div class="form-group">
            <label>Reason for Cancellation *</label>
            <textarea class="form-control" [(ngModel)]="reason" rows="3" placeholder="Please specify why you want to cancel"></textarea>
          </div>
          <button class="btn btn-danger" style="width:100%;justify-content:center" (click)="findOrder()" [disabled]="loading">
            {{loading ? 'Searching...' : '🔍 Find & Cancel Order'}}
          </button>
        </div>

        <!-- Confirmation Modal -->
        <div *ngIf="confirmingOrder" style="text-align:center">
          <div style="font-size:48px;margin-bottom:16px">⚠️</div>
          <h3 style="margin-bottom:12px">Are you sure?</h3>
          <p style="color:var(--text-muted);margin-bottom:8px">Are you sure you want to cancel your order for</p>
          <p style="font-size:18px;font-weight:700;margin-bottom:8px">{{confirmingOrder.orderId}}?</p>
          <p style="color:var(--text-muted);font-size:13px;margin-bottom:24px">Status: {{confirmingOrder.orderStatus}}</p>
          <div style="display:flex;gap:12px;justify-content:center">
            <button class="btn btn-danger" (click)="confirmCancel()" [disabled]="loading">{{loading ? 'Cancelling...' : '✅ Yes, Cancel'}}</button>
            <button class="btn btn-secondary" (click)="confirmingOrder=null">No, Keep Order</button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class CancelOrderComponent {
    orderId = '';
    reason = '';
    errorMsg = '';
    loading = false;
    confirmingOrder: Order | null = null;
    cancelledOrder: Order | null = null;
    customerId = '';

    constructor(private orderService: OrderService, private authService: AuthService, private router: Router) {
        const customer = this.authService.getCustomer();
        if (customer) this.customerId = customer.customerId;
        const state = this.router.getCurrentNavigation()?.extras?.state as any;
        if (state?.order) { this.orderId = state.order.orderId; this.confirmingOrder = state.order; }
    }

    findOrder() {
        this.errorMsg = '';
        if (!this.orderId.trim()) { this.errorMsg = 'Order ID is required'; return; }
        if (!this.reason.trim()) { this.errorMsg = 'Cancellation reason is required'; return; }
        this.loading = true;
        this.orderService.getOrderById(this.orderId).subscribe({
            next: res => {
                this.loading = false;
                if (res.success && res.data) {
                    const order = res.data;
                    if (order.orderStatus === 'In Transit' || order.orderStatus === 'Delivered') {
                        this.errorMsg = `Cannot cancel order with status: ${order.orderStatus}`;
                    } else if (order.orderStatus === 'Cancelled') {
                        this.errorMsg = 'Order is already cancelled';
                    } else if (order.customerId !== this.customerId) {
                        this.errorMsg = 'This order does not belong to your account';
                    } else {
                        this.confirmingOrder = order;
                    }
                } else { this.errorMsg = 'Order not found'; }
            },
            error: () => { this.loading = false; this.errorMsg = 'Order not found'; }
        });
    }

    confirmCancel() {
        this.loading = true;
        this.orderService.cancelOrder(this.orderId, this.reason, this.customerId).subscribe({
            next: res => {
                this.loading = false;
                if (res.success) { this.cancelledOrder = res.data; this.confirmingOrder = null; }
                else { this.errorMsg = res.message; this.confirmingOrder = null; }
            },
            error: err => { this.loading = false; this.errorMsg = err?.error?.message || 'Cancellation failed'; }
        });
    }
}
