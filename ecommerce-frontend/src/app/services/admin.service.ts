import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, Customer, Order } from '../models/models';

@Injectable({ providedIn: 'root' })
export class AdminService {
    private baseUrl = 'http://localhost:8080/api/admin';

    constructor(private http: HttpClient) { }

    login(adminId: string, password: string): Observable<ApiResponse<any>> {
        return this.http.post<ApiResponse<any>>(`${this.baseUrl}/login`, { adminId, password });
    }

    getAllCustomers(): Observable<ApiResponse<Customer[]>> {
        return this.http.get<ApiResponse<Customer[]>>(`${this.baseUrl}/customers`);
    }

    getAllOrders(): Observable<ApiResponse<Order[]>> {
        return this.http.get<ApiResponse<Order[]>>(`${this.baseUrl}/orders`);
    }

    getOrdersByStatus(status: string): Observable<ApiResponse<Order[]>> {
        return this.http.get<ApiResponse<Order[]>>(`${this.baseUrl}/orders/status/${status}`);
    }

    changeOrderStatus(orderId: string, status: string): Observable<ApiResponse<any>> {
        return this.http.put<ApiResponse<any>>(`${this.baseUrl}/orders/${orderId}/status`, { status });
    }

    cancelOrder(orderId: string): Observable<ApiResponse<any>> {
        return this.http.put<ApiResponse<any>>(`${this.baseUrl}/orders/${orderId}/cancel`, { reason: 'Cancelled by admin' });
    }

    updateOrder(orderId: string, data: any): Observable<ApiResponse<any>> {
        return this.http.put<ApiResponse<any>>(`${this.baseUrl}/orders/${orderId}/update`, data);
    }
}
