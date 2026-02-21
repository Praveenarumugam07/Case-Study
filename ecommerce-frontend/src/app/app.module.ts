import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Customer Components
import { CustomerLoginComponent } from './components/customer/customer-login/customer-login.component';
import { RegisterComponent } from './components/customer/register/register.component';
import { HomeComponent } from './components/customer/home/home.component';
import { CartComponent } from './components/customer/cart/cart.component';
import { PaymentComponent } from './components/customer/payment/payment.component';
import { MyOrdersComponent } from './components/customer/my-orders/my-orders.component';
import { CancelOrderComponent } from './components/customer/cancel-order/cancel-order.component';
import { ProfileComponent } from './components/customer/profile/profile.component';
import { AddFeedbackComponent } from './components/customer/add-feedback/add-feedback.component';
import { NavbarComponent } from './components/shared/navbar/navbar.component';

// Admin Components
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
import { AdminNavbarComponent } from './components/shared/admin-navbar/admin-navbar.component';

@NgModule({
    declarations: [
        AppComponent,
        CustomerLoginComponent, RegisterComponent, HomeComponent, CartComponent,
        PaymentComponent, MyOrdersComponent, CancelOrderComponent, ProfileComponent,
        AddFeedbackComponent, NavbarComponent,
        AdminLoginComponent, AdminHomeComponent, AddProductComponent, ViewProductsComponent,
        ViewCustomersComponent, AdminOrdersComponent, SearchProductComponent,
        DeleteProductComponent, UpdateProductComponent, AdminCancelOrderComponent,
        ViewFeedbackComponent, AdminNavbarComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
