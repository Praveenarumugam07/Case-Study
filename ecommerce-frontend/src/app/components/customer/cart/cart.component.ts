import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../../services/cart.service';
import { AuthService } from '../../../services/auth.service';
import { CartItem } from '../../../models/models';

@Component({
    selector: 'app-cart',
    template: `
    <app-navbar></app-navbar>
    <div class="page-container">
      <h1 class="page-title">My Cart</h1>
      <p class="page-subtitle">Review your selected items before checkout</p>

      <div *ngIf="successMsg" class="alert alert-success">✅ {{successMsg}}</div>
      <div *ngIf="errorMsg" class="alert alert-error">❌ {{errorMsg}}</div>

      <div *ngIf="cartItems.length === 0 && !loading" class="empty-state">
        <div class="empty-state-icon">🛒</div>
        <div class="empty-state-text">Your cart is empty</div>
        <div class="empty-state-subtext">Add some products from the home page!</div>
        <button class="btn btn-primary mt-16" (click)="goHome()">Browse Products</button>
      </div>

      <div *ngIf="cartItems.length > 0">
        <div class="card" style="margin-bottom:16px" *ngFor="let item of cartItems">
          <div style="display:flex;align-items:center;gap:16px;flex-wrap:wrap">
            <div style="font-size:32px">🛍️</div>
            <div style="flex:1">
              <h3 style="margin-bottom:4px">{{item.productName}}</h3>
              <div style="color:var(--text-muted);font-size:13px">Product ID: #{{item.productId}}</div>
              <div class="product-price" style="font-size:18px;margin-top:4px">₹{{item.productPrice | number:'1.2-2'}}</div>
            </div>
            <div style="display:flex;align-items:center;gap:8px">
              <span style="font-size:13px;color:var(--text-muted)">Qty:</span>
              <input type="number" class="form-control" style="width:80px;text-align:center" [value]="item.quantity" #qtyInput min="1" max="100" (change)="prepareUpdate(item, +qtyInput.value)">
            </div>
            <div style="display:flex;gap:8px;flex-wrap:wrap">
              <button class="btn btn-success btn-sm" (click)="updateItem(item, getUpdatedQty(item.cartItemId))">✏️ Update</button>
              <button class="btn btn-warning btn-sm" (click)="decreaseQty(item)">➖ Delete</button>
              <button class="btn btn-danger btn-sm" (click)="removeItem(item)">🗑️ Remove</button>
            </div>
          </div>
        </div>

        <div class="card" style="background:var(--bg-surface)">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:16px">
            <div>
              <h3 style="font-size:20px;margin-bottom:4px">Cart Summary</h3>
              <div style="font-size:28px;font-weight:800;background:var(--gradient);-webkit-background-clip:text;-webkit-text-fill-color:transparent">
                Total: ₹{{getTotalPrice() | number:'1.2-2'}}
              </div>
              <div style="font-size:13px;color:var(--text-muted)">{{cartItems.length}} item(s) in cart</div>
            </div>
            <button class="btn btn-primary" style="font-size:16px;padding:14px 32px" (click)="checkout()">
              💳 Checkout / Proceed to Buy
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class CartComponent implements OnInit {
    cartItems: CartItem[] = [];
    customerId = '';
    errorMsg = '';
    successMsg = '';
    loading = true;
    updatedQtyMap: Map<number, number> = new Map();

    constructor(private cartService: CartService, private authService: AuthService, private router: Router) { }

    ngOnInit() {
        const customer = this.authService.getCustomer();
        if (customer) { this.customerId = customer.customerId; this.loadCart(); }
    }

    loadCart() {
        this.cartService.getCart(this.customerId).subscribe({
            next: res => { this.loading = false; this.cartItems = res.data || []; },
            error: () => { this.loading = false; }
        });
    }

    prepareUpdate(item: CartItem, qty: number) {
        this.updatedQtyMap.set(item.cartItemId!, qty);
    }

    getUpdatedQty(cartItemId?: number): number {
        return this.updatedQtyMap.get(cartItemId!) || 1;
    }

    updateItem(item: CartItem, newQty: number) {
        this.errorMsg = ''; this.successMsg = '';
        this.cartService.updateQuantity(this.customerId, item.cartItemId!, newQty).subscribe({
            next: res => {
                if (res.success) { this.successMsg = 'Cart updated!'; this.loadCart(); setTimeout(() => this.successMsg = '', 3000); }
                else { this.errorMsg = res.message; }
            },
            error: err => { this.errorMsg = err?.error?.message || 'Product limit exceeded'; }
        });
    }

    decreaseQty(item: CartItem) {
        if (item.quantity <= 1) { this.errorMsg = 'Unable to delete product any further: Minimum quantity reached'; return; }
        this.updateItem(item, item.quantity - 1);
    }

    removeItem(item: CartItem) {
        this.errorMsg = ''; this.successMsg = '';
        this.cartService.removeItem(this.customerId, item.cartItemId!).subscribe({
            next: res => {
                if (res.success) { this.successMsg = 'Item removed from cart'; this.loadCart(); setTimeout(() => this.successMsg = '', 3000); }
                else { this.errorMsg = 'Unable to remove product any further: Minimum quantity reached.'; }
            },
            error: () => { this.errorMsg = 'Unable to remove product any further: Minimum quantity reached.'; }
        });
    }

    getTotalPrice(): number {
        return this.cartItems.reduce((sum, item) => sum + (item.productPrice * item.quantity), 0);
    }

    checkout() {
        if (this.cartItems.length === 0) { this.errorMsg = 'Cart is empty, please add products to check out'; return; }
        this.router.navigate(['/payment'], { state: { cartItems: this.cartItems, totalPrice: this.getTotalPrice() } });
    }

    goHome() { this.router.navigate(['/home']); }
}
