package com.ecommerce.repository;

import com.ecommerce.model.Customer;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.Optional;

@Repository
public class CustomerRepository {

    private final JdbcTemplate jdbc;

    public CustomerRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    private final RowMapper<Customer> rowMapper = (rs, rowNum) -> {
        Customer c = new Customer();
        c.setCustomerId(rs.getString("customer_id"));
        c.setName(rs.getString("name"));
        c.setCountry(rs.getString("country"));
        c.setState(rs.getString("state"));
        c.setCity(rs.getString("city"));
        c.setAddress1(rs.getString("address1"));
        c.setAddress2(rs.getString("address2"));
        c.setZipCode(rs.getString("zip_code"));
        c.setPhoneNumber(rs.getString("phone_number"));
        c.setEmail(rs.getString("email"));
        c.setPassword(rs.getString("password"));
        return c;
    };

    public void save(Customer customer) {
        String sql = "INSERT INTO CUSTOMER (customer_id, name, country, state, city, address1, address2, zip_code, phone_number, email, password) " +
                     "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        jdbc.update(sql,
                customer.getCustomerId(), customer.getName(), customer.getCountry(),
                customer.getState(), customer.getCity(), customer.getAddress1(),
                customer.getAddress2(), customer.getZipCode(), customer.getPhoneNumber(),
                customer.getEmail(), customer.getPassword());
    }

    public Optional<Customer> findById(String customerId) {
        String sql = "SELECT * FROM CUSTOMER WHERE customer_id = ?";
        List<Customer> result = jdbc.query(sql, rowMapper, customerId);
        return result.isEmpty() ? Optional.empty() : Optional.of(result.get(0));
    }

    public Optional<Customer> findByEmail(String email) {
        String sql = "SELECT * FROM CUSTOMER WHERE LOWER(email) = LOWER(?)";
        List<Customer> result = jdbc.query(sql, rowMapper, email);
        return result.isEmpty() ? Optional.empty() : Optional.of(result.get(0));
    }

    public boolean existsByEmail(String email) {
        String sql = "SELECT COUNT(*) FROM CUSTOMER WHERE LOWER(email) = LOWER(?)";
        Integer count = jdbc.queryForObject(sql, Integer.class, email);
        return count != null && count > 0;
    }

    public List<Customer> findAll() {
        return jdbc.query("SELECT * FROM CUSTOMER", rowMapper);
    }

    public void update(Customer customer) {
        String sql = "UPDATE CUSTOMER SET name=?, country=?, state=?, city=?, address1=?, address2=?, " +
                     "zip_code=?, phone_number=?, email=?, password=? WHERE customer_id=?";
        jdbc.update(sql,
                customer.getName(), customer.getCountry(), customer.getState(), customer.getCity(),
                customer.getAddress1(), customer.getAddress2(), customer.getZipCode(),
                customer.getPhoneNumber(), customer.getEmail(), customer.getPassword(),
                customer.getCustomerId());
    }

    public long count() {
        Long count = jdbc.queryForObject("SELECT COUNT(*) FROM CUSTOMER", Long.class);
        return count == null ? 0 : count;
    }
}
