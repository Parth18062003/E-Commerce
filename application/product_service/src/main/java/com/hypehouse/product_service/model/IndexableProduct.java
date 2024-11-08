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
