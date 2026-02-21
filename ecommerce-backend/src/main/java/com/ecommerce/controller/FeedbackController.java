package com.ecommerce.controller;

import com.ecommerce.model.ApiResponse;
import com.ecommerce.model.Feedback;
import com.ecommerce.service.FeedbackService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/feedback")
@CrossOrigin(origins = "http://localhost:4200")
public class FeedbackController {

    private final FeedbackService feedbackService;

    public FeedbackController(FeedbackService feedbackService) {
        this.feedbackService = feedbackService;
    }

    @PostMapping("/add")
    public ResponseEntity<ApiResponse<?>> addFeedback(@RequestBody Feedback feedback) {
        if (feedback.getFeedbackDescription() == null || feedback.getFeedbackDescription().trim().isEmpty())
            return ResponseEntity.badRequest().body(ApiResponse.error("Feedback description is required"));
        if (feedback.getRating() == null || feedback.getRating() < 1 || feedback.getRating() > 5)
            return ResponseEntity.badRequest().body(ApiResponse.error("Rating must be between 1 and 5"));

        String result = feedbackService.addFeedback(feedback);
        if ("success".equals(result)) return ResponseEntity.ok(ApiResponse.success("Feedback submitted successfully", null));
        return ResponseEntity.badRequest().body(ApiResponse.error(result));
    }

    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<Feedback>>> getAllFeedbacks() {
        return ResponseEntity.ok(ApiResponse.success("All feedbacks", feedbackService.getAllFeedbacks()));
    }

    @GetMapping("/order/{orderId}")
    public ResponseEntity<ApiResponse<List<Feedback>>> getFeedbackByOrder(@PathVariable String orderId) {
        return ResponseEntity.ok(ApiResponse.success("Order feedbacks", feedbackService.getFeedbacksByOrderId(orderId)));
    }
}
