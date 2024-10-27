package com.hypehouse.product_service;

import com.hypehouse.common.rate_limit.RateLimit;
import com.hypehouse.product_service.model.UpdateProductDTO;
import com.hypehouse.product_service.model.Product;;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

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
        log.debug("Fetching all products");
        Page<Product> products = productService.getAllProducts(pageable);
        return ResponseEntity.ok(products);
    }

    @GetMapping("/{id}")
    @RateLimit(limitForPeriod = 5, limitRefreshPeriod = 60)
    public ResponseEntity<Product> getProductById(@PathVariable String id) {
        log.debug("Fetching product with ID: {}", id);
        Optional<Product> product = productService.getProductById(id);
        return product.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @PostMapping("/create-product")
    @RateLimit(limitForPeriod = 5, limitRefreshPeriod = 60)
    public ResponseEntity<Product> createProduct(@Valid @RequestBody Product product) {
        log.debug("Creating new product");
        Product savedProduct = productService.saveProduct(product);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedProduct);
    }

    @PutMapping("/update-product/{id}")
    @RateLimit(limitForPeriod = 5, limitRefreshPeriod = 60)
    public ResponseEntity<Product> updateProduct(
            @PathVariable String id,
            @Valid @RequestBody UpdateProductDTO updateProductDTO) {
        log.debug("Updating product with ID: {}", id);
        Product updatedProduct = productService.updateProduct(id, updateProductDTO);
        return ResponseEntity.ok(updatedProduct);
    }

    @DeleteMapping("/delete-product/{id}")
    @RateLimit(limitForPeriod = 5, limitRefreshPeriod = 60)
    public ResponseEntity<Void> deleteProduct(@PathVariable String id) {
        log.debug("Deleting product with ID: {}", id);
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
}
