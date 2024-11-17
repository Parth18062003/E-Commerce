/*
package com.hypehouse.product_service.model;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.UUID;

public class IndexableProduct {

    private String objectID;
    private String name;
    private String description;
    private BigDecimal price;
    private BigDecimal discount;
    private String sku;
    private List<String> tags;
    private String category;
    private String brand;
    private List<String> colorOptions;
    private Map<String, List<String>> colorOptionImages; // Map of color names to list of image URLs
    private List<String> sizes;

    public IndexableProduct() {
        this.objectID = UUID.randomUUID().toString(); // Automatically generate a new UUID
    }

    public String getObjectID() {
        return objectID;
    }

    public void setObjectID(String objectID) {
        this.objectID = objectID;
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

    public BigDecimal getDiscount() {
        return discount;
    }

    public void setDiscount(BigDecimal discount) {
        this.discount = discount;
    }

    public String getSku() {
        return sku;
    }

    public void setSku(String sku) {
        this.sku = sku;
    }

    public List<String> getTags() {
        return tags;
    }

    public void setTags(List<String> tags) {
        this.tags = tags;
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
}
*/
package com.hypehouse.product_service.model;

import java.util.List;
import java.util.UUID;

public class IndexableProduct {

    private String objectID;
    private String name;
    private String description;
    private Float price;  // Top-level price for the product (if applicable)
    private Float discount;  // Top-level discount for the product (if applicable)
    private String sku;  // Default SKU for the product
    private List<String> tags;
    private String category;
    private String brand;
    private List<Product.Variant> variants;  // Use variants for color, size, etc.
    private String type;
    private String gender;
    private String material;
    private String releaseDate;
    private double rating;  // Product rating (from 0 to 5)

    // Constructor
    public IndexableProduct() {
        this.objectID = UUID.randomUUID().toString();  // Automatically generate a new UUID
    }

    // Getters and Setters

    public String getObjectID() {
        return objectID;
    }

    public void setObjectID(String objectID) {
        this.objectID = objectID;
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

    public Float getDiscount() {
        return discount;
    }

    public void setDiscount(Float discount) {
        this.discount = discount;
    }

    public List<String> getTags() {
        return tags;
    }

    public void setTags(List<String> tags) {
        this.tags = tags;
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

    public List<Product.Variant> getVariants() {
        return variants;
    }

    public void setVariants(List<Product.Variant> variants) {
        this.variants = variants;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
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

    public double getRating() {
        return rating;
    }

    public void setRating(double rating) {
        this.rating = rating;
    }

    // Variant class representing individual variants of the product (color, size, price)
    public static class Variant {
        private String color;
        private String sku;  // SKU for this variant
        private List<String> colorOptionImages;  // List of image URLs for this color option
        private List<String> sizes;  // List of available sizes for this variant
        private Float price;  // Price for this specific variant
        private Float discount;  // Discounted price, if available

        // Getters and Setters
        public String getColor() {
            return color;
        }

        public void setColor(String color) {
            this.color = color;
        }

        public List<String> getColorOptionImages() {
            return colorOptionImages;
        }

        public void setColorOptionImages(List<String> colorOptionImages) {
            this.colorOptionImages = colorOptionImages;
        }

        public List<String> getSizes() {
            return sizes;
        }

        public void setSizes(List<String> sizes) {
            this.sizes = sizes;
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

        public String getSku() {
            return sku;
        }

        public void setSku(String sku) {
            this.sku = sku;
        }
    }
}
