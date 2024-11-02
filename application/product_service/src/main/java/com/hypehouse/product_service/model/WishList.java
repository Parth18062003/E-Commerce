package com.hypehouse.product_service.model;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Document(collection = "wishlist")
public class WishList {
    private static final Logger logger = LoggerFactory.getLogger(WishList.class); // Logger instance

    @Id
    private String id;

    @NotNull(message = "User ID is mandatory")
    private String userId;

    @NotEmpty(message = "Product list cannot be empty")
    private List<String> productIds = new ArrayList<>(); // Store only product IDs

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Default constructor
    public WishList() {
        this.id = UUID.randomUUID().toString();
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    // Parameterized constructor
    public WishList(String userId, List<String> productIds) {
        this.id = UUID.randomUUID().toString();
        this.userId = userId;
        this.productIds = productIds != null ? productIds : new ArrayList<>();
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public List<String> getProductIds() {
        return productIds;
    }

    public void setProductIds(List<String> productIds) {
        this.productIds = productIds != null ? productIds : new ArrayList<>();
        this.updatedAt = LocalDateTime.now(); // Update timestamp
        logger.info("Product IDs set: {}", this.productIds);
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    // Method to add a product ID to the wishlist
    public void addProduct(String productId) {
        if (productId != null) {
            productId = productId.trim(); // Trim any whitespace
            logger.info("Attempting to add Product ID: {}", productId);
            if (!productIds.contains(productId)) {
                productIds.add(productId);
                updatedAt = LocalDateTime.now(); // Update timestamp
                logger.info("Product ID added: {}", productId);
            } else {
                logger.warn("Product ID already exists in the wishlist: {}", productId);
            }
        } else {
            logger.error("Null product ID cannot be added.");
        }
    }

    // Method to remove a product ID from the wishlist
    public void removeProduct(String productId) {
        if (productId != null) {
            productId = productId.trim(); // Trim any whitespace
            logger.info("Attempting to remove Product ID: {}", productId);
            if (productIds.remove(productId)) {
                updatedAt = LocalDateTime.now(); // Update timestamp
                logger.info("Product ID removed: {}", productId);
            } else {
                logger.warn("Product ID not found in the wishlist: {}", productId);
            }
        } else {
            logger.error("Null product ID cannot be removed.");
        }
    }

    @Override
    public String toString() {
        return "WishList{" +
                "id='" + id + '\'' +
                ", userId='" + userId + '\'' +
                ", productIds=" + productIds +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof WishList)) return false;
        WishList wishList = (WishList) o;
        return id.equals(wishList.id);
    }

    @Override
    public int hashCode() {
        return id.hashCode();
    }
}
