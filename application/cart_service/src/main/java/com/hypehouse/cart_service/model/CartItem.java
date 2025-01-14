package com.hypehouse.cart_service.model;

import com.fasterxml.jackson.annotation.JsonTypeInfo;
import lombok.Data;
import java.io.Serializable;
import java.math.BigDecimal;

@Data
@JsonTypeInfo(use = JsonTypeInfo.Id.CLASS)
public class CartItem implements Serializable {
    private static final long serialVersionUID = 1L;

    private String productId;
    private String variantSku;
    private String size;
    private Integer quantity;

    public CartItem(String productId, String variantSku, String size, String color, Integer quantity, BigDecimal price, BigDecimal discount, String productName, String productUrl, String imageUrl) {
        this.productId = productId;
        this.variantSku = variantSku;
        this.size = size;
        this.quantity = quantity;
    }

    public CartItem() {
    }

    public String getProductId() {
        return productId;
    }

    public void setProductId(String productId) {
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

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }
}