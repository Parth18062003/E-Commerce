package com.hypehouse.product_service.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import org.hibernate.validator.constraints.Length;
import org.hibernate.validator.constraints.URL;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.*;

@Document(collection = "products")
public class Product implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @NotNull(message = "ProductID is mandatory")
    private String id;

    @NotBlank(message = "Product name is mandatory")
    @Length(max = 100, message = "Product name must not exceed 100 characters")
    private String name;

    @NotBlank(message = "Description is mandatory")
    @Length(max = 1000, message = "Description must not exceed 1000 characters")
    private String description;

    @NotNull(message = "Price is mandatory")
    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than 0")
    @DecimalMax(value = "99999.99", message = "Price must not exceed 99999.99")
    private Float price;

    @NotBlank(message = "Category is mandatory")
    @Length(max = 50, message = "Category must not exceed 50 characters")
    private String category;

    @NotBlank(message = "Brand is mandatory")
    @Length(max = 50, message = "Brand must not exceed 50 characters")
    private String brand;

    @NotBlank(message = "SKU is mandatory")
    @Length(max = 30, message = "SKU must not exceed 30 characters")
    @Pattern(regexp = "^[A-Za-z0-9-]+$", message = "SKU must contain only letters, numbers, and hyphens")
    private String sku;

    @Length(max = 100, message = "Product status must not exceed 100 characters")
    private String productStatus;

    @Size(max = 20, message = "Cannot have more than 20 tags")
    private List<@Length(max = 30, message = "Tag must not exceed 30 characters") String> tags = new ArrayList<>();

    @DecimalMin(value = "0.0", message = "Rating must be between 0 and 5")
    @DecimalMax(value = "5.0", message = "Rating must be between 0 and 5")
    private Double rating;

    @Min(value = 0, message = "Review count must be zero or greater")
    private int reviewCount;

    @NotNull(message = "Created timestamp is mandatory")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime createdAt = LocalDateTime.now();

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime updatedAt = LocalDateTime.now();

    @DecimalMin(value = "0.0", message = "Discount must be greater than or equal to 0")
    @DecimalMax(value = "100.0", message = "Discount must not exceed 100%")
    private Float discount;

    private boolean isFeatured;

    @Length(max = 50, message = "Dimensions must not exceed 50 characters")
    private String dimensions;

    @Length(max = 20, message = "Weight must not exceed 20 characters")
    private String weight;

    @Size(max = 20, message = "Cannot have more than 20 color options")
    private List<String> colorOptions = new ArrayList<>();

    @JsonProperty("variants")
    @Size(max = 10, message = "Cannot have more than 10 variants")
    private List<Variant> variantList = new ArrayList<>();

    @URL(message = "Product URL must be a valid URL")
    private String productURL;

    @Length(max = 50, message = "Material must not exceed 50 characters")
    private String material;

    @Pattern(regexp = "^\\d{4}-\\d{2}-\\d{2}$", message = "Release date must be in YYYY-MM-DD format")
    private String releaseDate;

    @Pattern(regexp = "^(mens|womens|unisex)$", message = "Gender must be either 'mens', 'womens', or 'unisex'")
    private String gender;

    @Length(max = 50, message = "Type must not exceed 50 characters")
    private String type;

    @Length(max = 50, message = "Manufacturer must not exceed 50 characters")
    private String manufacturer;

    // Getters and Setters
    public Product() {
        this.id = UUID.randomUUID().toString();
        this.productStatus = "Available";
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
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

    public String getSku() {
        return sku;
    }

    public void setSku(String sku) {
        this.sku = sku;
    }

    public String getProductStatus() {
        return productStatus;
    }

    public void setProductStatus(String productStatus) {
        this.productStatus = productStatus;
    }

    public List<String> getTags() {
        return tags;
    }

    public void setTags(List<String> tags) {
        this.tags = tags;
    }

    public Double getRating() {
        return rating;
    }

    public void setRating(Double rating) {
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

    public Float getDiscount() {
        return discount;
    }

    public void setDiscount(Float discount) {
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

    public List<String> getColorOptions() {
        return colorOptions;
    }

    public void setColorOptions(List<String> colorOptions) {
        this.colorOptions = colorOptions;
    }

    public List<Variant> getVariantList() {
        return variantList;
    }

    public void setVariantList(List<Variant> variantList) {
        this.variantList = variantList;
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

    public String getManufacturer() {
        return manufacturer;
    }

    public void setManufacturer(String manufacturer) {
        this.manufacturer = manufacturer;
    }

    // Inner classes for Variant and SizeVariant

    public static class Variant implements Serializable {

        private static final long serialVersionUID = 2L;

        @NotBlank(message = "Color is mandatory for variant")
        private String color;

        @NotNull(message = "Price is mandatory for variant")
        @DecimalMin(value = "0.0", inclusive = false, message = "Variant price must be greater than 0")
        private Float price;

        @DecimalMin(value = "0.0", inclusive = false, message = "Discount must be greater than 0")
        private Float discount;

        @NotNull(message = "Stock quantity is mandatory for variant")
        @Min(value = 0, message = "Variant stock quantity must be zero or greater")
        private Integer stockQuantity;

        @Valid
        @Size(max = 20, message = "Cannot have more than 20 sizes per variant")
        private List<SizeVariant> sizes = new ArrayList<>();

        @Size(max = 10, message = "Cannot have more than 10 images per variant")
        private List<String> colorOptionImages = new ArrayList<>();

        @NotBlank(message = "SKU is mandatory for size variant")
        @Pattern(regexp = "^[A-Za-z0-9-]+$", message = "SKU must contain only letters, numbers, and hyphens")
        @Length(max = 30, message = "SKU must not exceed 30 characters")
        private String sku;
        // Getters and Setters

        public String getColor() {
            return color;
        }

        public void setColor(String color) {
            this.color = color;
        }

        public Float getPrice() {
            return price;
        }

        public void setPrice(Float price) {
            this.price = price;
        }

        public Float getDiscount() {
            return discount;
        }

        public void setDiscount(Float discount) {
            this.discount = discount;
        }

        public Integer getStockQuantity() {
            return stockQuantity;
        }

        public void setStockQuantity(Integer stockQuantity) {
            this.stockQuantity = stockQuantity;
        }

        public List<SizeVariant> getSizes() {
            return sizes;
        }

        public void setSizes(List<SizeVariant> sizes) {
            this.sizes = sizes;
        }

        public List<String> getColorOptionImages() {
            return colorOptionImages;
        }

        public void setColorOptionImages(List<String> colorOptionImages) {
            this.colorOptionImages = colorOptionImages;
        }

        public String getSku() {
            return sku;
        }

        public void setSku(String sku) {
            this.sku = sku;
        }
    }

    public static class SizeVariant implements Serializable {

        @Serial
        private static final long serialVersionUID = 3L;

        @NotBlank(message = "Size is mandatory")
        @Length(max = 10, message = "Size must not exceed 10 characters")
        private String size;

        @NotNull(message = "Stock quantity is mandatory for size variant")
        @Min(value = 0, message = "Size variant stock quantity must be zero or greater")
        private Integer stockQuantity;

        public SizeVariant(String size, Integer stockQuantity) {
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

        public Integer getStockQuantity() {
            return stockQuantity;
        }

        public void setStockQuantity(Integer stockQuantity) {
            this.stockQuantity = stockQuantity;
        }
    }
}