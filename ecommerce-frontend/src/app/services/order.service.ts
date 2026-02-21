import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, Order } from '../models/models';

@Injectable({ providedIn: 'root' })
export class OrderService {
    private baseUrl = 'http://localhost:8080/api/order';

    constructor(private http: HttpClient) { }

    getCustomerOrders(customerId: string): Observable<ApiResponse<Order[]>> {
        return this.http.get<ApiResponse<Order[]>>(`${this.baseUrl}/customer/${customerId}`);
    }

    getOrderById(orderId: string): Observable<ApiResponse<Order>> {
        return this.http.get<ApiResponse<Order>>(`${this.baseUrl}/${orderId}`);
    }

    getByStatus(status: string): Observable<ApiResponse<Order[]>> {
        return this.http.get<ApiResponse<Order[]>>(`${this.baseUrl}/filter/${status}`);
    }

    cancelOrder(orderId: string, reason: string, customerId: string): Observable<ApiResponse<any>> {
        return this.http.put<ApiResponse<any>>(`${this.baseUrl}/${orderId}/cancel`, { reason, customerId });
    }
}
