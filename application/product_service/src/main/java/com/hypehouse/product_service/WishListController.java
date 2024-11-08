package com.hypehouse.product_service;

import com.hypehouse.common.rate_limit.RateLimit;
import com.hypehouse.product_service.model.WishList;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/wishlist")
public class WishListController {

    @Autowired
    private WishListService wishListService;

    // Endpoint to retrieve the wishlist by user ID
    @GetMapping("/{userId}")
    @RateLimit(limitForPeriod = 25, limitRefreshPeriod = 60)
    public ResponseEntity<WishList> getWishList(@PathVariable String userId) {
        WishList wishList = wishListService.getWishListByUserId(userId);
        return ResponseEntity.ok(wishList);
    }

    // Endpoint to toggle a product in the wishlist (add or remove)
    @PostMapping("/{userId}/add")
    @RateLimit(limitForPeriod = 25, limitRefreshPeriod = 60)
    public ResponseEntity<WishList> toggleProductInWishList(@PathVariable String userId, @RequestBody String productId) {
        try {
            WishList updatedWishList = wishListService.toggleProductInWishList(userId, productId);
            return ResponseEntity.ok(updatedWishList);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // Endpoint to remove a product from the wishlist
    @DeleteMapping("/{userId}/remove/{productId}")
    @RateLimit(limitForPeriod = 25, limitRefreshPeriod = 60)
    public ResponseEntity<WishList> removeProductFromWishList(@PathVariable String userId, @PathVariable String productId) {
        WishList updatedWishList = wishListService.removeProductFromWishList(userId, productId);
        return ResponseEntity.ok(updatedWishList);
    }

    // Endpoint to create or update a wishlist
    @PutMapping("/{userId}")
    @RateLimit(limitForPeriod = 25, limitRefreshPeriod = 60)
    public ResponseEntity<WishList> saveOrUpdateWishList(@PathVariable String userId, @RequestBody List<String> productIds) {
        WishList updatedWishList = wishListService.saveOrUpdateWishList(userId, productIds);
        return ResponseEntity.ok(updatedWishList);
    }

    // Optional: Endpoint to get all wishlists (for admin purposes)
    @GetMapping
    @RateLimit(limitForPeriod = 25, limitRefreshPeriod = 60)
    public ResponseEntity<List<WishList>> getAllWishLists() {
        List<WishList> wishLists = wishListService.getAllWishLists();
        return ResponseEntity.ok(wishLists);
    }
}
