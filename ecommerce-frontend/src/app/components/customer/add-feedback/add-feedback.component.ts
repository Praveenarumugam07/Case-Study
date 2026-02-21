import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FeedbackService } from '../../../services/feedback.service';
import { AuthService } from '../../../services/auth.service';

@Component({
    selector: 'app-add-feedback',
    template: `
    <app-navbar></app-navbar>
    <div class="page-container">
      <h1 class="page-title">Add Feedback</h1>
      <p class="page-subtitle">Share your experience with this order</p>

      <div class="card" style="max-width:500px;margin:auto" *ngIf="!submitted">
        <div style="margin-bottom:24px;padding:16px;background:var(--bg-surface);border-radius:12px">
          <div style="color:var(--text-muted);font-size:13px;margin-bottom:4px">Order ID</div>
          <div style="font-weight:700;font-size:16px">{{orderId}}</div>
        </div>

        <div *ngIf="errorMsg" class="alert alert-error">❌ {{errorMsg}}</div>

        <div class="form-group">
          <label>Rating *</label>
          <div class="stars">
            <span *ngFor="let s of [1,2,3,4,5]" class="star" [class.filled]="s <= rating" (click)="rating = s">★</span>
          </div>
          <div style="font-size:13px;color:var(--text-muted);margin-top:4px">{{getRatingLabel()}}</div>
        </div>

        <div class="form-group">
          <label>Feedback Description *</label>
          <textarea class="form-control" [(ngModel)]="description" rows="4" placeholder="Tell us about your experience..."></textarea>
        </div>

        <div style="display:flex;gap:12px">
          <button class="btn btn-primary" style="flex:1;justify-content:center" (click)="submit()" [disabled]="loading">
            {{loading ? 'Submitting...' : '💬 Submit Feedback'}}
          </button>
          <button class="btn btn-secondary" routerLink="/my-orders">Cancel</button>
        </div>
      </div>

      <div class="card" style="max-width:500px;margin:auto;text-align:center;padding:40px" *ngIf="submitted">
        <div style="font-size:64px;margin-bottom:16px">🙏</div>
        <h2 style="color:var(--success);margin-bottom:8px">Thank You!</h2>
        <p style="color:var(--text-muted);margin-bottom:24px">Your feedback has been submitted successfully</p>
        <div style="font-size:28px;margin-bottom:16px">{{'★'.repeat(rating)}}</div>
        <button class="btn btn-primary" routerLink="/my-orders">Back to My Orders</button>
      </div>
    </div>
  `
})
export class AddFeedbackComponent implements OnInit {
    orderId = '';
    rating = 0;
    description = '';
    errorMsg = '';
    loading = false;
    submitted = false;
    customerId = '';

    constructor(private route: ActivatedRoute, private feedbackService: FeedbackService,
        private authService: AuthService, private router: Router) { }

    ngOnInit() {
        this.orderId = this.route.snapshot.paramMap.get('orderId') || '';
        const customer = this.authService.getCustomer();
        if (customer) this.customerId = customer.customerId;
    }

    getRatingLabel(): string {
        const labels = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];
        return labels[this.rating] || 'Select rating';
    }

    submit() {
        this.errorMsg = '';
        if (!this.rating) { this.errorMsg = 'Please select a rating'; return; }
        if (!this.description.trim()) { this.errorMsg = 'Feedback description is required'; return; }
        this.loading = true;
        this.feedbackService.addFeedback({ orderId: this.orderId, customerId: this.customerId, feedbackDescription: this.description, rating: this.rating })
            .subscribe({
                next: res => {
                    this.loading = false;
                    if (res.success) this.submitted = true;
                    else this.errorMsg = res.message;
                },
                error: err => { this.loading = false; this.errorMsg = err?.error?.message || 'Failed to submit feedback'; }
            });
    }
}
