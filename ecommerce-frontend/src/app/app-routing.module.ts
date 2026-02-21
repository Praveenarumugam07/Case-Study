import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CustomerLoginComponent } from './components/customer/customer-login/customer-login.component';
import { RegisterComponent } from './components/customer/register/register.component';
import { HomeComponent } from './components/customer/home/home.component';
import { CartComponent } from './components/customer/cart/cart.component';
import { PaymentComponent } from './components/customer/payment/payment.component';
import { MyOrdersComponent } from './components/customer/my-orders/my-orders.component';
import { CancelOrderComponent } from './components/customer/cancel-order/cancel-order.component';
import { ProfileComponent } from './components/customer/profile/profile.component';
import { AddFeedbackComponent } from './components/customer/add-feedback/add-feedback.component';

import { AdminLoginComponent } from './components/admin/admin-login/admin-login.component';
import { AdminHomeComponent } from './components/admin/admin-home/admin-home.component';
import { AddProductComponent } from './components/admin/add-product/add-product.component';
import { ViewProductsComponent } from './components/admin/view-products/view-products.component';
import { ViewCustomersComponent } from './components/admin/view-customers/view-customers.component';
import { AdminOrdersComponent } from './components/admin/admin-orders/admin-orders.component';
import { SearchProductComponent } from './components/admin/search-product/search-product.component';
import { DeleteProductComponent } from './components/admin/delete-product/delete-product.component';
import { UpdateProductComponent } from './components/admin/update-product/update-product.component';
import { AdminCancelOrderComponent } from './components/admin/admin-cancel-order/admin-cancel-order.component';
import { ViewFeedbackComponent } from './components/admin/view-feedback/view-feedback.component';

import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';

const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    // Customer routes
    { path: 'login', component: CustomerLoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'cart', component: CartComponent, canActivate: [AuthGuard] },
    { path: 'payment', component: PaymentComponent, canActivate: [AuthGuard] },
    { path: 'my-orders', component: MyOrdersComponent, canActivate: [AuthGuard] },
    { path: 'cancel-order', component: CancelOrderComponent, canActivate: [AuthGuard] },
    { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
    { path: 'add-feedback/:orderId', component: AddFeedbackComponent, canActivate: [AuthGuard] },
    // Admin routes
    { path: 'admin/login', component: AdminLoginComponent },
    { path: 'admin/home', component: AdminHomeComponent, canActivate: [AdminGuard] },
    { path: 'admin/add-product', component: AddProductComponent, canActivate: [AdminGuard] },
    { path: 'admin/view-products', component: ViewProductsComponent, canActivate: [AdminGuard] },
    { path: 'admin/view-customers', component: ViewCustomersComponent, canActivate: [AdminGuard] },
    { path: 'admin/orders', component: AdminOrdersComponent, canActivate: [AdminGuard] },
    { path: 'admin/search-product', component: SearchProductComponent, canActivate: [AdminGuard] },
    { path: 'admin/delete-product', component: DeleteProductComponent, canActivate: [AdminGuard] },
    { path: 'admin/update-product', component: UpdateProductComponent, canActivate: [AdminGuard] },
    { path: 'admin/cancel-order', component: AdminCancelOrderComponent, canActivate: [AdminGuard] },
    { path: 'admin/feedback', component: ViewFeedbackComponent, canActivate: [AdminGuard] },
    { path: '**', redirectTo: '/login' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
