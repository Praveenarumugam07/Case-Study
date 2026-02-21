package com.ecommerce.service;

import com.ecommerce.model.Order;
import com.ecommerce.repository.OrderRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OrderService {

    private final OrderRepository orderRepository;

    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    public List<Order> getOrdersByCustomer(String customerId) {
        return orderRepository.findByCustomerId(customerId);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public List<Order> getOrdersByStatus(String status) {
        return orderRepository.findByStatus(status);
    }

    public Optional<Order> getOrderById(String orderId) {
        return orderRepository.findById(orderId);
    }

    public String cancelOrder(String orderId, String reason, String requestedBy) {
        Optional<Order> orderOpt = orderRepository.findById(orderId);
        if (orderOpt.isEmpty()) return "Order not found";
        Order order = orderOpt.get();

        // Customer cancel - check ownership
        if (requestedBy != null && !requestedBy.equals("ADMIN") && !order.getCustomerId().equals(requestedBy)) {
            return "Unauthorized";
        }

        if ("In Transit".equalsIgnoreCase(order.getOrderStatus()) || "Delivered".equalsIgnoreCase(order.getOrderStatus())) {
            return "Cannot cancel order with status: " + order.getOrderStatus();
        }
        if ("Cancelled".equalsIgnoreCase(order.getOrderStatus())) {
            return "Order already cancelled";
        }
        orderRepository.cancelOrder(orderId, reason);
        return "success";
    }

    public String changeStatus(String orderId, String newStatus) {
        Optional<Order> orderOpt = orderRepository.findById(orderId);
        if (orderOpt.isEmpty()) return "Order not found";
        orderRepository.updateStatus(orderId, newStatus);
        return "success";
    }

    public String updateOrderDetails(String orderId, String shippingAddress, String arrivingDate) {
        Optional<Order> orderOpt = orderRepository.findById(orderId);
        if (orderOpt.isEmpty()) return "Order not found";
        Order order = orderOpt.get();
        if ("Delivered".equalsIgnoreCase(order.getOrderStatus()) || "Cancelled".equalsIgnoreCase(order.getOrderStatus())) {
            return "Cannot update order with status: " + order.getOrderStatus();
        }
        java.time.LocalDateTime arriving = arrivingDate != null ? java.time.LocalDateTime.parse(arrivingDate) : null;
        orderRepository.updateOrderDetails(orderId, shippingAddress, arriving);
        return "success";
    }
}
