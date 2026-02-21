package com.ecommerce.controller;

import com.ecommerce.model.ApiResponse;
import com.ecommerce.model.Invoice;
import com.ecommerce.model.PaymentRequest;
import com.ecommerce.service.PaymentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin(origins = "http://localhost:4200")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/process")
    public ResponseEntity<ApiResponse<?>> processPayment(@RequestBody PaymentRequest request) {
        // Validate payment details
        if (request.getPaymentMode() == null)
            return ResponseEntity.badRequest().body(ApiResponse.error("Payment mode is required"));

        if ("Credit Card".equalsIgnoreCase(request.getPaymentMode())) {
            if (request.getCardNumber() == null || request.getCardNumber().length() < 16)
                return ResponseEntity.badRequest().body(ApiResponse.error("Card Number must be at least 16 digits"));
            if (request.getCardHolderName() == null || request.getCardHolderName().length() < 10)
                return ResponseEntity.badRequest().body(ApiResponse.error("Card Holder Name must be at least 10 characters"));
            if (request.getExpiryDate() == null || !request.getExpiryDate().matches("^(0[1-9]|1[0-2])/[0-9]{2}$"))
                return ResponseEntity.badRequest().body(ApiResponse.error("Expiry Date must be in MM/YY format"));
            if (request.getCvvCode() == null || !request.getCvvCode().matches("^[0-9]{4}$"))
                return ResponseEntity.badRequest().body(ApiResponse.error("CVV must be 4 digits"));
        } else if ("UPI".equalsIgnoreCase(request.getPaymentMode())) {
            if (request.getUpiId() == null || request.getUpiId().trim().isEmpty())
                return ResponseEntity.badRequest().body(ApiResponse.error("UPI ID is required"));
        } else {
            return ResponseEntity.badRequest().body(ApiResponse.error("Invalid payment mode"));
        }

        try {
            Map<String, String> result = paymentService.processPayment(request);
            return ResponseEntity.ok(ApiResponse.success("Payment successful!", result));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Payment failed: " + e.getMessage()));
        }
    }

    @GetMapping("/invoice/{orderId}")
    public ResponseEntity<ApiResponse<?>> getInvoice(@PathVariable String orderId) {
        Optional<Invoice> invoice = paymentService.getInvoiceByOrderId(orderId);
        if (invoice.isPresent()) return ResponseEntity.ok(ApiResponse.success("Invoice retrieved", invoice.get()));
        return ResponseEntity.badRequest().body(ApiResponse.error("Invoice not found"));
    }
}
