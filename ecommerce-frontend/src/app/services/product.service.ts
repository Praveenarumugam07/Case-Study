import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, Product } from '../models/models';

@Injectable({ providedIn: 'root' })
export class ProductService {
    private baseUrl = 'http://localhost:8080/api/product';

    constructor(private http: HttpClient) { }

    getAll(): Observable<ApiResponse<Product[]>> {
        return this.http.get<ApiResponse<Product[]>>(`${this.baseUrl}/all`);
    }

    getAllAdmin(): Observable<ApiResponse<Product[]>> {
        return this.http.get<ApiResponse<Product[]>>(`${this.baseUrl}/admin/all`);
    }

    getById(productId: number): Observable<ApiResponse<Product>> {
        return this.http.get<ApiResponse<Product>>(`${this.baseUrl}/${productId}`);
    }

    search(productId?: number, productName?: string): Observable<ApiResponse<any>> {
        let params: any = {};
        if (productId) params['productId'] = productId;
        if (productName) params['productName'] = productName;
        return this.http.get<ApiResponse<any>>(`${this.baseUrl}/search`, { params });
    }

    getByCategory(category: string): Observable<ApiResponse<Product[]>> {
        return this.http.get<ApiResponse<Product[]>>(`${this.baseUrl}/category/${category}`);
    }

    getCategories(): Observable<ApiResponse<string[]>> {
        return this.http.get<ApiResponse<string[]>>(`${this.baseUrl}/categories`);
    }

    addProduct(product: Product): Observable<ApiResponse<Product>> {
        return this.http.post<ApiResponse<Product>>(`${this.baseUrl}/add`, product);
    }

    updateProduct(productId: number, product: Partial<Product>): Observable<ApiResponse<Product>> {
        return this.http.put<ApiResponse<Product>>(`${this.baseUrl}/${productId}`, product);
    }

    softDelete(productId: number): Observable<ApiResponse<any>> {
        return this.http.delete<ApiResponse<any>>(`${this.baseUrl}/${productId}`);
    }

    restore(productId: number): Observable<ApiResponse<any>> {
        return this.http.put<ApiResponse<any>>(`${this.baseUrl}/${productId}/restore`, {});
    }

    bulkUpload(file: File): Observable<ApiResponse<any>> {
        const formData = new FormData();
        formData.append('file', file);
        return this.http.post<ApiResponse<any>>(`${this.baseUrl}/bulk-upload`, formData);
    }
}
