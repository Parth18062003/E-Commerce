package com.hypehouse.product_service;


import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.util.logging.Logger;

@SpringBootApplication(scanBasePackages = {"com.hypehouse"})
public class ProductServiceApplication {

	private static final Logger logger = Logger.getLogger(ProductServiceApplication.class.getName());
	public static void main(String[] args) {
		SpringApplication.run(ProductServiceApplication.class, args);
		logger.info("Product Service Application Started");
	}
}

/*

package com.hypehouse.inventory_service.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Map;

@Document(collection = "inventory")
public class Inventory {

    @Id
    private String id;  // SKU of the product variant, e.g., FV2305-900-100

    private String productId;  // Refers to the product in the Product Collection
    private Variant variant;   // Stores color and sizes with stock quantities
    private int stockQuantity; // Total stock across all sizes
    private int reservedStock; // Reserved stock for active carts/orders
    private int availableStock; // Stock available for sale (stockQuantity - reservedStock)

    private String createdAt;  // Created timestamp
    private String lastUpdated;  // Last updated timestamp

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

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public String getLastUpdated() {
        return lastUpdated;
    }

    public void setLastUpdated(String lastUpdated) {
        this.lastUpdated = lastUpdated;
    }

    public static class Variant {
        private String color;  // The color of the product
        private Map<String, Integer> sizeStock; // Map of size to stock quantity

        // Getters and Setters
        public String getColor() {
            return color;
        }

        public void setColor(String color) {
            this.color = color;
        }

        public Map<String, Integer> getSizeStock() {
            return sizeStock;
        }

        public void setSizeStock(Map<String, Integer> sizeStock) {
            this.sizeStock = sizeStock;
        }
    }
}
*/
