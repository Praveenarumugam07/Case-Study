package com.ecommerce.service;

import com.ecommerce.model.Feedback;
import com.ecommerce.model.Order;
import com.ecommerce.repository.FeedbackRepository;
import com.ecommerce.repository.OrderRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FeedbackService {

    private final FeedbackRepository feedbackRepository;
    private final OrderRepository orderRepository;

    public FeedbackService(FeedbackRepository feedbackRepository, OrderRepository orderRepository) {
        this.feedbackRepository = feedbackRepository;
        this.orderRepository = orderRepository;
    }

    public String addFeedback(Feedback feedback) {
        Optional<Order> orderOpt = orderRepository.findById(feedback.getOrderId());
        if (orderOpt.isEmpty()) return "Order not found";
        if (!"Delivered".equalsIgnoreCase(orderOpt.get().getOrderStatus())) return "Feedback can only be submitted for Delivered orders";
        if (!orderOpt.get().getCustomerId().equals(feedback.getCustomerId())) return "Unauthorized: Order does not belong to you";
        if (feedbackRepository.existsByOrderAndCustomer(feedback.getOrderId(), feedback.getCustomerId())) return "Feedback already submitted for this order";
        feedbackRepository.save(feedback);
        return "success";
    }

    public List<Feedback> getAllFeedbacks() {
        return feedbackRepository.findAll();
    }

    public List<Feedback> getFeedbacksByOrderId(String orderId) {
        return feedbackRepository.findByOrderId(orderId);
    }
}
