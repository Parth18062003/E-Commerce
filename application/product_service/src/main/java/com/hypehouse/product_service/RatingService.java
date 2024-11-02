package com.hypehouse.product_service;

import com.hypehouse.product_service.model.Rating;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Validated
public class RatingService {


    private static final Logger log = LoggerFactory.getLogger(RatingService.class);
    @Autowired
    private RatingRepository ratingRepository;

    // Method to add a rating
    public Rating addRating(@NotNull String userId, @NotNull String userName, @NotNull String productId, @Valid Rating rating) {
        log.info("Adding rating for userId: {}, productId: {}, userName: {}", userId, productId, userName);

        // Check if the user has already rated the product
        Rating existingRating = ratingRepository.findByUserIdAndProductId(userId, productId);
        if (existingRating != null) {
            throw new IllegalArgumentException("User has already rated this product.");
        }

        // Create a new Rating instance
        Rating newRating = new Rating(userId, userName, productId, rating.getRating(), rating.getComment(), rating.getImageUrls());

        log.info("New Rating created: {}", newRating);

        return ratingRepository.save(newRating);
    }


    // Method to update a rating
    public Rating updateRating(String ratingId, @Valid Rating updatedRating) {
        Rating existingRating = ratingRepository.findById(ratingId)
                .orElseThrow(() -> new IllegalArgumentException("Rating not found."));

        // Update fields
        existingRating.setRating(updatedRating.getRating());
        existingRating.setComment(updatedRating.getComment());
        existingRating.setImageUrls(updatedRating.getImageUrls());
        existingRating.setUpdatedAt(LocalDateTime.now());

        return ratingRepository.save(existingRating);
    }

    // Method to retrieve a rating by ID
    public Rating getRatingById(String ratingId) {
        return ratingRepository.findById(ratingId)
                .orElseThrow(() -> new IllegalArgumentException("Rating not found."));
    }

    // Method to retrieve all ratings for a specific product
    public List<Rating> getRatingsByProduct(String productId) {
        return ratingRepository.findByProductId(productId);
    }

    // Method to retrieve all ratings by a specific user
    public List<Rating> getRatingsByUser(String userId) {
        return ratingRepository.findByUserId(userId);
    }

    //Method to retrieve a specific rating by user and product
    public Rating getRatingByUserAndProduct(String userId, String productId) {
        return ratingRepository.findByUserIdAndProductId(userId, productId);
    }

    // Method to delete a rating
    public void deleteRating(String ratingId) {
        Rating existingRating = ratingRepository.findById(ratingId)
                .orElseThrow(() -> new IllegalArgumentException("Rating not found."));
        ratingRepository.delete(existingRating);
    }
}
