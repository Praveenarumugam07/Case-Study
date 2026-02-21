import { Component, OnInit } from '@angular/core';
import { FeedbackService } from '../../../services/feedback.service';
import { Feedback } from '../../../models/models';

@Component({
    selector: 'app-view-feedback',
    template: `
    <app-admin-navbar></app-admin-navbar>
    <div class="page-container">
      <h1 class="page-title">Customer Feedback</h1>
      <p class="page-subtitle">{{feedbacks.length}} total reviews from customers</p>

      <div style="display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap;align-items:center">
        <input type="text" class="form-control" style="width:200px" [(ngModel)]="searchTerm" (input)="applyFilter()" placeholder="Search by Order ID, Customer...">
        <select class="form-control" style="width:160px" [(ngModel)]="ratingFilter" (change)="applyFilter()">
          <option value="0">All Ratings</option>
          <option value="5">⭐⭐⭐⭐⭐ (5)</option>
          <option value="4">⭐⭐⭐⭐ (4)</option>
          <option value="3">⭐⭐⭐ (3)</option>
          <option value="2">⭐⭐ (2)</option>
          <option value="1">⭐ (1)</option>
        </select>
        <button class="btn btn-secondary btn-sm" (click)="searchTerm='';ratingFilter=0;applyFilter()">Clear</button>
      </div>

      <div *ngIf="loading" class="flex-center" style="padding:40px"><div class="spinner"></div></div>

      <div *ngIf="filteredFeedbacks.length === 0 && !loading" class="empty-state">
        <div class="empty-state-icon">💬</div>
        <div class="empty-state-text">No feedback found</div>
      </div>

      <div style="display:grid;gap:16px">
        <div class="card" *ngFor="let fb of filteredFeedbacks">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:12px">
            <div>
              <div style="display:flex;gap:8px;align-items:center;margin-bottom:8px">
                <div style="width:40px;height:40px;border-radius:50%;background:var(--gradient);display:flex;align-items:center;justify-content:center;font-size:18px">👤</div>
                <div>
                  <div style="font-weight:600">{{fb.customerName || fb.customerId}}</div>
                  <div style="font-size:12px;color:var(--text-muted)">Order: {{fb.orderId}}</div>
                </div>
              </div>
              <p style="color:var(--text-secondary);margin-bottom:8px">"{{fb.feedbackDescription}}"</p>
              <div style="font-size:12px;color:var(--text-muted)">{{fb.feedbackDate | date:'MMM d, yyyy h:mm a'}}</div>
            </div>
            <div style="text-align:right">
              <div style="font-size:24px;color:#f6ad55;letter-spacing:2px">{{'★'.repeat(fb.rating)}}{{'☆'.repeat(5-fb.rating)}}</div>
              <div style="font-size:13px;color:var(--text-muted)">{{getRatingLabel(fb.rating)}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ViewFeedbackComponent implements OnInit {
    feedbacks: Feedback[] = [];
    filteredFeedbacks: Feedback[] = [];
    searchTerm = '';
    ratingFilter = 0;
    loading = true;

    constructor(private feedbackService: FeedbackService) { }

    ngOnInit() {
        this.feedbackService.getAllFeedbacks().subscribe({
            next: res => { this.loading = false; this.feedbacks = res.data || []; this.filteredFeedbacks = [...this.feedbacks]; },
            error: () => { this.loading = false; }
        });
    }

    applyFilter() {
        const term = this.searchTerm.toLowerCase();
        this.filteredFeedbacks = this.feedbacks.filter(fb => {
            const matchSearch = !term || fb.orderId.toLowerCase().includes(term) || fb.customerId.toLowerCase().includes(term) || fb.feedbackDescription.toLowerCase().includes(term);
            const matchRating = !this.ratingFilter || fb.rating === this.ratingFilter;
            return matchSearch && matchRating;
        });
    }

    getRatingLabel(r: number): string {
        const labels = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];
        return labels[r] || '';
    }
}
