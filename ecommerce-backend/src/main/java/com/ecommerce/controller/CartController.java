package com.ecommerce.controller;

import com.ecommerce.model.ApiResponse;
import com.ecommerce.model.CartItem;
import com.ecommerce.service.CartService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "http://localhost:4200")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping("/{customerId}")
    public ResponseEntity<ApiResponse<List<CartItem>>> getCart(@PathVariable String customerId) {
        return ResponseEntity.ok(ApiResponse.success("Cart retrieved", cartService.getCart(customerId)));
    }

    @PostMapping("/{customerId}/add")
    public ResponseEntity<ApiResponse<?>> addToCart(@PathVariable String customerId, @RequestBody Map<String, Integer> body) {
        Integer productId = body.get("productId");
        Integer quantity = body.getOrDefault("quantity", 1);
        String result = cartService.addToCart(customerId, productId, quantity);
        if ("success".equals(result)) return ResponseEntity.ok(ApiResponse.success("Added to cart", null));
        return ResponseEntity.badRequest().body(ApiResponse.error(result));
    }

    @PutMapping("/{customerId}/update/{cartItemId}")
    public ResponseEntity<ApiResponse<?>> updateQuantity(@PathVariable String customerId,
                                                          @PathVariable Integer cartItemId,
                                                          @RequestBody Map<String, Integer> body) {
        String result = cartService.updateQuantity(customerId, cartItemId, body.get("quantity"));
        if ("success".equals(result)) return ResponseEntity.ok(ApiResponse.success("Cart updated", null));
        return ResponseEntity.badRequest().body(ApiResponse.error(result));
    }

    @DeleteMapping("/{customerId}/remove/{cartItemId}")
    public ResponseEntity<ApiResponse<?>> removeItem(@PathVariable String customerId, @PathVariable Integer cartItemId) {
        String result = cartService.removeItem(customerId, cartItemId);
        if ("success".equals(result)) return ResponseEntity.ok(ApiResponse.success("Item removed from cart", null));
        return ResponseEntity.badRequest().body(ApiResponse.error(result));
    }

    @DeleteMapping("/{customerId}/clear")
    public ResponseEntity<ApiResponse<?>> clearCart(@PathVariable String customerId) {
        cartService.clearCart(customerId);
        return ResponseEntity.ok(ApiResponse.success("Cart cleared", null));
    }
}
