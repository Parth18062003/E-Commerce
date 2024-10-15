package com.hypehouse.common.cache;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

@Service
public class BloomFilterService {

    private static final Logger logger = LoggerFactory.getLogger(BloomFilterService.class);
    private final RedisTemplate<String, String> redisTemplate;
    private static final String BLOOM_FILTER_KEY = "user_bloom_filter";

    private final int filterSize;

    private final int numHashes;

    public BloomFilterService(RedisTemplate<String, String> redisTemplate) {
        this.redisTemplate = redisTemplate;
        this.filterSize = 1048576;
        this.numHashes = 3;
    }

    public void add(String value) {
        if (value == null || value.isEmpty()) {
            throw new IllegalArgumentException("Value cannot be null or empty");
        }

        try {
            byte[][] hashes = createHashes(value.getBytes(StandardCharsets.UTF_8), numHashes);
            for (byte[] hash : hashes) {
                int index = Math.abs(byteArrayToInt(hash) % filterSize);
                redisTemplate.opsForValue().setBit(BLOOM_FILTER_KEY, index, true);
                logger.debug("Added to Bloom Filter: {} with index: {}", value, index);
            }
        } catch (Exception e) {
            logger.error("Error adding to Bloom Filter", e);
            throw new RuntimeException("Error adding to Bloom Filter", e);
        }
    }

    public boolean mightContain(String value) {
        if (value == null || value.isEmpty()) {
            throw new IllegalArgumentException("Value cannot be null or empty");
        }

        try {
            byte[][] hashes = createHashes(value.getBytes(StandardCharsets.UTF_8), numHashes);
            for (byte[] hash : hashes) {
                int index = Math.abs(byteArrayToInt(hash) % filterSize);
                Boolean result = redisTemplate.opsForValue().getBit(BLOOM_FILTER_KEY, index);
                if (result == null || !result) {
                    logger.debug("Checked Bloom Filter: {} with index: {}, result: not present", value, index);
                    return false;
                }
                logger.debug("Checked Bloom Filter: {} with index: {}, result: present", value, index);
            }
            return true; // Potentially present
        } catch (Exception e) {
            logger.error("Error checking Bloom Filter", e);
            throw new RuntimeException("Error checking Bloom Filter", e);
        }
    }

    private byte[][] createHashes(byte[] input, int numHashes) throws NoSuchAlgorithmException {
        byte[][] result = new byte[numHashes][];
        MessageDigest md = MessageDigest.getInstance("MD5");
        byte[] digest = md.digest(input);
        result[0] = digest;

        for (int i = 1; i < numHashes; i++) {
            md.reset();
            result[i] = md.digest(result[i - 1]);
        }

        return result;
    }

    private int byteArrayToInt(byte[] bytes) {
        int result = 0;
        for (int i = 0; i < 4; i++) {
            result = (result << 8) | (bytes[i] & 0xff);
        }
        return result;
    }
}