package com.hypehouse.product_service;

import com.hypehouse.product_service.model.Product;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;
import java.util.List;

@Repository
public interface ProductRepository extends MongoRepository<Product, String> {

    // Fetch all products with pagination
    @NotNull Page<Product> findAll(@NotNull Pageable pageable);

    Page<Product> findByIdIn(List<String> ids, Pageable pageable);

    // Find product by SKU
    Optional<Product> findBySku(String sku);

    // Find product by name
    Optional<Product> findByName(String name);

    // Find product by category
    Page<Product> findByCategory(String category, Pageable pageable);

    // Find product by brand
    @Query("{'name': { $regex: ?0, $options: 'i' }}")
    Page<Product> findByBrand(String brand, Pageable pageable);

    // Find product by gender
    Page<Product> findByGender(String gender, Pageable pageable);

    // Find product by tags (searches if the tag is in the list of tags)
    public Page<Product> findByTagsContaining(List<String> tags, Pageable pageable);

    // Find product by release date (if needed)
    @Query("{'releaseDate': { $lt: ?0 }}")
    Page<Product> findByReleaseDateBefore(String releaseDate, Pageable pageable);

    @Query("{'releaseDate': { $gt: ?0 }}")
    Page<Product> findByReleaseDateAfter(String releaseDate, Pageable pageable);

    // Find product by type (for example: electronics, clothing, etc.)
    Optional<Product> findByType(String type);

    // Find products by featured status
    Page<Product> findByIsFeatured(boolean isFeatured, Pageable pageable);
}
