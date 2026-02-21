import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, Feedback } from '../models/models';

@Injectable({ providedIn: 'root' })
export class FeedbackService {
    private baseUrl = 'http://localhost:8080/api/feedback';

    constructor(private http: HttpClient) { }

    addFeedback(feedback: Partial<Feedback>): Observable<ApiResponse<any>> {
        return this.http.post<ApiResponse<any>>(`${this.baseUrl}/add`, feedback);
    }

    getAllFeedbacks(): Observable<ApiResponse<Feedback[]>> {
        return this.http.get<ApiResponse<Feedback[]>>(`${this.baseUrl}/all`);
    }

    getFeedbackByOrder(orderId: string): Observable<ApiResponse<Feedback[]>> {
        return this.http.get<ApiResponse<Feedback[]>>(`${this.baseUrl}/order/${orderId}`);
    }
}
