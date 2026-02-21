import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerService } from '../../../services/customer.service';
import { AuthService } from '../../../services/auth.service';
import { Customer } from '../../../models/models';

@Component({
    selector: 'app-customer-login',
    template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="text-center mb-24">
          <div style="font-size:48px;margin-bottom:8px">🛒</div>
          <h1 class="auth-title">Welcome Back!</h1>
          <p class="auth-subtitle">Login to your EShopX account</p>
        </div>

        <div *ngIf="successMsg" class="alert alert-success">✅ {{successMsg}}</div>
        <div *ngIf="errorMsg" class="alert alert-error">❌ {{errorMsg}}</div>

        <form (ngSubmit)="login()" #loginForm="ngForm">
          <div class="form-group">
            <label>Customer ID</label>
            <input type="text" class="form-control" [(ngModel)]="customerId" name="customerId"
              placeholder="Enter your Customer ID (e.g. CUST0001)" required>
          </div>
          <div class="form-group">
            <label>Password</label>
            <input type="password" class="form-control" [(ngModel)]="password" name="password"
              placeholder="Enter your password" required>
          </div>
          <button type="submit" class="btn btn-primary" style="width:100%;justify-content:center" [disabled]="loading">
            {{loading ? 'Logging in...' : '🔑 Login'}}
          </button>
        </form>

        <p class="text-center mt-16" style="font-size:14px;color:var(--text-muted)">
          Don't have an account?
          <a routerLink="/register" style="color:var(--primary-light);font-weight:600;text-decoration:none"> Register here</a>
        </p>
        <p class="text-center mt-8" style="font-size:13px;color:var(--text-muted)">
          Are you an admin?
          <a routerLink="/admin/login" style="color:var(--text-secondary);text-decoration:none"> Click here</a>
        </p>
      </div>
    </div>
  `
})
export class CustomerLoginComponent {
    customerId = '';
    password = '';
    errorMsg = '';
    successMsg = '';
    loading = false;

    constructor(private customerService: CustomerService, private authService: AuthService, private router: Router) { }

    login() {
        this.errorMsg = '';
        if (!this.customerId.trim()) { this.errorMsg = 'Customer ID is required'; return; }
        if (!this.password.trim()) { this.errorMsg = 'Password is required'; return; }
        this.loading = true;
        this.customerService.login(this.customerId, this.password).subscribe({
            next: res => {
                this.loading = false;
                if (res.success) {
                    this.authService.setCustomer(res.data);
                    this.successMsg = res.message;
                    setTimeout(() => this.router.navigate(['/home']), 1000);
                } else {
                    this.errorMsg = res.message;
                }
            },
            error: err => {
                this.loading = false;
                this.errorMsg = err?.error?.message || 'Invalid Customer Id / Password';
            }
        });
    }
}
