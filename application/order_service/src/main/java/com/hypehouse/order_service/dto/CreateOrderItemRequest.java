package com.hypehouse.order_service.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public class CreateOrderItemRequest {

    @NotNull(message = "Product ID cannot be null")
    private UUID productId;

    @NotBlank(message = "Variant SKU cannot be blank")
    private String variantSku;

    @NotBlank(message = "Size cannot be blank")
    private String size;

    @Min(value = 1, message = "Quantity must be at least 1")
    private int quantity;

    // Getters and Setters
    public UUID getProductId() {
        return productId;
    }

    public void setProductId(UUID productId) {
        this.productId = productId;
    }

    public String getVariantSku() {
        return variantSku;
    }

    public void setVariantSku(String variantSku) {
        this.variantSku = variantSku;
    }

    public String getSize() {
        return size;
    }

    public void setSize(String size) {
        this.size = size;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }
}