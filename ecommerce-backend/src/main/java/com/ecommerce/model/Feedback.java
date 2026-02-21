package com.ecommerce.model;

import java.time.LocalDateTime;

public class Feedback {
    private Integer feedbackId;
    private String orderId;
    private String customerId;
    private String customerName;
    private String feedbackDescription;
    private Integer rating;
    private LocalDateTime feedbackDate;

    public Feedback() {}

    public Integer getFeedbackId() { return feedbackId; }
    public void setFeedbackId(Integer feedbackId) { this.feedbackId = feedbackId; }

    public String getOrderId() { return orderId; }
    public void setOrderId(String orderId) { this.orderId = orderId; }

    public String getCustomerId() { return customerId; }
    public void setCustomerId(String customerId) { this.customerId = customerId; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public String getFeedbackDescription() { return feedbackDescription; }
    public void setFeedbackDescription(String feedbackDescription) { this.feedbackDescription = feedbackDescription; }

    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }

    public LocalDateTime getFeedbackDate() { return feedbackDate; }
    public void setFeedbackDate(LocalDateTime feedbackDate) { this.feedbackDate = feedbackDate; }
}
