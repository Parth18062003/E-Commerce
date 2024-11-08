package com.hypehouse.product_service.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.*;
import org.hibernate.validator.constraints.Length;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Document(collection = "products")
public class Product implements Serializable {

    @Id
    @NotNull(message = "Product ID is mandatory")
    @Field(name = "id")
    private String id;

    @NotBlank(message = "Product name is mandatory")
    @Length(max = 100, message = "Product name must not exceed 100 characters")
    private String name;

    @NotBlank(message = "Description is mandatory")
    @Length(max = 1000, message = "Description must not exceed 500 characters")
    private String description;

    @NotNull(message = "Price is mandatory")
    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than 0")
    private BigDecimal price;

    @NotBlank(message = "Category is mandatory")
    @Length(max = 50, message = "Category must not exceed 50 characters")
    private String category;

    @NotBlank(message = "Brand is mandatory")
    @Length(max = 50, message = "Brand must not exceed 50 characters")
    private String brand;

    @NotNull(message = "Stock quantity is mandatory")
    @DecimalMin(value = "0", message = "Stock quantity must be zero or greater")
    private Integer stockQuantity;

    @NotBlank(message = "SKU is mandatory")
    @Length(max = 30, message = "SKU must not exceed 30 characters")
    private String sku; // Stock Keeping Unit

    private boolean isActive = true; // Whether the product is available for sale

    private List<@Size(max = 30, message = "Tags must not exceed 30 characters each") String> tags; // Optional tags for search/filtering

    @DecimalMin(value = "0.0", message = "Rating must be between 0 and 5")
    @DecimalMin(value = "0.0", message = "Rating must be between 0 and 5")
    @DecimalMax(value = "5.0", message = "Rating must be between 0 and 5")
    private double rating; // Average rating (0-5 scale)

    @NotNull(message = "Review count is mandatory")
    @DecimalMin(value = "0", message = "Review count must be zero or greater")
    private int reviewCount; // Number of reviews

    @NotNull(message = "Created timestamp is mandatory")
    private LocalDateTime createdAt; // Timestamp when the product was created

    private LocalDateTime updatedAt; // Timestamp when the product was last updated

    @DecimalMin(value = "0.0", message = "Discount must be greater than or equal to 0")
    private BigDecimal discount; // Discount amount

    private boolean isFeatured; // Indicates if the product is featured

    @Size(max = 50, message = "Dimensions must not exceed 50 characters")
    private String dimensions; // Dimensions for shipping

    @Size(max = 20, message = "Weight must not exceed 20 characters")
    private String weight; // Weight for shipping

    private List<String> colorOptions; // List of color names
    private Map<String, List<String>> colorOptionImages; // Map of color names to list of image URLs
    private List<String> sizes;
    // Constructors, Getters, and Setters

    public Product() {
        this.id = UUID.randomUUID().toString();; // Automatically generate a new UUID
        this.createdAt = LocalDateTime.now(); // Set created timestamp
        this.updatedAt = LocalDateTime.now(); // Set updated timestamp
    }

    // Getters and Setters...

    public String getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id.toString();
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public Integer getStockQuantity() {
        return stockQuantity;
    }

    public void setStockQuantity(Integer stockQuantity) {
        this.stockQuantity = stockQuantity;
    }

    public String getSku() {
        return sku;
    }

    public void setSku(String sku) {
        this.sku = sku;
    }

    public List<String> getColorOptions() {
        return colorOptions;
    }

    public void setColorOptions(List<String> colorOptions) {
        this.colorOptions = colorOptions;
    }

    public Map<String, List<String>> getColorOptionImages() {
        return colorOptionImages;
    }

    public void setColorOptionImages(Map<String, List<String>> colorOptionImages) {
        this.colorOptionImages = colorOptionImages;
    }

    public List<String> getSizes() {
        return sizes;
    }

    public void setSizes(List<String> sizes) {
        this.sizes = sizes;
    }

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean active) {
        isActive = active;
    }

    public List<String> getTags() {
        return tags;
    }

    public void setTags(List<String> tags) {
        this.tags = tags;
    }

    public double getRating() {
        return rating;
    }

    public void setRating(double rating) {
        this.rating = rating;
    }

    public int getReviewCount() {
        return reviewCount;
    }

    public void setReviewCount(int reviewCount) {
        this.reviewCount = reviewCount;
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

    public BigDecimal getDiscount() {
        return discount;
    }

    public void setDiscount(BigDecimal discount) {
        this.discount = discount;
    }

    public boolean isFeatured() {
        return isFeatured;
    }

    public void setFeatured(boolean featured) {
        isFeatured = featured;
    }

    public String getDimensions() {
        return dimensions;
    }

    public void setDimensions(String dimensions) {
        this.dimensions = dimensions;
    }

    public String getWeight() {
        return weight;
    }

    public void setWeight(String weight) {
        this.weight = weight;
    }
}
