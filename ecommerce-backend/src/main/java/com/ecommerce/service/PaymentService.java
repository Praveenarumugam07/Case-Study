package com.ecommerce.service;

import com.ecommerce.model.*;
import com.ecommerce.repository.*;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
public class PaymentService {

    private final OrderRepository orderRepository;
    private final InvoiceRepository invoiceRepository;
    private final CartRepository cartRepository;
    private final ProductRepository productRepository;

    public PaymentService(OrderRepository orderRepository, InvoiceRepository invoiceRepository,
                          CartRepository cartRepository, ProductRepository productRepository) {
        this.orderRepository = orderRepository;
        this.invoiceRepository = invoiceRepository;
        this.cartRepository = cartRepository;
        this.productRepository = productRepository;
    }

    public Map<String, String> processPayment(PaymentRequest request) {
        // Generate IDs
        String orderId = "ORD" + System.currentTimeMillis();
        String transactionId = "TXN" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        // Build and save Order
        Order order = new Order();
        order.setOrderId(orderId);
        order.setCustomerId(request.getCustomerId());
        order.setTotalPrice(request.getTotalAmount());
        order.setOrderStatus("Confirmed");
        order.setArrivingDate(LocalDateTime.now().plusDays(5));
        orderRepository.saveOrder(order);

        // Save order items and decrease product qty
        for (CartItem ci : request.getCartItems()) {
            OrderItem oi = new OrderItem();
            oi.setOrderId(orderId);
            oi.setProductId(ci.getProductId());
            oi.setProductName(ci.getProductName());
            oi.setProductPrice(ci.getProductPrice());
            oi.setQuantity(ci.getQuantity());
            // Get category and description from product
            Optional<com.ecommerce.model.Product> p = productRepository.findById(ci.getProductId());
            p.ifPresent(prod -> {
                oi.setProductCategory(prod.getProductCategory());
                oi.setProductDescription(prod.getProductDescription());
            });
            orderRepository.saveOrderItem(oi);
            productRepository.decreaseQuantity(ci.getProductId(), ci.getQuantity());
        }

        // Save Invoice
        Invoice invoice = new Invoice();
        invoice.setTransactionId(transactionId);
        invoice.setOrderId(orderId);
        invoice.setCustomerId(request.getCustomerId());
        invoice.setTotalAmount(request.getTotalAmount());
        invoice.setPaymentMode(request.getPaymentMode());
        invoiceRepository.save(invoice);

        // Clear cart
        cartRepository.clearCart(request.getCustomerId());

        return Map.of(
                "transactionId", transactionId,
                "orderId", orderId,
                "status", "SUCCESS"
        );
    }

    public Optional<Invoice> getInvoiceByOrderId(String orderId) {
        return invoiceRepository.findByOrderId(orderId);
    }
}
