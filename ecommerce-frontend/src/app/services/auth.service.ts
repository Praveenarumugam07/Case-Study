import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private CUSTOMER_KEY = 'ecommerce_customer';
    private ADMIN_KEY = 'ecommerce_admin';

    // Customer session
    setCustomer(data: { customerId: string; name: string; email: string }) {
        sessionStorage.setItem(this.CUSTOMER_KEY, JSON.stringify(data));
    }

    getCustomer(): { customerId: string; name: string; email: string } | null {
        const data = sessionStorage.getItem(this.CUSTOMER_KEY);
        return data ? JSON.parse(data) : null;
    }

    isCustomerLoggedIn(): boolean {
        return !!sessionStorage.getItem(this.CUSTOMER_KEY);
    }

    logoutCustomer() {
        sessionStorage.removeItem(this.CUSTOMER_KEY);
    }

    // Admin session
    setAdmin(data: { adminId: string; username: string }) {
        sessionStorage.setItem(this.ADMIN_KEY, JSON.stringify(data));
    }

    getAdmin(): { adminId: string; username: string } | null {
        const data = sessionStorage.getItem(this.ADMIN_KEY);
        return data ? JSON.parse(data) : null;
    }

    isAdminLoggedIn(): boolean {
        return !!sessionStorage.getItem(this.ADMIN_KEY);
    }

    logoutAdmin() {
        sessionStorage.removeItem(this.ADMIN_KEY);
    }
}
