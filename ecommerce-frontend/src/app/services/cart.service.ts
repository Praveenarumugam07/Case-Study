import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, CartItem } from '../models/models';

@Injectable({ providedIn: 'root' })
export class CartService {
    private baseUrl = 'http://localhost:8080/api/cart';

    constructor(private http: HttpClient) { }

    getCart(customerId: string): Observable<ApiResponse<CartItem[]>> {
        return this.http.get<ApiResponse<CartItem[]>>(`${this.baseUrl}/${customerId}`);
    }

    addToCart(customerId: string, productId: number, quantity: number = 1): Observable<ApiResponse<any>> {
        return this.http.post<ApiResponse<any>>(`${this.baseUrl}/${customerId}/add`, { productId, quantity });
    }

    updateQuantity(customerId: string, cartItemId: number, quantity: number): Observable<ApiResponse<any>> {
        return this.http.put<ApiResponse<any>>(`${this.baseUrl}/${customerId}/update/${cartItemId}`, { quantity });
    }

    removeItem(customerId: string, cartItemId: number): Observable<ApiResponse<any>> {
        return this.http.delete<ApiResponse<any>>(`${this.baseUrl}/${customerId}/remove/${cartItemId}`);
    }

    clearCart(customerId: string): Observable<ApiResponse<any>> {
        return this.http.delete<ApiResponse<any>>(`${this.baseUrl}/${customerId}/clear`);
    }
}
