package com.ecommerce.service;

import com.ecommerce.model.CartItem;
import com.ecommerce.model.Product;
import com.ecommerce.repository.CartRepository;
import com.ecommerce.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final ProductRepository productRepository;

    public CartService(CartRepository cartRepository, ProductRepository productRepository) {
        this.cartRepository = cartRepository;
        this.productRepository = productRepository;
    }

    public List<CartItem> getCart(String customerId) {
        return cartRepository.getCartItems(customerId);
    }

    public String addToCart(String customerId, Integer productId, Integer quantity) {
        Optional<Product> productOpt = productRepository.findById(productId);
        if (productOpt.isEmpty()) return "Product not found";
        Product product = productOpt.get();
        if (product.getQuantityAvailable() < quantity) return "Insufficient stock";

        Integer cartId = cartRepository.getOrCreateCart(customerId);
        Optional<CartItem> existing = cartRepository.findCartItem(cartId, productId);

        if (existing.isPresent()) {
            int newQty = existing.get().getQuantity() + quantity;
            if (newQty > product.getQuantityAvailable()) return "Product limit exceeded";
            cartRepository.updateQuantity(existing.get().getCartItemId(), newQty);
        } else {
            cartRepository.addToCart(cartId, productId, quantity);
        }
        return "success";
    }

    public String updateQuantity(String customerId, Integer cartItemId, Integer quantity) {
        List<CartItem> items = cartRepository.getCartItems(customerId);
        Optional<CartItem> itemOpt = items.stream().filter(ci -> ci.getCartItemId().equals(cartItemId)).findFirst();
        if (itemOpt.isEmpty()) return "Item not found";

        CartItem item = itemOpt.get();
        Optional<Product> productOpt = productRepository.findById(item.getProductId());
        if (productOpt.isEmpty()) return "Product not found";

        if (quantity > productOpt.get().getQuantityAvailable()) return "Product limit exceeded";
        if (quantity < 1) return "Unable to delete product any further: Minimum quantity reached";

        cartRepository.updateQuantity(cartItemId, quantity);
        return "success";
    }

    public String removeItem(String customerId, Integer cartItemId) {
        List<CartItem> items = cartRepository.getCartItems(customerId);
        Optional<CartItem> itemOpt = items.stream().filter(ci -> ci.getCartItemId().equals(cartItemId)).findFirst();
        if (itemOpt.isEmpty()) return "Item not found in cart";
        cartRepository.removeItem(cartItemId);
        return "success";
    }

    public void clearCart(String customerId) {
        cartRepository.clearCart(customerId);
    }
}
