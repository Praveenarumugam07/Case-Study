package com.ecommerce.repository;

import com.ecommerce.model.Admin;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class AdminRepository {

    private final JdbcTemplate jdbc;

    public AdminRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    private final RowMapper<Admin> rowMapper = (rs, rowNum) -> {
        Admin a = new Admin();
        a.setAdminId(rs.getString("admin_id"));
        a.setUsername(rs.getString("username"));
        a.setPassword(rs.getString("password"));
        return a;
    };

    public Optional<Admin> findById(String adminId) {
        String sql = "SELECT * FROM ADMIN WHERE admin_id = ?";
        List<Admin> result = jdbc.query(sql, rowMapper, adminId);
        return result.isEmpty() ? Optional.empty() : Optional.of(result.get(0));
    }

    public void updatePassword(String adminId, String encodedPassword) {
        jdbc.update("UPDATE ADMIN SET password = ? WHERE admin_id = ?", encodedPassword, adminId);
    }
}
