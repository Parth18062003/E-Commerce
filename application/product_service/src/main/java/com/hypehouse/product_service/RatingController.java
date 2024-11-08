package com.hypehouse.product_service;

import com.hypehouse.product_service.model.Rating;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/ratings")
public class RatingController {

    private static final Logger log = LoggerFactory.getLogger(RatingController.class);

    @Autowired
    private RatingService ratingService;

    // Endpoint to add a rating
    @PostMapping("/{userId}/products/{productId}")
    public ResponseEntity<Rating> addRating(@PathVariable String userId,
                                            @PathVariable String productId,
                                            @RequestBody RatingRequest ratingRequest) {
        Rating rating = ratingRequest.getRating();
        rating.setUserId(userId);
        rating.setUserName(ratingRequest.getUserName());
        rating.setProductId(productId);

        log.info("Adding rating for userId: {} and productId: {}", userId, productId);

        try {
            Rating newRating = ratingService.addRating(userId, ratingRequest.getUserName(), productId, rating);
            return ResponseEntity.status(201).body(newRating);
        } catch (IllegalArgumentException e) {
            log.error("Error while adding rating: {}", e.getMessage());
            return ResponseEntity.status(400).body(null); // Bad request
        }
    }

    // Endpoint to update a rating asynchronously
    @PutMapping("/{ratingId}")
    public ResponseEntity<Rating> updateRating(@PathVariable String ratingId,
                                               @RequestBody Rating updatedRating) {
        try {
            Rating updated = ratingService.updateRating(ratingId, updatedRating).join(); // Wait for async completion
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            log.error("Error while updating rating: {}", e.getMessage());
            return ResponseEntity.status(404).body(null); // Not found
        }
    }

    // Endpoint to retrieve a rating by ID
    @GetMapping("/{ratingId}")
    public ResponseEntity<Rating> getRatingById(@PathVariable String ratingId) {
        try {
            Rating rating = ratingService.getRatingById(ratingId);
            return ResponseEntity.ok(rating);
        } catch (IllegalArgumentException e) {
            log.error("Rating not found: {}", e.getMessage());
            return ResponseEntity.status(404).body(null); // Not found
        }
    }

    // Endpoint to retrieve all ratings for a specific product
    @GetMapping("/products/{productId}")
    public ResponseEntity<List<Rating>> getRatingsByProduct(@PathVariable String productId) {
        List<Rating> ratings = ratingService.getRatingsByProduct(productId);
        return ResponseEntity.ok(ratings);
    }

    // Endpoint to retrieve all ratings by a specific user
    @GetMapping("/users/{userId}")
    public ResponseEntity<List<Rating>> getRatingsByUser(@PathVariable String userId) {
        List<Rating> ratings = ratingService.getRatingsByUser(userId);
        return ResponseEntity.ok(ratings);
    }

    // Endpoint to retrieve a specific rating by user and product
    @GetMapping("/users/{userId}/products/{productId}")
    public ResponseEntity<Rating> getRatingByUserAndProduct(@PathVariable String userId,
                                                            @PathVariable String productId) {
        try {
            Rating rating = ratingService.getRatingByUserAndProduct(userId, productId);
            return ResponseEntity.ok(rating);
        } catch (IllegalArgumentException e) {
            log.error("Rating not found: {}", e.getMessage());
            return ResponseEntity.status(404).body(null); // Not found
        }
    }

    // Endpoint to delete a rating
    @DeleteMapping("/{ratingId}")
    public ResponseEntity<Void> deleteRating(@PathVariable String ratingId) {
        try {
            ratingService.deleteRating(ratingId);
            log.info("Rating with ID {} deleted", ratingId);
            return ResponseEntity.noContent().build(); // No Content (success)
        } catch (IllegalArgumentException e) {
            log.error("Error while deleting rating: {}", e.getMessage());
            return ResponseEntity.status(404).build(); // Not Found
        }
    }

    // Endpoint to retrieve average rating for a product (with caching)
    @GetMapping("/products/{productId}/average")
    public ResponseEntity<RatingService.AverageRatingResponse> getAverageRating(@PathVariable String productId) {
        try {
            RatingService.AverageRatingResponse averageRatingResponse = ratingService.getAverageRating(productId);
            return ResponseEntity.ok(averageRatingResponse);
        } catch (Exception e) {
            log.error("Error while fetching average rating: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // RatingRequest DTO to pass userName and Rating object together
    public static class RatingRequest {
        private String userName;
        private Rating rating;

        // Getters and setters
        public String getUserName() {
            return userName;
        }

        public void setUserName(String userName) {
            this.userName = userName;
        }

        public Rating getRating() {
            return rating;
        }

        public void setRating(Rating rating) {
            this.rating = rating;
        }
    }
}
