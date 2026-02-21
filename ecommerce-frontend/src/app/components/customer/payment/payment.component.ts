import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PaymentService } from '../../../services/payment.service';
import { AuthService } from '../../../services/auth.service';
import { CartItem, Invoice } from '../../../models/models';

@Component({
    selector: 'app-payment',
    template: `
    <app-navbar></app-navbar>
    <div class="page-container">
      <h1 class="page-title">Payment</h1>
      <p class="page-subtitle">Complete your purchase securely</p>

      <!-- Success Screen -->
      <div *ngIf="paymentSuccess" class="card" style="text-align:center;padding:40px">
        <div style="font-size:72px;margin-bottom:16px">🎉</div>
        <h2 style="color:var(--success);font-size:28px;margin-bottom:8px">Payment Successful!</h2>
        <p style="color:var(--text-secondary);margin-bottom:24px">Your order has been placed successfully</p>
        <div style="background:var(--bg-surface);border-radius:12px;padding:24px;margin-bottom:24px;text-align:left">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
            <div><span style="color:var(--text-muted);font-size:13px">Transaction ID</span><br><strong>{{invoice?.transactionId}}</strong></div>
            <div><span style="color:var(--text-muted);font-size:13px">Order ID</span><br><strong>{{invoice?.orderId}}</strong></div>
            <div><span style="color:var(--text-muted);font-size:13px">Amount Paid</span><br><strong class="text-gradient">₹{{invoice?.totalAmount | number:'1.2-2'}}</strong></div>
            <div><span style="color:var(--text-muted);font-size:13px">Payment Mode</span><br><strong>{{invoice?.paymentMode}}</strong></div>
          </div>
        </div>
        <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
          <button class="btn btn-primary" (click)="downloadInvoice()">📥 Download Invoice</button>
          <button class="btn btn-secondary" (click)="goToOrders()">📦 My Orders</button>
          <button class="btn btn-secondary" (click)="goToCart()">← Back to Cart</button>
        </div>
      </div>

      <!-- Payment Form -->
      <div *ngIf="!paymentSuccess">
        <div class="two-col-layout">
          <!-- Order Summary -->
          <div class="card">
            <h3 style="margin-bottom:16px">Order Summary</h3>
            <div *ngFor="let item of cartItems" style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border)">
              <span>{{item.productName}} x{{item.quantity}}</span>
              <span>₹{{(item.productPrice * item.quantity) | number:'1.2-2'}}</span>
            </div>
            <div style="display:flex;justify-content:space-between;padding-top:16px;font-size:20px;font-weight:800">
              <span>Total</span>
              <span class="text-gradient">₹{{totalPrice | number:'1.2-2'}}</span>
            </div>
          </div>

          <!-- Payment Options -->
          <div class="card">
            <h3 style="margin-bottom:16px">Mode of Payment</h3>
            <div *ngIf="errorMsg" class="alert alert-error">❌ {{errorMsg}}</div>

            <div style="display:flex;gap:16px;margin-bottom:24px">
              <label style="display:flex;align-items:center;gap:8px;cursor:pointer;padding:12px 20px;border:2px solid var(--border);border-radius:8px;flex:1;transition:all 0.3s"
                [style.border-color]="paymentMode === 'Credit Card' ? 'var(--primary)' : 'var(--border)'"
                [style.background]="paymentMode === 'Credit Card' ? 'rgba(108,99,255,0.1)' : ''">
                <input type="radio" [(ngModel)]="paymentMode" value="Credit Card" name="payMode">
                💳 Credit Card
              </label>
              <label style="display:flex;align-items:center;gap:8px;cursor:pointer;padding:12px 20px;border:2px solid var(--border);border-radius:8px;flex:1;transition:all 0.3s"
                [style.border-color]="paymentMode === 'UPI' ? 'var(--primary)' : 'var(--border)'"
                [style.background]="paymentMode === 'UPI' ? 'rgba(108,99,255,0.1)' : ''">
                <input type="radio" [(ngModel)]="paymentMode" value="UPI" name="payMode">
                📱 UPI
              </label>
            </div>

            <!-- Credit Card Fields -->
            <div *ngIf="paymentMode === 'Credit Card'">
              <div class="form-group">
                <label>Card Number (min 16 digits)</label>
                <input type="text" class="form-control" [(ngModel)]="cardNumber" maxlength="19" placeholder="1234 5678 9012 3456">
              </div>
              <div class="form-group">
                <label>Card Holder Name (min 10 chars)</label>
                <input type="text" class="form-control" [(ngModel)]="cardHolderName" placeholder="Enter full name as on card">
              </div>
              <div class="two-col-layout" style="gap:12px">
                <div class="form-group">
                  <label>Expiry Date (MM/YY)</label>
                  <input type="text" class="form-control" [(ngModel)]="expiryDate" placeholder="MM/YY" maxlength="5">
                </div>
                <div class="form-group">
                  <label>CVV (4 digits)</label>
                  <input type="password" class="form-control" [(ngModel)]="cvvCode" maxlength="4" placeholder="****">
                </div>
              </div>
            </div>

            <!-- UPI Fields -->
            <div *ngIf="paymentMode === 'UPI'">
              <div class="form-group">
                <label>UPI ID</label>
                <input type="text" class="form-control" [(ngModel)]="upiId" placeholder="yourname@upi">
              </div>
            </div>

            <div style="display:flex;gap:12px;flex-wrap:wrap">
              <button class="btn btn-primary" style="flex:1;justify-content:center" (click)="makePayment()" [disabled]="loading">
                {{loading ? 'Processing...' : '💳 Make Payment'}}
              </button>
              <button class="btn btn-secondary" (click)="goToCart()">← Back</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class PaymentComponent implements OnInit {
    cartItems: CartItem[] = [];
    totalPrice = 0;
    customerId = '';
    paymentMode = 'Credit Card';
    cardNumber = '';
    cardHolderName = '';
    expiryDate = '';
    cvvCode = '';
    upiId = '';
    errorMsg = '';
    loading = false;
    paymentSuccess = false;
    invoice: Invoice | null = null;

    constructor(private paymentService: PaymentService, private authService: AuthService, private router: Router) {
        const state = this.router.getCurrentNavigation()?.extras?.state as any;
        if (state) { this.cartItems = state.cartItems || []; this.totalPrice = state.totalPrice || 0; }
    }

    ngOnInit() {
        const customer = this.authService.getCustomer();
        if (customer) this.customerId = customer.customerId;
        if (this.cartItems.length === 0) this.router.navigate(['/cart']);
    }

    makePayment() {
        this.errorMsg = '';
        const request: any = { customerId: this.customerId, paymentMode: this.paymentMode, totalAmount: this.totalPrice, cartItems: this.cartItems };
        if (this.paymentMode === 'Credit Card') {
            request.cardNumber = this.cardNumber.replace(/\s/g, '');
            request.cardHolderName = this.cardHolderName;
            request.expiryDate = this.expiryDate;
            request.cvvCode = this.cvvCode;
        } else { request.upiId = this.upiId; }
        this.loading = true;
        this.paymentService.processPayment(request).subscribe({
            next: res => {
                this.loading = false;
                if (res.success) {
                    this.paymentSuccess = true;
                    this.paymentService.getInvoice(res.data.orderId).subscribe(inv => { this.invoice = inv.data || null; });
                } else { this.errorMsg = res.message; }
            },
            error: err => { this.loading = false; this.errorMsg = err?.error?.message || 'Payment failed. Please try again.'; }
        });
    }

    downloadInvoice() {
        if (!this.invoice) return;
        const content = `ESHOPX INVOICE\n\nTransaction ID: ${this.invoice.transactionId}\nOrder ID: ${this.invoice.orderId}\nCustomer ID: ${this.invoice.customerId}\nTotal Amount: ₹${this.invoice.totalAmount}\nPayment Mode: ${this.invoice.paymentMode}\nTimestamp: ${this.invoice.paymentTimestamp}`;
        const blob = new Blob([content], { type: 'text/plain' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `Invoice_${this.invoice.orderId}.txt`;
        link.click();
    }

    goToOrders() { this.router.navigate(['/my-orders']); }
    goToCart() { this.router.navigate(['/cart']); }
}
