import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerService } from '../../../services/customer.service';

@Component({
    selector: 'app-register',
    template: `
    <div class="auth-container" style="align-items:flex-start;padding:40px 0;overflow-y:auto;min-height:100vh;">
      <div class="auth-card" style="max-width:600px;margin:auto">
        <div class="text-center mb-24">
          <div style="font-size:48px;margin-bottom:8px">🎉</div>
          <h1 class="auth-title">Create Account</h1>
          <p class="auth-subtitle">Join EShopX and start shopping!</p>
        </div>

        <div *ngIf="successData" class="alert alert-success">
          ✅ {{successMsg}}<br>
          <strong>Customer ID:</strong> {{successData.customerId}}<br>
          <strong>Name:</strong> {{successData.name}}<br>
          <strong>Email:</strong> {{successData.email}}<br>
          <br><small>Redirecting to login...</small>
        </div>
        <div *ngIf="errorMsg" class="alert alert-error">❌ {{errorMsg}}</div>

        <form (ngSubmit)="register()" *ngIf="!successData">
          <div class="two-col-layout">
            <div class="form-group">
              <label>Full Name *</label>
              <input type="text" class="form-control" [(ngModel)]="form.name" name="name" maxlength="50" placeholder="Enter your full name">
            </div>
            <div class="form-group">
              <label>Email *</label>
              <input type="email" class="form-control" [(ngModel)]="form.email" name="email" placeholder="example@email.com">
            </div>
            <div class="form-group">
              <label>Country *</label>
              <select class="form-control" [(ngModel)]="form.country" name="country" (change)="onCountryChange()">
                <option value="">Select Country</option>
                <option *ngFor="let c of countries" [value]="c">{{c}}</option>
              </select>
            </div>
            <div class="form-group">
              <label>State *</label>
              <select class="form-control" [(ngModel)]="form.state" name="state" (change)="onStateChange()">
                <option value="">Select State</option>
                <option *ngFor="let s of states" [value]="s">{{s}}</option>
              </select>
            </div>
            <div class="form-group">
              <label>City *</label>
              <input type="text" class="form-control" [(ngModel)]="form.city" name="city" placeholder="Enter city">
            </div>
            <div class="form-group">
              <label>Zip Code *</label>
              <select class="form-control" [(ngModel)]="form.zipCode" name="zipCode">
                <option value="">Select Zip Code</option>
                <option *ngFor="let z of zipCodes" [value]="z">{{z}}</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label>Address 1 *</label>
            <textarea class="form-control" [(ngModel)]="form.address1" name="address1" placeholder="Enter your primary address" rows="2"></textarea>
          </div>
          <div class="form-group">
            <label>Address 2 (Optional)</label>
            <textarea class="form-control" [(ngModel)]="form.address2" name="address2" placeholder="Apartment, suite, etc." rows="2"></textarea>
          </div>

          <div class="two-col-layout">
            <div class="form-group">
              <label>Phone Number *</label>
              <input type="text" class="form-control" [(ngModel)]="form.phoneNumber" name="phoneNumber" placeholder="+91 9876543210">
            </div>
            <div class="form-group">
              <label>Password *</label>
              <input type="password" class="form-control" [(ngModel)]="form.password" name="password" placeholder="Min 10 chars, 1 uppercase, 1 number">
            </div>
            <div class="form-group">
              <label>Confirm Password *</label>
              <input type="password" class="form-control" [(ngModel)]="confirmPassword" name="confirmPassword" placeholder="Re-enter password">
            </div>
          </div>

          <button type="submit" class="btn btn-primary" style="width:100%;justify-content:center" [disabled]="loading">
            {{loading ? 'Registering...' : '🚀 Create Account'}}
          </button>
        </form>

        <p class="text-center mt-16" style="font-size:14px;color:var(--text-muted)" *ngIf="!successData">
          Already have an account?
          <a routerLink="/login" style="color:var(--primary-light);font-weight:600;text-decoration:none"> Login here</a>
        </p>
      </div>
    </div>
  `
})
export class RegisterComponent {
    form: any = { name: '', country: '', state: '', city: '', address1: '', address2: '', zipCode: '', phoneNumber: '', email: '', password: '' };
    confirmPassword = '';
    errorMsg = '';
    successMsg = '';
    successData: any = null;
    loading = false;

    countries = ['India', 'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'France'];
    states: string[] = [];
    zipCodes: string[] = [];

    stateMap: any = {
        'India': ['Tamil Nadu', 'Maharashtra', 'Karnataka', 'Delhi', 'Gujarat', 'Rajasthan', 'Uttar Pradesh', 'West Bengal'],
        'United States': ['California', 'New York', 'Texas', 'Florida', 'Illinois', 'Washington'],
        'United Kingdom': ['England', 'Scotland', 'Wales', 'Northern Ireland'],
        'Canada': ['Ontario', 'Quebec', 'British Columbia', 'Alberta'],
        'Australia': ['New South Wales', 'Victoria', 'Queensland', 'Western Australia'],
        'Germany': ['Bavaria', 'Baden-Württemberg', 'North Rhine-Westphalia'],
        'France': ['Île-de-France', 'Provence-Alpes-Côte d\'Azur', 'Normandy']
    };

    zipMap: any = {
        'Tamil Nadu': ['600001', '600002', '600010', '630001', '641001'],
        'Maharashtra': ['400001', '400002', '411001', '421001'],
        'Karnataka': ['560001', '560002', '570001', '575001'],
        'Delhi': ['110001', '110002', '110003', '110010'],
        'California': ['90001', '90210', '94105', '95014'],
        'New York': ['10001', '10002', '10036', '11201'],
        'England': ['EC1A 1BB', 'SW1A 1AA', 'WC2N 5DU'],
        'Ontario': ['M5V 3A8', 'K1A 0A9', 'L4B 1A5'],
    };

    constructor(private customerService: CustomerService, private router: Router) { }

    onCountryChange() {
        this.form.state = '';
        this.form.zipCode = '';
        this.states = this.stateMap[this.form.country] || [];
        this.zipCodes = [];
    }

    onStateChange() {
        this.form.zipCode = '';
        this.zipCodes = this.zipMap[this.form.state] || ['110000', '200000', '300000', '400000', '500000'];
    }

    register() {
        this.errorMsg = '';
        if (!this.form.name) { this.errorMsg = 'Name is required'; return; }
        if (!this.form.country) { this.errorMsg = 'Country is required'; return; }
        if (!this.form.state) { this.errorMsg = 'State is required'; return; }
        if (!this.form.city) { this.errorMsg = 'City is required'; return; }
        if (!this.form.address1) { this.errorMsg = 'Address1 is required'; return; }
        if (!this.form.zipCode) { this.errorMsg = 'Zip Code is required'; return; }
        if (!this.form.phoneNumber) { this.errorMsg = 'Phone Number is required'; return; }
        if (this.form.phoneNumber.startsWith('0')) { this.errorMsg = 'Phone Number should not start with 0'; return; }
        if (!this.form.email) { this.errorMsg = 'Email is required'; return; }
        if (!this.form.password) { this.errorMsg = 'Password is required'; return; }
        if (this.form.password.length < 10) { this.errorMsg = 'Your password must be at least 10 characters long, containing at least one number, one uppercase letter and one alphanumeric character'; return; }
        if (!/(?=.*[A-Z])(?=.*[0-9])/.test(this.form.password)) { this.errorMsg = 'Your password must be at least 10 characters long, containing at least one number, one uppercase letter and one alphanumeric character'; return; }
        if (this.form.password !== this.confirmPassword) { this.errorMsg = 'Passwords do not match'; return; }

        this.loading = true;
        this.customerService.register(this.form).subscribe({
            next: res => {
                this.loading = false;
                if (res.success) {
                    this.successMsg = res.message;
                    this.successData = res.data;
                    setTimeout(() => this.router.navigate(['/login']), 4000);
                } else {
                    this.errorMsg = res.message;
                }
            },
            error: err => {
                this.loading = false;
                this.errorMsg = err?.error?.message || 'Registration failed. Please try again.';
            }
        });
    }
}
