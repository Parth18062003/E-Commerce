package com.hypehouse.cart_service.service;

import com.hypehouse.cart_service.exception.CartException;
import com.hypehouse.cart_service.model.AddItemRequest;
import com.hypehouse.cart_service.model.Cart;
import com.hypehouse.cart_service.model.CartItem;
import com.hypehouse.cart_service.repository.CartRepository;
import com.hypehouse.common.grpc.InventoryServiceGrpc;
import com.hypehouse.common.grpc.ReserveStockRequest;
import com.hypehouse.common.grpc.ReserveStockResponse;
import com.hypehouse.common.grpc.ReleaseStockRequest;
import io.grpc.StatusRuntimeException;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class CartService {
    private final CartRepository cartRepository;
    private final InventoryServiceGrpc.InventoryServiceBlockingStub inventoryStub;
    private static final Logger log = LoggerFactory.getLogger(CartService.class);

    @Value("${cart.max.items.per.cart:10}")
    private int maxItemsPerCart;

    public CartService(CartRepository cartRepository, InventoryServiceGrpc.InventoryServiceBlockingStub inventoryStub) {
        this.cartRepository = cartRepository;
        this.inventoryStub = inventoryStub;
        log.info("InventoryServiceGrpc.InventoryServiceBlockingStub initialized: {}", inventoryStub);
    }

    public Cart addItem(String userId, @Valid AddItemRequest request) {
        if (request.getQuantity() <= 0) {
            throw new CartException("Quantity must be greater than 0");
        }

        Cart cart = cartRepository.findByUserId(userId);
        if (cart == null) {
            cart = createNewCart(userId);
        }

        if (cart.getItems().size() >= maxItemsPerCart) {
            throw new CartException("Cart has reached maximum capacity");
        }

        CartItem existingItem = findExistingItem(cart, request);
        int totalQuantity = calculateTotalQuantity(existingItem, request.getQuantity());

        reserveInventory(request, totalQuantity, cart.getId());

        if (existingItem != null) {
            existingItem.setQuantity(totalQuantity);
        } else {
            addNewItem(cart, request);
        }

        return cartRepository.save(cart);
    }

    public Cart updateItemQuantity(String userId, String productId, String variantSku, String size, int newQuantity) {
        if (newQuantity <= 0) {
            throw new CartException("Quantity must be greater than 0");
        }

        Cart cart = getCart(userId);
        CartItem item = findCartItem(cart, productId, variantSku, size);
        handleQuantityChange(cart.getId(), item, newQuantity);
        item.setQuantity(newQuantity);

        return cartRepository.save(cart);
    }

    public void removeItem(String userId, String productId, String variantSku, String size) {
        Cart cart = getCart(userId);
        CartItem item = findCartItem(cart, productId, variantSku, size);
        releaseInventory(item, cart.getId());
        cart.getItems().remove(item);
        cartRepository.save(cart);
    }

    public Cart getCart(String userId) {
        Cart cart = cartRepository.findByUserId(userId);
        if (cart != null && cart.getExpiresAt().isBefore(LocalDateTime.now())) {
            log.info("Cart for user {} has expired. Deleting cart.", userId);
            cartRepository.delete(userId);
            cart = null;
        }
        return cart != null ? cart : createNewCart(userId);
    }

    private CartItem findExistingItem(Cart cart, AddItemRequest request) {
        return cart.getItems().stream()
                .filter(item -> item.getProductId().equals(request.getProduct_id())
                        && item.getVariantSku().equals(request.getVariant_sku())
                        && item.getSize().equals(request.getSize()))
                .findFirst()
                .orElse(null);
    }

    private void reserveInventory(AddItemRequest request, int quantity, String cartId) {
        try {
            ReserveStockResponse response = inventoryStub.reserveStock(
                    ReserveStockRequest.newBuilder()
                            .setProductId(request.getProduct_id())
                            .setVariantSku(request.getVariant_sku())
                            .setSize(request.getSize())
                            .setQuantity(quantity)
                            .setCartId(cartId)
                            .build()
            );

            if (!response.getSuccess()) {
                throw new CartException("Failed to reserve inventory: " + response.getMessage());
            }
        } catch (StatusRuntimeException e) {
            log.error("gRPC error while reserving inventory: {}", e.getStatus().getDescription());
            throw new CartException("gRPC error: " + e.getStatus().getDescription());
        } catch (Exception e) {
            log.error("Error reserving inventory: {}", e.getMessage());
            throw new CartException("Error reserving inventory");
        }
    }

    private void releaseInventory(CartItem item, String cartId) {
        try {
            inventoryStub.releaseStock(
                    ReleaseStockRequest.newBuilder()
                            .setProductId(item.getProductId())
                            .setVariantSku(item.getVariantSku())
                            .setSize(item.getSize())
                            .setQuantity(item.getQuantity())
                            .setCartId(cartId)
                            .build()
            );
        } catch (Exception e) {
            log.error("Failed to release inventory: {}", e.getMessage());
            throw new CartException("Error releasing inventory");
        }
    }

    private void handleQuantityChange(String cartId, CartItem item, int newQuantity) {
        if (newQuantity > item.getQuantity()) {
            reserveInventory(mapToRequest(item), newQuantity - item.getQuantity(), cartId);
        } else if (newQuantity < item.getQuantity()) {
            releaseInventory(item, cartId);
        }
    }

    private Cart createNewCart(String userId) {
        Cart cart = new Cart();
        cart.setId(UUID.randomUUID().toString());
        cart.setUserId(userId);
        cart.setCreatedAt(LocalDateTime.now());
        cart.setExpiresAt(LocalDateTime.now().plusDays(15));
        return cartRepository.save(cart);
    }

    private CartItem findCartItem(Cart cart, String productId, String variantSku, String size) {
        return cart.getItems().stream()
                .filter(item -> item.getProductId().equals(productId)
                        && item.getVariantSku().equals(variantSku)
                        && item.getSize().equals(size))
                .findFirst()
                .orElseThrow(() -> new CartException("Item not found in cart"));
    }

    private AddItemRequest mapToRequest(CartItem item) {
        AddItemRequest request = new AddItemRequest();
        request.setProduct_id(item.getProductId());
        request.setVariant_sku(item.getVariantSku());
        request.setSize(item.getSize());
        request.setQuantity(item.getQuantity());
        return request;
    }

    private int calculateTotalQuantity(CartItem existingItem, int newQuantity) {
        return (existingItem != null) ? existingItem.getQuantity() + newQuantity : newQuantity;
    }

    private void addNewItem(Cart cart, AddItemRequest request) {
        CartItem newItem = new CartItem();
        newItem.setProductId(request.getProduct_id());
        newItem.setVariantSku(request.getVariant_sku());
        newItem.setSize(request.getSize());
        newItem.setQuantity(request.getQuantity());
        cart.getItems().add(newItem);
    }
}