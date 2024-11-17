package com.hypehouse.product_service;/*
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
*/

import com.hypehouse.product_service.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface ProductRepository extends MongoRepository<Product, String> {

    // Fetch all products with pagination
    Page<Product> findAll(Pageable pageable);

    // Find product by SKU
    Optional<Product> findBySku(String sku);

    // Find product by name
    Optional<Product> findByName(String name);

    // Find product by category
    Optional<Product> findByCategory(String category);

    // Find product by brand
    Optional<Product> findByBrand(String brand);

    // Find product by gender
    Optional<Product> findByGender(String gender);

    // Find product by tags (searches if the tag is in the list of tags)
    Optional<Product> findByTagsContaining(String tag);

    // Find product by material
    Optional<Product> findByMaterial(String material);

    // Find product by release date (if needed)
    Optional<Product> findByReleaseDate(String releaseDate);

    // Find product by type (for example: electronics, clothing, etc.)
    Optional<Product> findByType(String type);

    // Find products by active status (e.g., only active products)
    List<Product> findByIsActive(boolean isActive);

    // Find products by featured status
    List<Product> findByIsFeatured(boolean isFeatured);

    // Additional query method to find products by color (if applicable, depending on the variants)
    List<Product> findByColorOptionsContaining(String color);

    // You can add more query methods as needed based on your requirements
}
