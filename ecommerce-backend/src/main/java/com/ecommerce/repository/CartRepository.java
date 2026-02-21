package com.ecommerce.repository;

import com.ecommerce.model.CartItem;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class CartRepository {

    private final JdbcTemplate jdbc;

    public CartRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    private final RowMapper<CartItem> cartItemRowMapper = (rs, rowNum) -> {
        CartItem ci = new CartItem();
        ci.setCartItemId(rs.getInt("cart_item_id"));
        ci.setCartId(rs.getInt("cart_id"));
        ci.setProductId(rs.getInt("product_id"));
        ci.setProductName(rs.getString("product_name"));
        ci.setProductPrice(rs.getDouble("product_price"));
        ci.setQuantity(rs.getInt("quantity"));
        return ci;
    };

    public Integer getOrCreateCart(String customerId) {
        String select = "SELECT cart_id FROM CART WHERE customer_id = ?";
        List<Integer> ids = jdbc.queryForList(select, Integer.class, customerId);
        if (!ids.isEmpty()) return ids.get(0);
        jdbc.update("INSERT INTO CART (customer_id) VALUES (?)", customerId);
        return jdbc.queryForObject("SELECT cart_id FROM CART WHERE customer_id = ?", Integer.class, customerId);
    }

    public List<CartItem> getCartItems(String customerId) {
        String sql = "SELECT ci.cart_item_id, ci.cart_id, ci.product_id, p.product_name, p.product_price, ci.quantity " +
                     "FROM CART_ITEMS ci " +
                     "JOIN CART c ON ci.cart_id = c.cart_id " +
                     "JOIN PRODUCT p ON ci.product_id = p.product_id " +
                     "WHERE c.customer_id = ?";
        return jdbc.query(sql, cartItemRowMapper, customerId);
    }

    public Optional<CartItem> findCartItem(Integer cartId, Integer productId) {
        String sql = "SELECT ci.cart_item_id, ci.cart_id, ci.product_id, p.product_name, p.product_price, ci.quantity " +
                     "FROM CART_ITEMS ci JOIN PRODUCT p ON ci.product_id = p.product_id " +
                     "WHERE ci.cart_id = ? AND ci.product_id = ?";
        List<CartItem> result = jdbc.query(sql, cartItemRowMapper, cartId, productId);
        return result.isEmpty() ? Optional.empty() : Optional.of(result.get(0));
    }

    public void addToCart(Integer cartId, Integer productId, Integer quantity) {
        jdbc.update("INSERT INTO CART_ITEMS (cart_id, product_id, quantity) VALUES (?, ?, ?)", cartId, productId, quantity);
    }

    public void updateQuantity(Integer cartItemId, Integer quantity) {
        jdbc.update("UPDATE CART_ITEMS SET quantity = ? WHERE cart_item_id = ?", quantity, cartItemId);
    }

    public void removeItem(Integer cartItemId) {
        jdbc.update("DELETE FROM CART_ITEMS WHERE cart_item_id = ?", cartItemId);
    }

    public void clearCart(String customerId) {
        Integer cartId = getOrCreateCart(customerId);
        jdbc.update("DELETE FROM CART_ITEMS WHERE cart_id = ?", cartId);
    }
}
