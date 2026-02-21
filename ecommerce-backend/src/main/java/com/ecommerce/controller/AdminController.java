package com.ecommerce.controller;

import com.ecommerce.model.Admin;
import com.ecommerce.model.ApiResponse;
import com.ecommerce.model.Customer;
import com.ecommerce.model.Order;
import com.ecommerce.service.AdminService;
import com.ecommerce.service.CustomerService;
import com.ecommerce.service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:4200")
public class AdminController {

    private final AdminService adminService;
    private final CustomerService customerService;
    private final OrderService orderService;

    public AdminController(AdminService adminService, CustomerService customerService, OrderService orderService) {
        this.adminService = adminService;
        this.customerService = customerService;
        this.orderService = orderService;
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<?>> login(@RequestBody Map<String, String> body) {
        String adminId = body.get("adminId");
        String password = body.get("password");
        Optional<Admin> admin = adminService.login(adminId, password);
        if (admin.isPresent()) {
            return ResponseEntity.ok(ApiResponse.success("Welcome " + admin.get().getUsername() + "!",
                    Map.of("adminId", admin.get().getAdminId(), "username", admin.get().getUsername())));
        }
        return ResponseEntity.badRequest().body(ApiResponse.error("Invalid User Id / Password"));
    }

    @GetMapping("/customers")
    public ResponseEntity<ApiResponse<List<Customer>>> getAllCustomers() {
        List<Customer> customers = customerService.findAll();
        customers.forEach(c -> c.setPassword(null)); // Don't expose password
        return ResponseEntity.ok(ApiResponse.success("Customers retrieved", customers));
    }

    @GetMapping("/orders")
    public ResponseEntity<ApiResponse<List<Order>>> getAllOrders() {
        return ResponseEntity.ok(ApiResponse.success("Orders retrieved", orderService.getAllOrders()));
    }

    @GetMapping("/orders/status/{status}")
    public ResponseEntity<ApiResponse<List<Order>>> getOrdersByStatus(@PathVariable String status) {
        return ResponseEntity.ok(ApiResponse.success("Filtered orders", orderService.getOrdersByStatus(status)));
    }

    @PutMapping("/orders/{orderId}/status")
    public ResponseEntity<ApiResponse<?>> changeOrderStatus(@PathVariable String orderId, @RequestBody Map<String, String> body) {
        String result = orderService.changeStatus(orderId, body.get("status"));
        if ("success".equals(result)) return ResponseEntity.ok(ApiResponse.success("Order status updated", null));
        return ResponseEntity.badRequest().body(ApiResponse.error(result));
    }

    @PutMapping("/orders/{orderId}/cancel")
    public ResponseEntity<ApiResponse<?>> cancelOrder(@PathVariable String orderId, @RequestBody Map<String, String> body) {
        String reason = body.getOrDefault("reason", "Cancelled by admin");
        String result = orderService.cancelOrder(orderId, reason, "ADMIN");
        if ("success".equals(result)) {
            return ResponseEntity.ok(ApiResponse.success("Order cancelled successfully", orderService.getOrderById(orderId).orElse(null)));
        }
        return ResponseEntity.badRequest().body(ApiResponse.error(result));
    }

    @PutMapping("/orders/{orderId}/update")
    public ResponseEntity<ApiResponse<?>> updateOrder(@PathVariable String orderId, @RequestBody Map<String, String> body) {
        String result = orderService.updateOrderDetails(orderId, body.get("shippingAddress"), body.get("arrivingDate"));
        if ("success".equals(result)) return ResponseEntity.ok(ApiResponse.success("Order updated successfully", null));
        return ResponseEntity.badRequest().body(ApiResponse.error(result));
    }
}
