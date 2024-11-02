package com.hypehouse.product_service;

import com.hypehouse.product_service.model.WishList;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface WishListRepository extends MongoRepository<WishList, String> {

    // Find a wishlist by user ID
    Optional<WishList> findByUserId(String userId);

    // Find a wishlist by product ID
    Optional<WishList> findByProductIds(String productId); // Changed from productsId to productIds

    // Find a wishlist by user ID and product ID
    Optional<WishList> findByUserIdAndProductIds(String userId, String productId); // Changed from productsId to productIds
}
