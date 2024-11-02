package com.hypehouse.product_service;

import com.hypehouse.product_service.model.Rating;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RatingRepository extends MongoRepository<Rating, String> {

    // Find all ratings for a specific product
    List<Rating> findByProductId(String productId);

    // Find all ratings by a specific user
    List<Rating> findByUserId(String userId);

    // Optional: Find a specific rating by user and product
    Rating findByUserIdAndProductId(String userId, String productId);
}
