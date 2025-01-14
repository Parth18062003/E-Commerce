package com.hypehouse.cart_service.repository;

import com.hypehouse.cart_service.model.Cart;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Repository;

import java.time.Duration;
import java.time.LocalDateTime;

@Repository
public class CartRepository {
    private final RedisTemplate<String, Object> redisTemplate; // Use RedisTemplate<String, Object>

    @Value("${redis.cart.key.prefix:cart:}")
    private String cartKeyPrefix;

    private static final Duration CART_TTL = Duration.ofDays(15);

    public CartRepository(RedisTemplate<String, Object> redisTemplate) { // Use RedisTemplate<String, Object>
        this.redisTemplate = redisTemplate;
    }

    public Cart save(Cart cart) {
        String key = generateKey(cart.getUserId());
        cart.setUpdatedAt(LocalDateTime.now());
        cart.setExpiresAt(LocalDateTime.now().plus(CART_TTL));
        redisTemplate.opsForValue().set(key, cart, CART_TTL);
        return cart;
    }

    public Cart findByUserId(String userId) {
        return (Cart) redisTemplate.opsForValue().get(generateKey(userId)); // Cast to Cart
    }

    public void delete(String userId) {
        redisTemplate.delete(generateKey(userId));
    }

    private String generateKey(String userId) {
        return cartKeyPrefix + userId;
    }
}