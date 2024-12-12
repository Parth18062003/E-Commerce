package com.hypehouse.common.model;

import java.io.Serializable;
import java.util.List;

public class ProductDTO implements Serializable {
    private String id;
    private String sku;
    private List<VariantDTO> variants; // This will store variant details (size and stock)

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getSku() {
        return sku;
    }

    public void setSku(String sku) {
        this.sku = sku;
    }

    public List<VariantDTO> getVariants() {
        return variants;
    }

    public void setVariants(List<VariantDTO> variants) {
        this.variants = variants;
    }

    // Inner class for VariantDTO
    public static class VariantDTO {
        private String sku; // Variant SKU
        private String color; // Color information (optional)
        private List<SizeDTO> sizes; // List of sizes for this variant

        // Getters and Setters
        public String getSku() {
            return sku;
        }

        public void setSku(String sku) {
            this.sku = sku;
        }

        public String getColor() {
            return color;
        }

        public void setColor(String color) {
            this.color = color;
        }

        public List<SizeDTO> getSizes() {
            return sizes;
        }

        public void setSizes(List<SizeDTO> sizes) {
            this.sizes = sizes;
        }
    }

    // Inner class for SizeDTO (size and stock quantity)
    public static class SizeDTO {
        private String size;
        private int stockQuantity; // Stock quantity for this size

        // Getters and Setters
        public String getSize() {
            return size;
        }

        public void setSize(String size) {
            this.size = size;
        }

        public int getStockQuantity() {
            return stockQuantity;
        }

        public void setStockQuantity(int stockQuantity) {
            this.stockQuantity = stockQuantity;
        }
    }
}
