package com.hypehouse.product_service;

import com.hypehouse.common.rate_limit.RateLimit;
import com.hypehouse.product_service.exception.ProductNotFoundException;
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
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/api/v1/products")
public class ProductController {

    private final ProductService productService;
    private final Logger log = LoggerFactory.getLogger(ProductController.class);

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    @RateLimit(limitForPeriod = 5, limitRefreshPeriod = 60)
    public ResponseEntity<Page<Product>> getAllProducts(Pageable pageable) {
        log.info("Fetching all products");
        Page<Product> products = productService.getAllProducts(pageable);
        return ResponseEntity.ok(products);
    }

    @GetMapping("/{id}")
    @RateLimit(limitForPeriod = 5, limitRefreshPeriod = 60)
    public ResponseEntity<Product> getProductById(@PathVariable String id) {
        log.info("Fetching product with ID: {}", id);
        return productService.getProductById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @PostMapping("/create-product")
    @RateLimit(limitForPeriod = 5, limitRefreshPeriod = 60)
    public ResponseEntity<Product> createProduct(@Valid @RequestBody Product product) {
        log.debug("Creating new product: {}", product);
        Product savedProduct = productService.saveProduct(product);
        log.info("Product created successfully with ID: {}", savedProduct.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(savedProduct);
    }

    @PutMapping("/update-product/{id}")
    @RateLimit(limitForPeriod = 5, limitRefreshPeriod = 60)
    public ResponseEntity<Product> updateProduct(
            @PathVariable String id,
            @Valid @RequestBody UpdateProductDTO updateProductDTO) {
        log.debug("Updating product with ID: {}", id);
        try {
            Product updatedProduct = productService.updateProduct(id, updateProductDTO);
            log.info("Product with ID: {} updated successfully", id);
            return ResponseEntity.ok(updatedProduct);
        } catch (ProductNotFoundException e) {
            log.warn("Product with ID: {} not found", id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @DeleteMapping("/delete-product/{id}")
    @RateLimit(limitForPeriod = 5, limitRefreshPeriod = 60)
    public ResponseEntity<Void> deleteProduct(@PathVariable String id) {
        log.debug("Deleting product with ID: {}", id);
        try {
            productService.deleteProduct(id);
            log.info("Product with ID: {} deleted successfully", id);
            return ResponseEntity.noContent().build();
        } catch (ProductNotFoundException e) {
            log.warn("Product with ID: {} not found", id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("/search")
    public ResponseEntity<List<Product>> search(@RequestParam String query) {
        log.debug("Search request received for query: {}", query);

        if (query == null || query.trim().isEmpty()) {
            log.warn("Empty search query received");
            return ResponseEntity.badRequest().body(List.of()); // Return empty list for bad requests
        }

        try {
            List<Product> products = productService.searchProducts(query);
            if (products.isEmpty()) {
                log.info("No products found for query: {}", query);
            }
            return ResponseEntity.ok(products);
        } catch (ExecutionException | InterruptedException e) {
            log.error("Error searching for products with query: {}", query, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

}