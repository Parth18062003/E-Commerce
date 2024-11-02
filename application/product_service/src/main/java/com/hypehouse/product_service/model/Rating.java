package com.hypehouse.product_service.model;

import jakarta.validation.constraints.*;
import org.hibernate.validator.constraints.Length;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Document(collection = "ratings")
public class Rating implements Serializable {

    @Id
    @NotNull(message = "Rating ID is mandatory")
    @Field(name = "id")
    private String id;

    @NotNull(message = "User ID is mandatory")
    @Field(name = "user_id")
    private String userId;  // Assuming the user is identified by ID

    @Field(name = "user_name")
    private String userName;  // Assuming the user is identified by ID

    @NotNull(message = "Product ID is mandatory")
    @Field(name = "product_id")
    private String productId;  // Assuming the product is identified by ID

    @NotNull(message = "Rating value is mandatory")
    @DecimalMin(value = "0", message = "Rating must be between 0 and 5")
    @DecimalMax(value = "5", message = "Rating must be between 0 and 5")
    private double rating; // Rating value (0-5 scale)

    @Length(max = 500, message = "Comment must not exceed 500 characters")
    private String comment; // Optional comment

    @Size(max = 5, message = "You can add up to 5 images")
    private List<String> imageUrls; // List of image URLs

    @NotNull(message = "Created timestamp is mandatory")
    private LocalDateTime createdAt; // Timestamp when the rating was created

    private LocalDateTime updatedAt; // Timestamp when the rating was last updated

    public Rating(String userId,String userName ,String productId, double rating, String comment, List<String> imageUrls) {
        this.id = UUID.randomUUID().toString();
        this.userId = userId;
        this.userName = userName;
        this.productId = productId;
        this.rating = rating;
        this.comment = comment;
        this.imageUrls = imageUrls;
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

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getProductId() {
        return productId;
    }

    public void setProductId(String productId) {
        this.productId = productId;
    }

    public double getRating() {
        return rating;
    }

    public void setRating(double rating) {
        this.rating = rating;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public List<String> getImageUrls() {
        return imageUrls;
    }

    public void setImageUrls(List<String> imageUrls) {
        this.imageUrls = imageUrls;
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

    @Override
    public String toString() {
        return "Rating{" +
                "id='" + id + '\'' +
                ", userId='" + userId + '\'' +
                ", userName='" + userName + '\'' +
                ", productId='" + productId + '\'' +
                ", rating=" + rating +
                ", comment='" + comment + '\'' +
                ", imageUrls=" + imageUrls +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                '}';
    }
}
