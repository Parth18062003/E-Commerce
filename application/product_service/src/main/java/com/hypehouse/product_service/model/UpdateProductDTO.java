/*
package com.hypehouse.product_service.model;

import jakarta.validation.constraints.*;
import org.hibernate.validator.constraints.Length;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public class UpdateProductDTO {

    @Length(max = 100, message = "Product name must not exceed 100 characters")
    private String name;

    @Length(max = 500, message = "Description must not exceed 500 characters")
    private String description;

    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than 0")
    private BigDecimal price;

    @Length(max = 50, message = "Category must not exceed 50 characters")
    private String category;

    @Length(max = 50, message = "Brand must not exceed 50 characters")
    private String brand;

    @DecimalMin(value = "0", message = "Stock quantity must be zero or greater")
    private Integer stockQuantity;

    @Length(max = 30, message = "SKU must not exceed 30 characters")
    private String sku; // Stock Keeping Unit

    private boolean isActive; // Whether the product is available for sale

    private List<@Size(max = 30, message = "Tags must not exceed 30 characters each") String> tags; // Optional tags for search/filtering

    @DecimalMin(value = "0.0", message = "Rating must be between 0 and 5")
    @DecimalMin(value = "0.0", message = "Rating must be between 0 and 5")
    @DecimalMax(value = "5.0", message = "Rating must be between 0 and 5")
    private double rating; // Average rating (0-5 scale)

    @DecimalMin(value = "0", message = "Review count must be zero or greater")
    private int reviewCount; // Number of reviews

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
    // Getters and Setters

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
*/
package com.hypehouse.product_service.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.*;
import org.hibernate.validator.constraints.Length;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public class UpdateProductDTO {

    @Length(max = 100, message = "Product name must not exceed 100 characters")
    private String name;

    @Length(max = 1000, message = "Description must not exceed 1000 characters")
    private String description;

    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than 0")
    private Float price;

    @Length(max = 50, message = "Category must not exceed 50 characters")
    private String category;

    @Length(max = 50, message = "Brand must not exceed 50 characters")
    private String brand;

    @DecimalMin(value = "0", message = "Stock quantity must be zero or greater")
    private Integer stockQuantity;

    @Length(max = 30, message = "SKU must not exceed 30 characters")
    private String sku;

    private boolean isActive;

    @Size(max = 20, message = "Cannot have more than 20 tags")
    private List<@Size(max = 30, message = "Tag must not exceed 30 characters") String> tags;

    @DecimalMin(value = "0.0", message = "Rating must be between 0 and 5")
    @DecimalMax(value = "5.0", message = "Rating must be between 0 and 5")
    private double rating;

    @DecimalMin(value = "0", message = "Review count must be zero or greater")
    private int reviewCount;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime updatedAt;

    @DecimalMin(value = "0.0", message = "Discount must be greater than or equal to 0")
    @DecimalMax(value = "100.0", message = "Discount must not exceed 100%")
    private Float discount;

    private boolean isFeatured;

    @Size(max = 50, message = "Dimensions must not exceed 50 characters")
    private String dimensions;

    @Size(max = 20, message = "Weight must not exceed 20 characters")
    private String weight;

    private List<String> colorOptions;

    private Map<String, List<String>> colorOptionImages;

    @Size(max = 20, message = "Cannot have more than 20 sizes")
    private List<String> sizes;

    private String productURL;

    @Length(max = 50, message = "Material must not exceed 50 characters")
    private String material;

    @Pattern(regexp = "^\\d{4}-\\d{2}-\\d{2}$", message = "Release date must be in YYYY-MM-DD format")
    private String releaseDate;

    @Pattern(regexp = "^(mens|womens|unisex)$", message = "Gender must be either 'mens', 'womens', or 'unisex'")
    private String gender;

    @Length(max = 50, message = "Type must not exceed 50 characters")
    private String type;

    private List<Product.Variant> variantList;

    // Getters and Setters

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

    public Float getPrice() {
        return price;
    }

    public void setPrice(Float price) {
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

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean isActive) {
        this.isActive = isActive;
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

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Float getDiscount() {
        return discount;
    }

    public void setDiscount(Float discount) {
        this.discount = discount;
    }

    public boolean isFeatured() {
        return isFeatured;
    }

    public void setFeatured(boolean isFeatured) {
        this.isFeatured = isFeatured;
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

    public String getProductURL() {
        return productURL;
    }

    public void setProductURL(String productURL) {
        this.productURL = productURL;
    }

    public String getMaterial() {
        return material;
    }

    public void setMaterial(String material) {
        this.material = material;
    }

    public String getReleaseDate() {
        return releaseDate;
    }

    public void setReleaseDate(String releaseDate) {
        this.releaseDate = releaseDate;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public List<Product.Variant> getVariantList() {
        return variantList;
    }

    public void setVariantList(List<Product.Variant> variantList) {
        this.variantList = variantList;
    }
}
