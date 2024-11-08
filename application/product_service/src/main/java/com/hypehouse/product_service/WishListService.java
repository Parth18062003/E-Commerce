package com.hypehouse.product_service;

import com.hypehouse.product_service.model.WishList;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Service;
import org.springframework.cache.annotation.Cacheable;

import java.util.ArrayList;
import java.util.List;

@Service
public class WishListService {

    @Autowired
    private WishListRepository wishListRepository;

    // Create or update a wishlist for a user
    // Update to ensure productIds is never null
    @CacheEvict(value = "wishLists", allEntries = true)
    public WishList saveOrUpdateWishList(String userId, List<String> productIds) {
        WishList wishList = wishListRepository.findByUserId(userId)
                .orElse(new WishList(userId, new ArrayList<>()));
        // If productIds is null, we use an empty list instead
        wishList.setProductIds(productIds != null ? productIds : new ArrayList<>());
        return wishListRepository.save(wishList);
    }

    // Add or remove a product from the user's wishlist
    public WishList toggleProductInWishList(String userId, String productId) {
        WishList wishList = wishListRepository.findByUserId(userId)
                .orElse(new WishList(userId, new ArrayList<>()));

        // Clean the product ID to ensure no unwanted characters
        productId = productId.replace("=", "");

        // Check if the product ID is already in the wishlist
        if (wishList.getProductIds().contains(productId)) {
            // If it exists, remove it
            wishList.removeProduct(productId);
        } else {
            // If it doesn't exist, add it
            wishList.addProduct(productId);
        }

        return wishListRepository.save(wishList);
    }

    // Remove a product from the user's wishlist
    public WishList removeProductFromWishList(String userId, String productId) {
        WishList wishList = wishListRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Wishlist not found for user ID: " + userId));
        wishList.removeProduct(productId);
        return wishListRepository.save(wishList);
    }

    // Retrieve the wishlist for a user
    public WishList getWishListByUserId(String userId) {
        return wishListRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Wishlist not found for user ID: " + userId));
    }

    // Get all wishlists (if needed)
    @Cacheable(value = "wishLists", key = "'all'")
    public List<WishList> getAllWishLists() {
        return wishListRepository.findAll();
    }
}
