package com.ecommerce.repository;

import com.ecommerce.model.Product;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class ProductRepository {

    private final JdbcTemplate jdbc;

    public ProductRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    private final RowMapper<Product> rowMapper = (rs, rowNum) -> {
        Product p = new Product();
        p.setProductId(rs.getInt("product_id"));
        p.setProductName(rs.getString("product_name"));
        p.setProductImage(rs.getString("product_image"));
        p.setProductPrice(rs.getDouble("product_price"));
        p.setProductCategory(rs.getString("product_category"));
        p.setProductDescription(rs.getString("product_description"));
        p.setQuantityAvailable(rs.getInt("quantity_available"));
        p.setProductStatus(rs.getString("product_status"));
        p.setIsDeleted(rs.getBoolean("is_deleted"));
        return p;
    };

    public void save(Product product) {
        String sql = "INSERT INTO PRODUCT (product_name, product_image, product_price, product_category, product_description, quantity_available, product_status, is_deleted) " +
                     "VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        jdbc.update(sql, product.getProductName(), product.getProductImage(),
                product.getProductPrice(), product.getProductCategory(),
                product.getProductDescription(), product.getQuantityAvailable(),
                product.getProductStatus(), false);
    }

    public Optional<Product> findById(Integer productId) {
        String sql = "SELECT * FROM PRODUCT WHERE product_id = ?";
        List<Product> result = jdbc.query(sql, rowMapper, productId);
        return result.isEmpty() ? Optional.empty() : Optional.of(result.get(0));
    }

    public List<Product> findByNameContaining(String name) {
        String sql = "SELECT * FROM PRODUCT WHERE LOWER(product_name) LIKE LOWER(?)";
        return jdbc.query(sql, rowMapper, "%" + name + "%");
    }

    public boolean existsByName(String name) {
        String sql = "SELECT COUNT(*) FROM PRODUCT WHERE LOWER(product_name) = LOWER(?)";
        Integer count = jdbc.queryForObject(sql, Integer.class, name);
        return count != null && count > 0;
    }

    // All products including soft-deleted (for admin)
    public List<Product> findAll() {
        return jdbc.query("SELECT * FROM PRODUCT", rowMapper);
    }

    // Only active, non-deleted products (for customers)
    public List<Product> findAllActive() {
        return jdbc.query("SELECT * FROM PRODUCT WHERE is_deleted = FALSE AND LOWER(product_status) = 'active'", rowMapper);
    }

    public List<Product> findByCategory(String category) {
        String sql = "SELECT * FROM PRODUCT WHERE LOWER(product_category) = LOWER(?) AND is_deleted = FALSE AND LOWER(product_status) = 'active'";
        return jdbc.query(sql, rowMapper, category);
    }

    public void update(Product product) {
        String sql = "UPDATE PRODUCT SET product_name=?, product_price=?, product_category=?, product_description=?, quantity_available=?, product_status=? WHERE product_id=?";
        jdbc.update(sql, product.getProductName(), product.getProductPrice(),
                product.getProductCategory(), product.getProductDescription(),
                product.getQuantityAvailable(), product.getProductStatus(), product.getProductId());
    }

    public void softDelete(Integer productId) {
        jdbc.update("UPDATE PRODUCT SET is_deleted = TRUE, product_status = 'Inactive' WHERE product_id = ?", productId);
    }

    public void restoreProduct(Integer productId) {
        jdbc.update("UPDATE PRODUCT SET is_deleted = FALSE, product_status = 'Active' WHERE product_id = ?", productId);
    }

    public void decreaseQuantity(Integer productId, Integer qty) {
        jdbc.update("UPDATE PRODUCT SET quantity_available = quantity_available - ? WHERE product_id = ?", qty, productId);
    }

    public List<String> findDistinctCategories() {
        return jdbc.queryForList("SELECT DISTINCT product_category FROM PRODUCT WHERE is_deleted = FALSE AND LOWER(product_status) = 'active'", String.class);
    }

    public long count() {
        Long count = jdbc.queryForObject("SELECT COUNT(*) FROM PRODUCT", Long.class);
        return count == null ? 0 : count;
    }
}
