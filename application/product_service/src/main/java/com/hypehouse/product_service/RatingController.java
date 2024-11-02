package com.hypehouse.product_service;

import com.hypehouse.product_service.model.Rating;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
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
        log.info("Rating: {}", ratingRequest.getRating().toString());
        log.info("User Name: {}", ratingRequest.getUserName());
        Rating newRating = ratingService.addRating(userId, ratingRequest.getUserName(), productId, ratingRequest.getRating());
        return ResponseEntity.status(201).body(newRating);
    }

    // Endpoint to update a rating
    @PutMapping("/{ratingId}")
    public ResponseEntity<Rating> updateRating(@PathVariable String ratingId,
                                               @RequestBody Rating updatedRating) {
        Rating updated = ratingService.updateRating(ratingId, updatedRating);
        return ResponseEntity.ok(updated);
    }

    // Endpoint to retrieve a rating by ID
    @GetMapping("/{ratingId}")
    public ResponseEntity<Rating> getRatingById(@PathVariable String ratingId) {
        Rating rating = ratingService.getRatingById(ratingId);
        return ResponseEntity.ok(rating);
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
        Rating rating = ratingService.getRatingByUserAndProduct(userId, productId);
        return ResponseEntity.ok(rating);
    }

    // Endpoint to delete a rating
    @DeleteMapping("/{ratingId}")
    public ResponseEntity<Void> deleteRating(@PathVariable String ratingId) {
        ratingService.deleteRating(ratingId);
        return ResponseEntity.noContent().build();
    }

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
