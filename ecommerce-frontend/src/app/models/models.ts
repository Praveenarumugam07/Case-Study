export interface Customer {
    customerId?: string;
    name: string;
    country: string;
    state: string;
    city: string;
    address1: string;
    address2?: string;
    zipCode: string;
    phoneNumber: string;
    email: string;
    password?: string;
    confirmPassword?: string;
}

export interface Product {
    productId?: number;
    productName: string;
    productImage?: string;
    productPrice: number;
    productCategory: string;
    productDescription: string;
    quantityAvailable: number;
    productStatus: string;
    isDeleted?: boolean;
}

export interface CartItem {
    cartItemId?: number;
    cartId?: number;
    productId: number;
    productName: string;
    productPrice: number;
    quantity: number;
}

export interface Order {
    orderId: string;
    customerId: string;
    orderDate: string;
    arrivingDate?: string;
    totalPrice: number;
    orderStatus: string;
    shippingAddress?: string;
    cancelReason?: string;
    cancelledDate?: string;
    products?: OrderItem[];
}

export interface OrderItem {
    orderItemId?: number;
    orderId?: string;
    productId: number;
    productName: string;
    productCategory?: string;
    productPrice: number;
    productDescription?: string;
    quantity: number;
}

export interface Invoice {
    invoiceId?: number;
    transactionId: string;
    orderId: string;
    customerId: string;
    totalAmount: number;
    paymentMode: string;
    paymentTimestamp: string;
}

export interface Feedback {
    feedbackId?: number;
    orderId: string;
    customerId: string;
    customerName?: string;
    feedbackDescription: string;
    rating: number;
    feedbackDate?: string;
}

export interface Admin {
    adminId: string;
    username: string;
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data?: T;
}
