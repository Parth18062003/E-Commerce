package com.hypehouse.common.model;

import java.io.Serializable;
import java.util.Map;

public class InventoryUpdateMessage implements Serializable {
    private String productId;
    private String variantSku;
    private Map<String, Integer> sizeStockMap;

    // Getters and setters
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

    public Map<String, Integer> getSizeStockMap() {
        return sizeStockMap;
    }

    public void setSizeStockMap(Map<String, Integer> sizeStockMap) {
        this.sizeStockMap = sizeStockMap;
    }

    @Override
    public String toString() {
        return "InventoryUpdateMessage{" +
                "productId='" + productId + '\'' +
                ", variantSku='" + variantSku + '\'' +
                ", sizeStockMap=" + sizeStockMap +
                '}';
    }
}