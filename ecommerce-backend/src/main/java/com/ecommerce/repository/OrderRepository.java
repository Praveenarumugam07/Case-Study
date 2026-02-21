package com.ecommerce.repository;

import com.ecommerce.model.Order;
import com.ecommerce.model.OrderItem;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class OrderRepository {

    private final JdbcTemplate jdbc;

    public OrderRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    private final RowMapper<Order> orderRowMapper = (rs, rowNum) -> {
        Order o = new Order();
        o.setOrderId(rs.getString("order_id"));
        o.setCustomerId(rs.getString("customer_id"));
        o.setOrderDate(rs.getTimestamp("order_date") != null ? rs.getTimestamp("order_date").toLocalDateTime() : null);
        o.setArrivingDate(rs.getTimestamp("arriving_date") != null ? rs.getTimestamp("arriving_date").toLocalDateTime() : null);
        o.setTotalPrice(rs.getDouble("total_price"));
        o.setOrderStatus(rs.getString("order_status"));
        o.setShippingAddress(rs.getString("shipping_address"));
        o.setCancelReason(rs.getString("cancel_reason"));
        o.setCancelledDate(rs.getTimestamp("cancelled_date") != null ? rs.getTimestamp("cancelled_date").toLocalDateTime() : null);
        return o;
    };

    private final RowMapper<OrderItem> itemRowMapper = (rs, rowNum) -> {
        OrderItem oi = new OrderItem();
        oi.setOrderItemId(rs.getInt("order_item_id"));
        oi.setOrderId(rs.getString("order_id"));
        oi.setProductId(rs.getInt("product_id"));
        oi.setProductName(rs.getString("product_name"));
        oi.setProductCategory(rs.getString("product_category"));
        oi.setProductPrice(rs.getDouble("product_price"));
        oi.setProductDescription(rs.getString("product_description"));
        oi.setQuantity(rs.getInt("quantity"));
        return oi;
    };

    public void saveOrder(Order order) {
        String sql = "INSERT INTO ORDERS (order_id, customer_id, order_date, arriving_date, total_price, order_status, shipping_address) " +
                     "VALUES (?, ?, CURRENT_TIMESTAMP, ?, ?, ?, ?)";
        jdbc.update(sql, order.getOrderId(), order.getCustomerId(),
                order.getArrivingDate(), order.getTotalPrice(),
                order.getOrderStatus(), order.getShippingAddress());
    }

    public void saveOrderItem(OrderItem item) {
        String sql = "INSERT INTO ORDER_ITEMS (order_id, product_id, product_name, product_category, product_price, product_description, quantity) " +
                     "VALUES (?, ?, ?, ?, ?, ?, ?)";
        jdbc.update(sql, item.getOrderId(), item.getProductId(), item.getProductName(),
                item.getProductCategory(), item.getProductPrice(), item.getProductDescription(), item.getQuantity());
    }

    public Optional<Order> findById(String orderId) {
        String sql = "SELECT * FROM ORDERS WHERE order_id = ?";
        List<Order> result = jdbc.query(sql, orderRowMapper, orderId);
        if (result.isEmpty()) return Optional.empty();
        Order order = result.get(0);
        order.setProducts(findItemsByOrderId(orderId));
        return Optional.of(order);
    }

    public List<Order> findByCustomerId(String customerId) {
        String sql = "SELECT * FROM ORDERS WHERE customer_id = ? ORDER BY order_date DESC";
        List<Order> orders = jdbc.query(sql, orderRowMapper, customerId);
        orders.forEach(o -> o.setProducts(findItemsByOrderId(o.getOrderId())));
        return orders;
    }

    public List<Order> findAll() {
        List<Order> orders = jdbc.query("SELECT * FROM ORDERS ORDER BY order_date DESC", orderRowMapper);
        orders.forEach(o -> o.setProducts(findItemsByOrderId(o.getOrderId())));
        return orders;
    }

    public List<Order> findByStatus(String status) {
        String sql = "SELECT * FROM ORDERS WHERE LOWER(order_status) = LOWER(?) ORDER BY order_date DESC";
        List<Order> orders = jdbc.query(sql, orderRowMapper, status);
        orders.forEach(o -> o.setProducts(findItemsByOrderId(o.getOrderId())));
        return orders;
    }

    public List<OrderItem> findItemsByOrderId(String orderId) {
        return jdbc.query("SELECT * FROM ORDER_ITEMS WHERE order_id = ?", itemRowMapper, orderId);
    }

    public void updateStatus(String orderId, String status) {
        jdbc.update("UPDATE ORDERS SET order_status = ? WHERE order_id = ?", status, orderId);
    }

    public void cancelOrder(String orderId, String reason) {
        String sql = "UPDATE ORDERS SET order_status = 'Cancelled', cancel_reason = ?, cancelled_date = CURRENT_TIMESTAMP WHERE order_id = ?";
        jdbc.update(sql, reason, orderId);
    }

    public void updateOrderDetails(String orderId, String shippingAddress, java.time.LocalDateTime arrivingDate) {
        String sql = "UPDATE ORDERS SET shipping_address = ?, arriving_date = ? WHERE order_id = ?";
        jdbc.update(sql, shippingAddress, arrivingDate, orderId);
    }
}
