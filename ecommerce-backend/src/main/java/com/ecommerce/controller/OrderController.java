package com.ecommerce.controller;

import com.ecommerce.model.ApiResponse;
import com.ecommerce.model.Order;
import com.ecommerce.service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/order")
@CrossOrigin(origins = "http://localhost:4200")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<ApiResponse<List<Order>>> getCustomerOrders(@PathVariable String customerId) {
        return ResponseEntity.ok(ApiResponse.success("Orders retrieved", orderService.getOrdersByCustomer(customerId)));
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<ApiResponse<?>> getOrder(@PathVariable String orderId) {
        Optional<Order> order = orderService.getOrderById(orderId);
        if (order.isPresent()) return ResponseEntity.ok(ApiResponse.success("Order found", order.get()));
        return ResponseEntity.badRequest().body(ApiResponse.error("Order not found"));
    }

    @GetMapping("/filter/{status}")
    public ResponseEntity<ApiResponse<List<Order>>> getByStatus(@PathVariable String status) {
        return ResponseEntity.ok(ApiResponse.success("Filtered orders", orderService.getOrdersByStatus(status)));
    }

    @PutMapping("/{orderId}/cancel")
    public ResponseEntity<ApiResponse<?>> cancelOrder(@PathVariable String orderId, @RequestBody Map<String, String> body) {
        String reason = body.getOrDefault("reason", "Cancelled by customer");
        String customerId = body.get("customerId");
        String result = orderService.cancelOrder(orderId, reason, customerId);
        if ("success".equals(result)) {
            return ResponseEntity.ok(ApiResponse.success("Order cancelled successfully. The amount will refund to your account in 5 working days.",
                    orderService.getOrderById(orderId).orElse(null)));
        }
        return ResponseEntity.badRequest().body(ApiResponse.error(result));
    }
}
