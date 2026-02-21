package com.ecommerce.repository;

import com.ecommerce.model.Invoice;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class InvoiceRepository {

    private final JdbcTemplate jdbc;

    public InvoiceRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    private final RowMapper<Invoice> rowMapper = (rs, rowNum) -> {
        Invoice inv = new Invoice();
        inv.setInvoiceId(rs.getInt("invoice_id"));
        inv.setTransactionId(rs.getString("transaction_id"));
        inv.setOrderId(rs.getString("order_id"));
        inv.setCustomerId(rs.getString("customer_id"));
        inv.setTotalAmount(rs.getDouble("total_amount"));
        inv.setPaymentMode(rs.getString("payment_mode"));
        inv.setPaymentTimestamp(rs.getTimestamp("payment_timestamp") != null ? rs.getTimestamp("payment_timestamp").toLocalDateTime() : null);
        return inv;
    };

    public void save(Invoice invoice) {
        String sql = "INSERT INTO INVOICE (transaction_id, order_id, customer_id, total_amount, payment_mode, payment_timestamp) " +
                     "VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)";
        jdbc.update(sql, invoice.getTransactionId(), invoice.getOrderId(),
                invoice.getCustomerId(), invoice.getTotalAmount(), invoice.getPaymentMode());
    }

    public Optional<Invoice> findByOrderId(String orderId) {
        List<Invoice> result = jdbc.query("SELECT * FROM INVOICE WHERE order_id = ?", rowMapper, orderId);
        return result.isEmpty() ? Optional.empty() : Optional.of(result.get(0));
    }
}
