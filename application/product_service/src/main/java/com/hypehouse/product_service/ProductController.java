package com.hypehouse.product_service;

import com.hypehouse.common.rate_limit.RateLimit;
import com.hypehouse.product_service.exception.ProductAlreadyExistsException;
import com.hypehouse.product_service.exception.ProductNotFoundException;
import com.hypehouse.product_service.model.IndexableProduct;
import com.hypehouse.product_service.model.UpdateProductDTO;
import com.hypehouse.product_service.model.Product;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/products")
public class ProductController {

    private final ProductService productService;
    private final ProductRepository productRepository;
    private final Logger log = LoggerFactory.getLogger(ProductController.class);

    public ProductController(ProductService productService, ProductRepository productRepository) {
        this.productService = productService;
        this.productRepository = productRepository;
    }

    // Get all products with pagination and caching to optimize latency
    @GetMapping
    @RateLimit(limitForPeriod = 15, limitRefreshPeriod = 60)
    public ResponseEntity<Page<Product>> getAllProducts(Pageable pageable) {
        log.info("Fetching all products (paginated)");
        Page<Product> products = productService.getAllProducts(pageable);
        if (products.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();  // Return No Content if no products found
        }
        return ResponseEntity.ok(products);
    }

    // Get a single product by ID with caching
    @GetMapping("/{id}")
    @RateLimit(limitForPeriod = 15, limitRefreshPeriod = 60)
    public ResponseEntity<Product> getProductById(@PathVariable String id) {
        log.info("Fetching product with ID: {}", id);
        return productService.getProductById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body(null));  // Return Not Found if product not found
    }

    // Fetch products by IDs with pagination
    @GetMapping("/ids")
    @RateLimit(limitForPeriod = 15, limitRefreshPeriod = 60)
    public ResponseEntity<Page<Product>> getProductsByIds(@RequestParam List<String> ids, Pageable pageable) {
        log.info("Fetching products by IDs: {}", ids);
        Page<Product> products = productService.getProductsByIds(ids, pageable);
        if (products.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();  // Return No Content if no products found
        }
        return ResponseEntity.ok(products);
    }

    // Create a new product with rate limit and validation checks
    @PostMapping("/create-product")
    @RateLimit(limitForPeriod = 5, limitRefreshPeriod = 60)
    public ResponseEntity<Product> createProduct(@Valid @RequestBody Product product) {
        log.debug("Attempting to create new product: {}", product);

        // Check if the product already exists based on SKU
        productRepository.findBySku(product.getSku()).ifPresent(existingProduct -> {
            log.warn("Product with SKU {} already exists", product.getSku());
            throw new ProductAlreadyExistsException(product.getSku());
        });

        // Save and return the product
        Product savedProduct = productService.saveProduct(product);  // Async indexing happens in service
        log.info("Product created successfully with ID: {}", savedProduct.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(savedProduct);  // Return Created status
    }

    // Update an existing product
    @PutMapping("/update-product/{id}")
    @RateLimit(limitForPeriod = 5, limitRefreshPeriod = 60)
    public ResponseEntity<Product> updateProduct(
            @PathVariable String id,
            @Valid @RequestBody UpdateProductDTO updateProductDTO) {
        log.debug("Attempting to update product with ID: {}", id);
        try {
            Product updatedProduct = productService.updateProduct(id, updateProductDTO);  // Async indexing happens in service
            log.info("Product with ID: {} updated successfully", id);
            return ResponseEntity.ok(updatedProduct);  // Return OK status if update successful
        } catch (ProductNotFoundException e) {
            log.warn("Product with ID: {} not found", id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();  // Return Not Found status if product does not exist
        }
    }

    // Delete a product by ID
    @DeleteMapping("/delete-product/{id}")
    @RateLimit(limitForPeriod = 5, limitRefreshPeriod = 60)
    public ResponseEntity<Void> deleteProduct(@PathVariable String id) {
        log.debug("Attempting to delete product with ID: {}", id);
        try {
            productService.deleteProduct(id);  // Async delete from Algolia happens in service
            log.info("Product with ID: {} deleted successfully", id);
            return ResponseEntity.noContent().build();  // Return No Content status after successful deletion
        } catch (ProductNotFoundException e) {
            log.warn("Product with ID: {} not found", id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();  // Return Not Found status if product does not exist
        }
    }

    // Search products by query (Algolia search) with rate limiting
    @GetMapping("/search")
    @RateLimit(limitForPeriod = 10, limitRefreshPeriod = 60)
    public ResponseEntity<List<IndexableProduct>> search(
            @RequestParam String query,
            Pageable pageable) {
        log.debug("Search request received for query: {}", query);

        if (query == null || query.trim().isEmpty()) {
            log.warn("Empty search query received");
            return ResponseEntity.badRequest().body(List.of());  // Return empty list for bad requests
        }

        try {
            // Pass both query and pageable to searchProducts
            List<IndexableProduct> products = productService.searchProducts(query, pageable);
            if (products.isEmpty()) {
                log.info("No products found for query: {}", query);
                return ResponseEntity.status(HttpStatus.NO_CONTENT).build();  // Return No Content if no products found
            }
            return ResponseEntity.ok(products);  // Return OK status with found products
        } catch (Exception e) {
            log.error("Error searching for products with query: {}", query, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();  // Return Internal Server Error if something goes wrong
        }
    }

    // Fetch products by category with pagination
    @GetMapping("/category/{category}")
    @RateLimit(limitForPeriod = 10, limitRefreshPeriod = 60)
    public ResponseEntity<Page<Product>> getProductsByCategory(
            @PathVariable String category,
            Pageable pageable) {
        log.info("Fetching products by category: {}", category);
        Page<Product> products = productService.getProductsByCategory(category, pageable);
        if (products.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();  // Return No Content if no products found
        }
        return ResponseEntity.ok(products);  // Return OK status with products by category
    }

    // Fetch products by release date with pagination
    @GetMapping("/release-date/{releaseDate}")
    @RateLimit(limitForPeriod = 10, limitRefreshPeriod = 60)
    public ResponseEntity<Page<Product>> getProductsByReleaseDate(
            @PathVariable String releaseDate,
            Pageable pageable) {
        log.info("Fetching products released before: {}", releaseDate);
        Page<Product> products = productService.getProductsByReleaseDate(releaseDate, pageable);
        if (products.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();  // Return No Content if no products found
        }
        return ResponseEntity.ok(products);  // Return OK status with products by release date
    }

    // Fetch products by brand with pagination
    @GetMapping("/brand/{brand}")
    @RateLimit(limitForPeriod = 10, limitRefreshPeriod = 60)
    public ResponseEntity<Page<Product>> getProductsByBrand(
            @PathVariable String brand,
            Pageable pageable) {
        log.info("Fetching products by brand: {}", brand);
        Page<Product> products = productService.getProductsByBrand(brand, pageable);
        if (products.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();  // Return No Content if no products found
        }
        return ResponseEntity.ok(products);  // Return OK status with products by brand
    }

    // Fetch products by gender with pagination
    @GetMapping("/gender/{gender}")
    @RateLimit(limitForPeriod = 10, limitRefreshPeriod = 60)
    public ResponseEntity<Page<Product>> getProductsByGender(
            @PathVariable String gender,
            Pageable pageable) {
        log.info("Fetching products by gender: {}", gender);
        Page<Product> products = productService.getProductsByGender(gender, pageable);
        if (products.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();  // Return No Content if no products found
        }
        return ResponseEntity.ok(products);  // Return OK status with products by gender
    }

    // Fetch products by tag with pagination
    @GetMapping("/tags")
    @RateLimit(limitForPeriod = 10, limitRefreshPeriod = 60)
    public ResponseEntity<Page<Product>> getProductsByTags(
            @RequestParam List<String> tags,  // Accept a list of tags via query parameters
            Pageable pageable) {
        log.info("Fetching products with tags: {}", tags);
        Page<Product> products = productService.getProductsByTags(tags, pageable);
        if (products.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();  // Return No Content if no products found
        }
        return ResponseEntity.ok(products);  // Return OK status with products by tags
    }

    // Fetch featured products with pagination
    @GetMapping("/featured")
    @RateLimit(limitForPeriod = 10, limitRefreshPeriod = 60)
    public ResponseEntity<Page<Product>> getFeaturedProducts(Pageable pageable) {
        log.info("Fetching featured products");
        Page<Product> products = productService.getFeaturedProducts(pageable);
        if (products.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();  // Return No Content if no products found
        }
        return ResponseEntity.ok(products);  // Return OK status with featured products
    }
}
