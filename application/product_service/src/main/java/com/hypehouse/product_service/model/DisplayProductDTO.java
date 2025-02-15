package com.hypehouse.product_service.model;

import jakarta.validation.constraints.*;
import org.hibernate.validator.constraints.Length;

import java.util.List;
import java.util.Map;

public class DisplayProductDTO {

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

    private boolean isActive;

    @Size(max = 20, message = "Cannot have more than 20 tags")
    private List<@Size(max = 30, message = "Tag must not exceed 30 characters") String> tags;

    @DecimalMin(value = "0.0", message = "Discount must be greater than or equal to 0")
    @DecimalMax(value = "100.0", message = "Discount must not exceed 100%")
    private Float discount;

    private boolean isFeatured;

    private List<String> colorOptions;

    private Map<String, List<String>> colorOptionImages;

    @Size(max = 20, message = "Cannot have more than 20 sizes")
    private List<String> sizes;

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
