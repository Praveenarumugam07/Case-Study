import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerService } from '../../../services/customer.service';
import { AuthService } from '../../../services/auth.service';
import { Customer } from '../../../models/models';

@Component({
    selector: 'app-profile',
    template: `
    <app-navbar></app-navbar>
    <div class="page-container">
      <h1 class="page-title">My Profile</h1>
      <p class="page-subtitle">Manage your account details</p>

      <div *ngIf="successMsg" class="alert alert-success">✅ {{successMsg}}</div>
      <div *ngIf="errorMsg" class="alert alert-error">❌ {{errorMsg}}</div>

      <div class="card" style="max-width:600px;margin:auto" *ngIf="profile">
        <div style="display:flex;align-items:center;gap:16px;margin-bottom:32px">
          <div style="width:72px;height:72px;border-radius:50%;background:var(--gradient);display:flex;align-items:center;justify-content:center;font-size:32px">👤</div>
          <div>
            <h2>{{profile.name}}</h2>
            <div style="color:var(--text-muted);font-size:13px">{{profile.customerId}}</div>
          </div>
        </div>

        <form (ngSubmit)="updateProfile()">
          <div class="two-col-layout">
            <div class="form-group">
              <label>Full Name</label>
              <input type="text" class="form-control" [(ngModel)]="form.name" name="name" maxlength="50">
            </div>
            <div class="form-group">
              <label>Email</label>
              <input type="email" class="form-control" [(ngModel)]="form.email" name="email">
            </div>
            <div class="form-group">
              <label>Phone Number</label>
              <input type="text" class="form-control" [(ngModel)]="form.phoneNumber" name="phoneNumber">
            </div>
          </div>
          <div class="form-group">
            <label>Address 1</label>
            <textarea class="form-control" [(ngModel)]="form.address1" name="address1" rows="2"></textarea>
          </div>
          <div class="form-group">
            <label>Address 2 (Optional)</label>
            <textarea class="form-control" [(ngModel)]="form.address2" name="address2" rows="2"></textarea>
          </div>
          <div class="form-group">
            <label>New Password (leave blank to keep current)</label>
            <input type="password" class="form-control" [(ngModel)]="newPassword" name="newPassword" placeholder="Enter new password (min 10 chars)">
          </div>
          <div class="form-group" *ngIf="newPassword">
            <label>Confirm New Password</label>
            <input type="password" class="form-control" [(ngModel)]="confirmPassword" name="confirmPassword" placeholder="Re-enter new password">
          </div>
          <div style="display:flex;gap:12px;flex-wrap:wrap">
            <button type="submit" class="btn btn-primary" [disabled]="loading">💾 Save Changes</button>
            <button type="button" class="btn btn-danger" (click)="signout()">🚪 Sign Out</button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class ProfileComponent implements OnInit {
    profile: Customer | null = null;
    form: any = {};
    newPassword = '';
    confirmPassword = '';
    errorMsg = '';
    successMsg = '';
    loading = false;
    customerId = '';

    constructor(private customerService: CustomerService, private authService: AuthService, private router: Router) { }

    ngOnInit() {
        const customer = this.authService.getCustomer();
        if (customer) { this.customerId = customer.customerId; this.loadProfile(); }
    }

    loadProfile() {
        this.customerService.getProfile(this.customerId).subscribe({
            next: res => { this.profile = res.data || null; this.form = { ...this.profile }; delete this.form.password; }
        });
    }

    updateProfile() {
        this.errorMsg = ''; this.successMsg = '';
        if (this.form.phoneNumber?.startsWith('0')) { this.errorMsg = 'Please enter a valid phone number'; return; }
        if (this.newPassword) {
            if (this.newPassword.length < 10 || !/(?=.*[A-Z])(?=.*[0-9])/.test(this.newPassword)) {
                this.errorMsg = 'Your password must be at least 10 characters long, containing at least one number, one uppercase letter and one alphanumeric character'; return;
            }
            if (this.newPassword !== this.confirmPassword) { this.errorMsg = 'Passwords do not match'; return; }
            this.form.password = this.newPassword;
        }
        this.loading = true;
        this.customerService.updateProfile(this.customerId, this.form).subscribe({
            next: res => {
                this.loading = false;
                if (res.success) { this.successMsg = 'Details updated successfully'; this.newPassword = ''; this.confirmPassword = ''; }
                else { this.errorMsg = res.message; }
            },
            error: err => { this.loading = false; this.errorMsg = err?.error?.message || 'Update failed. Please try again.'; }
        });
    }

    signout() {
        this.authService.logoutCustomer();
        alert('You have been signed out.');
        this.router.navigate(['/login']);
    }
}
