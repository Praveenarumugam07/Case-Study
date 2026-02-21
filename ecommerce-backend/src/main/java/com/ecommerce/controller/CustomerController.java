package com.ecommerce.controller;

import com.ecommerce.model.ApiResponse;
import com.ecommerce.model.Customer;
import com.ecommerce.service.CustomerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/customer")
@CrossOrigin(origins = "http://localhost:4200")
public class CustomerController {

    private final CustomerService customerService;

    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<?>> register(@RequestBody Customer customer) {
        // Validations
        if (customer.getName() == null || customer.getName().trim().isEmpty())
            return ResponseEntity.badRequest().body(ApiResponse.error("Name is required"));
        if (customer.getName().length() > 50)
            return ResponseEntity.badRequest().body(ApiResponse.error("Name must not exceed 50 characters"));
        if (customer.getEmail() == null || !customer.getEmail().matches("^[\\w.-]+@[\\w.-]+\\.[a-zA-Z]{2,}$"))
            return ResponseEntity.badRequest().body(ApiResponse.error("Please enter a valid email address"));
        if (!customerService.isEmailUnique(customer.getEmail()))
            return ResponseEntity.badRequest().body(ApiResponse.error("Email already registered in the application"));
        if (customer.getPhoneNumber() == null || customer.getPhoneNumber().startsWith("0"))
            return ResponseEntity.badRequest().body(ApiResponse.error("Phone Number should not start with 0"));
        if (customer.getPassword() == null || customer.getPassword().length() < 10)
            return ResponseEntity.badRequest().body(ApiResponse.error("Your password must be at least 10 characters long, containing at least one number, one uppercase letter and one alphanumeric character"));
        if (!customer.getPassword().matches("^(?=.*[A-Z])(?=.*[0-9])(?=.*[a-zA-Z0-9]).{10,}$"))
            return ResponseEntity.badRequest().body(ApiResponse.error("Your password must be at least 10 characters long, containing at least one number, one uppercase letter and one alphanumeric character"));

        Customer saved = customerService.register(customer);
        return ResponseEntity.ok(ApiResponse.success("Registration successful!", Map.of(
                "customerId", saved.getCustomerId(),
                "name", saved.getName(),
                "email", saved.getEmail()
        )));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<?>> login(@RequestBody Map<String, String> body) {
        String customerId = body.get("customerId");
        String password = body.get("password");
        if (customerId == null || customerId.isEmpty())
            return ResponseEntity.badRequest().body(ApiResponse.error("Customer ID is required"));
        if (password == null || password.isEmpty())
            return ResponseEntity.badRequest().body(ApiResponse.error("Password is required"));

        Optional<Customer> cust = customerService.login(customerId, password);
        if (cust.isPresent()) {
            Customer c = cust.get();
            return ResponseEntity.ok(ApiResponse.success("Welcome " + c.getName() + "!", Map.of(
                    "customerId", c.getCustomerId(),
                    "name", c.getName(),
                    "email", c.getEmail()
            )));
        }
        return ResponseEntity.badRequest().body(ApiResponse.error("Invalid Customer Id / Password"));
    }

    @GetMapping("/{customerId}")
    public ResponseEntity<ApiResponse<?>> getProfile(@PathVariable String customerId) {
        Optional<Customer> cust = customerService.findById(customerId);
        if (cust.isPresent()) {
            cust.get().setPassword(null);
            return ResponseEntity.ok(ApiResponse.success("Profile retrieved", cust.get()));
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/{customerId}")
    public ResponseEntity<ApiResponse<?>> updateProfile(@PathVariable String customerId, @RequestBody Customer customer) {
        customer.setCustomerId(customerId);
        if (customer.getPhoneNumber() != null && customer.getPhoneNumber().startsWith("0"))
            return ResponseEntity.badRequest().body(ApiResponse.error("Please enter a valid phone number"));
        if (customer.getPassword() != null && !customer.getPassword().isEmpty() && !customer.getPassword().startsWith("$2a$")) {
            if (customer.getPassword().length() < 10 || !customer.getPassword().matches("^(?=.*[A-Z])(?=.*[0-9])(?=.*[a-zA-Z0-9]).{10,}$"))
                return ResponseEntity.badRequest().body(ApiResponse.error("Your password must be at least 10 characters long, containing at least one number, one uppercase letter and one alphanumeric character"));
        }
        customerService.updateProfile(customer);
        return ResponseEntity.ok(ApiResponse.success("Details updated successfully", customer));
    }
}
