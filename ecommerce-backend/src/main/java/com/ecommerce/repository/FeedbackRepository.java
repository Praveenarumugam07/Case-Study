package com.ecommerce.repository;

import com.ecommerce.model.Feedback;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class FeedbackRepository {

    private final JdbcTemplate jdbc;

    public FeedbackRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    private final RowMapper<Feedback> rowMapper = (rs, rowNum) -> {
        Feedback f = new Feedback();
        f.setFeedbackId(rs.getInt("feedback_id"));
        f.setOrderId(rs.getString("order_id"));
        f.setCustomerId(rs.getString("customer_id"));
        f.setCustomerName(rs.getString("customer_name"));
        f.setFeedbackDescription(rs.getString("feedback_description"));
        f.setRating(rs.getInt("rating"));
        f.setFeedbackDate(rs.getTimestamp("feedback_date") != null ? rs.getTimestamp("feedback_date").toLocalDateTime() : null);
        return f;
    };

    public void save(Feedback feedback) {
        String sql = "INSERT INTO FEEDBACK (order_id, customer_id, feedback_description, rating) VALUES (?, ?, ?, ?)";
        jdbc.update(sql, feedback.getOrderId(), feedback.getCustomerId(),
                feedback.getFeedbackDescription(), feedback.getRating());
    }

    public List<Feedback> findAll() {
        String sql = "SELECT f.*, c.name AS customer_name FROM FEEDBACK f " +
                     "JOIN CUSTOMER c ON f.customer_id = c.customer_id " +
                     "ORDER BY f.feedback_date DESC";
        return jdbc.query(sql, rowMapper);
    }

    public List<Feedback> findByOrderId(String orderId) {
        String sql = "SELECT f.*, c.name AS customer_name FROM FEEDBACK f " +
                     "JOIN CUSTOMER c ON f.customer_id = c.customer_id " +
                     "WHERE f.order_id = ?";
        return jdbc.query(sql, rowMapper, orderId);
    }

    public boolean existsByOrderAndCustomer(String orderId, String customerId) {
        String sql = "SELECT COUNT(*) FROM FEEDBACK WHERE order_id = ? AND customer_id = ?";
        Integer count = jdbc.queryForObject(sql, Integer.class, orderId, customerId);
        return count != null && count > 0;
    }
}
