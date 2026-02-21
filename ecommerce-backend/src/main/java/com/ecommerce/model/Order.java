package com.ecommerce.model;

import java.time.LocalDateTime;
import java.util.List;

public class Order {
    private String orderId;
    private String customerId;
    private LocalDateTime orderDate;
    private LocalDateTime arrivingDate;
    private Double totalPrice;
    private String orderStatus;
    private String shippingAddress;
    private String cancelReason;
    private LocalDateTime cancelledDate;
    private List<OrderItem> products;

    public Order() {}

    public String getOrderId() { return orderId; }
    public void setOrderId(String orderId) { this.orderId = orderId; }

    public String getCustomerId() { return customerId; }
    public void setCustomerId(String customerId) { this.customerId = customerId; }

    public LocalDateTime getOrderDate() { return orderDate; }
    public void setOrderDate(LocalDateTime orderDate) { this.orderDate = orderDate; }

    public LocalDateTime getArrivingDate() { return arrivingDate; }
    public void setArrivingDate(LocalDateTime arrivingDate) { this.arrivingDate = arrivingDate; }

    public Double getTotalPrice() { return totalPrice; }
    public void setTotalPrice(Double totalPrice) { this.totalPrice = totalPrice; }

    public String getOrderStatus() { return orderStatus; }
    public void setOrderStatus(String orderStatus) { this.orderStatus = orderStatus; }

    public String getShippingAddress() { return shippingAddress; }
    public void setShippingAddress(String shippingAddress) { this.shippingAddress = shippingAddress; }

    public String getCancelReason() { return cancelReason; }
    public void setCancelReason(String cancelReason) { this.cancelReason = cancelReason; }

    public LocalDateTime getCancelledDate() { return cancelledDate; }
    public void setCancelledDate(LocalDateTime cancelledDate) { this.cancelledDate = cancelledDate; }

    public List<OrderItem> getProducts() { return products; }
    public void setProducts(List<OrderItem> products) { this.products = products; }
}
