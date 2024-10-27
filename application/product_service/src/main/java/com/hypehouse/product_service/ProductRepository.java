package com.hypehouse.product_service;

import com.hypehouse.product_service.model.Product;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProductRepository extends MongoRepository<Product, UUID> {

    Optional<Product> findBySku(String sku);

    Optional<Product> findByName(String name);
    // You can add more query methods as needed, e.g., by category, brand, etc.
}
