package com.hypehouse.order_service.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import java.util.UUID;

public class CreateOrderRequest {

    @NotNull(message = "User ID cannot be null")
    private UUID userId;

    @NotEmpty(message = "Order must contain at least one item")
    @Valid // This annotation triggers validation on the objects within the list
    private List<CreateOrderItemRequest> items;

    @NotNull(message = "Shipping address cannot be null")
    private String shippingAddress;

    // Getters and Setters
    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public List<CreateOrderItemRequest> getItems() {
        return items;
    }

    public void setItems(List<CreateOrderItemRequest> items) {
        this.items = items;
    }

    public String getShippingAddress() {
        return shippingAddress;
    }

    public void setShippingAddress(String shippingAddress) {
        this.shippingAddress = shippingAddress;
    }
}