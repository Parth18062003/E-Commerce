package com.hypehouse.cart_service.model;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;

@Data
public class AddItemRequest implements Serializable {
    @NotNull
    private String product_id;

    @NotNull
    private String variant_sku;

    @NotNull
    private String size;

    @NotNull
    @Min(1)
    private Integer quantity;

    public AddItemRequest(String product_id, String variant_sku, String size, String color, Integer quantity, BigDecimal price, BigDecimal discount, String productName, String productUrl, String imageUrl) {
        this.product_id = product_id;
        this.variant_sku = variant_sku;
        this.size = size;
        this.quantity = quantity;
    }

    public AddItemRequest() {
    }

    public String getProduct_id() {
        return product_id;
    }

    public void setProduct_id(String product_id) {
        this.product_id = product_id;
    }

    public String getVariant_sku() {
        return variant_sku;
    }

    public void setVariant_sku(String variant_sku) {
        this.variant_sku = variant_sku;
    }

    public String getSize() {
        return size;
    }

    public void setSize(String size) {
        this.size = size;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }
}