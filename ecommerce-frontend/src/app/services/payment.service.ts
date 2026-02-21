import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, Invoice } from '../models/models';

@Injectable({ providedIn: 'root' })
export class PaymentService {
    private baseUrl = 'http://localhost:8080/api/payment';

    constructor(private http: HttpClient) { }

    processPayment(request: any): Observable<ApiResponse<any>> {
        return this.http.post<ApiResponse<any>>(`${this.baseUrl}/process`, request);
    }

    getInvoice(orderId: string): Observable<ApiResponse<Invoice>> {
        return this.http.get<ApiResponse<Invoice>>(`${this.baseUrl}/invoice/${orderId}`);
    }
}
