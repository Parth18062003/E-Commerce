package com.hypehouse.product_service;

import com.hypehouse.product_service.model.UpdateProductDTO;
import com.hypehouse.product_service.exception.ProductNotFoundException;
import com.hypehouse.product_service.model.Product;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import jakarta.validation.Valid;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final Logger log = LoggerFactory.getLogger(ProductService.class);

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Cacheable(value = "products", key = "#pageable.pageNumber + '-' + #pageable.pageSize")
    public Page<Product> getAllProducts(Pageable pageable) {
        log.debug("Fetching all products with pagination: {}", pageable);
        return productRepository.findAll(pageable);
    }

    @Cacheable(value = "products", key = "#id")
    public Optional<Product> getProductById(String id) {
        log.debug("Fetching product with ID: {}", id);
        return productRepository.findById(UUID.fromString(id));
    }

    @CachePut(value = "products", key = "#product.id")
    public Product saveProduct(@Valid Product product) {
        log.debug("Inserting product with details: {}", product);
        return productRepository.save(product);
    }

    @CachePut(value = "products", key = "#id")
    public Product updateProduct(String id, @Valid UpdateProductDTO updateProductDTO) {
        log.debug("Updating product with ID: {}", id);
        Product existingProduct = productRepository.findById(UUID.fromString(id))
                .orElseThrow(() -> new ProductNotFoundException(id));

        updateFields(existingProduct, updateProductDTO);
        existingProduct.setUpdatedAt(LocalDateTime.now());

        return productRepository.save(existingProduct);
    }

    @CacheEvict(value = "products", key = "#id")
    public void deleteProduct(String id) {
        log.debug("Deleting product with ID: {}", id);
        UUID productId = UUID.fromString(id);
        if (!productRepository.existsById(productId)) {
            throw new ProductNotFoundException(id);
        }
        productRepository.deleteById(productId);
    }

    private void updateFields(Product existingProduct, UpdateProductDTO updateProductDTO) {
        if (updateProductDTO.getName() != null) {
            existingProduct.setName(updateProductDTO.getName());
        }
        if (updateProductDTO.getDescription() != null) {
            existingProduct.setDescription(updateProductDTO.getDescription());
        }
        if (updateProductDTO.getPrice() != null) {
            existingProduct.setPrice(updateProductDTO.getPrice());
        }
        if (updateProductDTO.getCategory() != null) {
            existingProduct.setCategory(updateProductDTO.getCategory());
        }
        if (updateProductDTO.getBrand() != null) {
            existingProduct.setBrand(updateProductDTO.getBrand());
        }
        if (updateProductDTO.getStockQuantity() != null) { // Assuming stock cannot be negative
            existingProduct.setStockQuantity(updateProductDTO.getStockQuantity());
        }
        if (updateProductDTO.getSku() != null) {
            existingProduct.setSku(updateProductDTO.getSku());
        }
        if (updateProductDTO.getTags() != null) {
            existingProduct.setTags(updateProductDTO.getTags());
        }
        if (updateProductDTO.getDiscount() != null) {
            existingProduct.setDiscount(updateProductDTO.getDiscount());
        }
        if (updateProductDTO.getDimensions() != null) {
            existingProduct.setDimensions(updateProductDTO.getDimensions());
        }
        if (updateProductDTO.getWeight() != null) {
            existingProduct.setWeight(updateProductDTO.getWeight());
        }
        if (updateProductDTO.isActive() != existingProduct.isActive()) {
            existingProduct.setActive(updateProductDTO.isActive());
        }
        if (updateProductDTO.isFeatured() != existingProduct.isFeatured()) {
            existingProduct.setFeatured(updateProductDTO.isFeatured());
        }
        if(updateProductDTO.getSizes() != null) {
            existingProduct.setSizes(updateProductDTO.getSizes());
        }
        if(updateProductDTO.getColorOptions() != null) {
            existingProduct.setColorOptions(updateProductDTO.getColorOptions());
        }
        if (updateProductDTO.getColorOptionImages() != null) {
            existingProduct.setColorOptionImages(updateProductDTO.getColorOptionImages());
        }
    }
}
