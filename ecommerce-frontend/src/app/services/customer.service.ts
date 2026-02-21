import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, Customer } from '../models/models';

@Injectable({ providedIn: 'root' })
export class CustomerService {
    private baseUrl = 'http://localhost:8080/api/customer';

    constructor(private http: HttpClient) { }

    register(customer: Customer): Observable<ApiResponse<any>> {
        return this.http.post<ApiResponse<any>>(`${this.baseUrl}/register`, customer);
    }

    login(customerId: string, password: string): Observable<ApiResponse<any>> {
        return this.http.post<ApiResponse<any>>(`${this.baseUrl}/login`, { customerId, password });
    }

    getProfile(customerId: string): Observable<ApiResponse<Customer>> {
        return this.http.get<ApiResponse<Customer>>(`${this.baseUrl}/${customerId}`);
    }

    updateProfile(customerId: string, customer: Partial<Customer>): Observable<ApiResponse<any>> {
        return this.http.put<ApiResponse<any>>(`${this.baseUrl}/${customerId}`, customer);
    }
}
