package com.hypehouse.cart_service.controller;

import com.hypehouse.cart_service.model.AddItemRequest;
import com.hypehouse.cart_service.model.Cart;
import com.hypehouse.cart_service.model.UpdateQuantityRequest;
import com.hypehouse.cart_service.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/cart")
@RequiredArgsConstructor
public class CartController {
    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @PostMapping("/items/add-product")
    public ResponseEntity<Cart> addItem(@RequestHeader("X-User-ID") String userId, @Valid @RequestBody AddItemRequest request) {
        return ResponseEntity.ok(cartService.addItem(userId, request));
    }

    @PutMapping("/items/update-product/{productId}/{variantSku}/{size}")
    public ResponseEntity<Cart> updateItemQuantity(
            @RequestHeader("X-User-ID") String userId,
            @PathVariable String productId,
            @PathVariable String variantSku,
            @PathVariable String size,
            @Valid @RequestBody UpdateQuantityRequest request
    ) {
        return ResponseEntity.ok(cartService.updateItemQuantity(userId, productId, variantSku, size, request.getQuantity()));
    }

    @DeleteMapping("/items/remove-product/{productId}/{variantSku}/{size}")
    public ResponseEntity<Void> removeItem(
            @RequestHeader("X-User-ID") String userId,
            @PathVariable String productId,
            @PathVariable String variantSku,
            @PathVariable String size
    ) {
        cartService.removeItem(userId, productId, variantSku, size);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/get-cart")
    public ResponseEntity<Cart> getCart(@RequestHeader("X-User-ID") String userId) {
        return ResponseEntity.ok(cartService.getCart(userId));
    }
}