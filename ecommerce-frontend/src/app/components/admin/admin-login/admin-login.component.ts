import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from '../../../services/admin.service';
import { AuthService } from '../../../services/auth.service';

@Component({
    selector: 'app-admin-login',
    template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="text-center mb-24">
          <div style="font-size:48px;margin-bottom:8px">🛍️</div>
          <h1 class="auth-title">Admin Portal</h1>
          <p class="auth-subtitle">EShopX Administration</p>
        </div>
        <div *ngIf="successMsg" class="alert alert-success">✅ {{successMsg}}</div>
        <div *ngIf="errorMsg" class="alert alert-error">❌ {{errorMsg}}</div>
        <form (ngSubmit)="login()">
          <div class="form-group">
            <label>Admin User ID</label>
            <input type="text" class="form-control" [(ngModel)]="adminId" name="adminId" placeholder="ADMIN001" required>
          </div>
          <div class="form-group">
            <label>Password</label>
            <input type="password" class="form-control" [(ngModel)]="password" name="password" placeholder="Enter admin password" required>
          </div>
          <button type="submit" class="btn btn-primary" style="width:100%;justify-content:center" [disabled]="loading">
            {{loading ? 'Logging in...' : '🔑 Admin Login'}}
          </button>
        </form>
        <p class="text-center mt-16 text-sm text-muted">
          Customer? <a routerLink="/login" style="color:var(--primary-light);text-decoration:none">Login here</a>
        </p>
      </div>
    </div>
  `
})
export class AdminLoginComponent {
    adminId = '';
    password = '';
    errorMsg = '';
    successMsg = '';
    loading = false;

    constructor(private adminService: AdminService, private authService: AuthService, private router: Router) { }

    login() {
        this.errorMsg = '';
        if (!this.adminId.trim()) { this.errorMsg = 'User ID is required'; return; }
        if (!this.password.trim()) { this.errorMsg = 'Password is required'; return; }
        this.loading = true;
        this.adminService.login(this.adminId, this.password).subscribe({
            next: res => {
                this.loading = false;
                if (res.success) {
                    this.authService.setAdmin(res.data);
                    this.successMsg = res.message;
                    setTimeout(() => this.router.navigate(['/admin/home']), 1000);
                } else { this.errorMsg = res.message; }
            },
            error: err => { this.loading = false; this.errorMsg = err?.error?.message || 'Invalid User Id / Password'; }
        });
    }
}
