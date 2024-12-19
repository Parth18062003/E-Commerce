package com.hypehouse.cart.repository;

import com.hypehouse.cart.model.Cart;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Repository;
import java.time.Duration;
import java.time.LocalDateTime;

@Repository
@RequiredArgsConstructor
public class CartRedisRepository {
    private final RedisTemplate<String, Object> redisTemplate;
    private static final String CART_KEY_PREFIX = "cart:";
    private static final Duration CART_TTL = Duration.ofDays(15);

    public CartRedisRepository(RedisTemplate<String, Object> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    public Cart save(Cart cart) {
        String key = CART_KEY_PREFIX + cart.getUserId();
        if (cart.getCreatedAt() == null) {
            cart.setCreatedAt(LocalDateTime.now());
        }
        cart.setUpdatedAt(LocalDateTime.now());
        cart.setExpiresAt(LocalDateTime.now().plus(CART_TTL));

        redisTemplate.opsForValue().set(key, cart, CART_TTL);
        return cart;
    }

    public Cart findByUserId(String userId) {
        String key = CART_KEY_PREFIX + userId;
        return (Cart) redisTemplate.opsForValue().get(key);
    }

    public void delete(String userId) {
        String key = CART_KEY_PREFIX + userId;
        redisTemplate.delete(key);
    }
}