package com.hypehouse.inventory_service.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "inventory")
public class Inventory {

    @Id
    private String id;  // SKU of the product variant, e.g., FV2305-900-100

    private String productId;  // Refers to the product in the Product Collection
    private Variant variant;   // Stores color and sizes with stock quantities
    private String variantSku;
    private int stockQuantity; // Total stock across all sizes
    private int reservedStock; // Reserved stock for active carts/orders
    private int availableStock; // Stock available for sale (stockQuantity - reservedStock)

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime createdAt = LocalDateTime.now();

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime updatedAt = LocalDateTime.now();

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getProductId() {
        return productId;
    }

    public void setProductId(String productId) {
        this.productId = productId;
    }

    public Variant getVariant() {
        return variant;
    }

    public void setVariant(Variant variant) {
        this.variant = variant;
    }

    public String getVariantSku() {
        return variantSku;
    }

    public void setVariantSku(String variantSku) {
        this.variantSku = variantSku;
    }

    public int getStockQuantity() {
        return stockQuantity;
    }

    public void setStockQuantity(int stockQuantity) {
        this.stockQuantity = stockQuantity;
    }

    public int getReservedStock() {
        return reservedStock;
    }

    public void setReservedStock(int reservedStock) {
        this.reservedStock = reservedStock;
    }

    public int getAvailableStock() {
        return availableStock;
    }

    public void setAvailableStock(int availableStock) {
        this.availableStock = availableStock;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public static class Variant {
        private String color;  // The color of the product
        private List<SizeStock> sizeStock; // List of size-stock pairs

        // Getters and Setters
        public String getColor() {
            return color;
        }

        public void setColor(String color) {
            this.color = color;
        }

        public List<SizeStock> getSizeStock() {
            return sizeStock;
        }

        public void setSizeStock(List<SizeStock> sizeStock) {
            this.sizeStock = sizeStock;
        }
    }

    public static class SizeStock {
        private String size;
        private int stockQuantity;
        private int reservedStock;

        // Constructors
        public SizeStock() {}

        public SizeStock(String size, int stockQuantity) {
            this.size = size;
            this.stockQuantity = stockQuantity;
        }

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

        public int getReservedStock() {
            return reservedStock;
        }

        public void setReservedStock(int reservedStock) {
            this.reservedStock = reservedStock;
        }
    }
}