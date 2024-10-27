package com.hypehouse.product_service;

import com.algolia.search.SearchClient;
import com.algolia.search.SearchIndex;
import com.algolia.search.models.indexing.Query;
import com.algolia.search.models.indexing.SearchResult;
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
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ExecutionException;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final Logger log = LoggerFactory.getLogger(ProductService.class);
    private final SearchIndex<Product> productIndex;

    public ProductService(ProductRepository productRepository, SearchClient searchClient) {
        this.productRepository = productRepository;
        this.productIndex = searchClient.initIndex("products", Product.class);
    }

    public void indexProduct(Product product) throws ExecutionException, InterruptedException {
        productIndex.saveObject(product).waitTask();
    }

    public List<Product> searchProducts(String query) throws ExecutionException, InterruptedException {
        SearchResult<Product> results = productIndex.search(new Query(query));
        return results.getHits();
    }

    public void deleteProductFromAlgolia(String objectId) throws ExecutionException, InterruptedException {
        productIndex.deleteObject(objectId).waitTask();
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
        Product savedProduct = productRepository.save(product);
        try {
            indexProduct(savedProduct);
        } catch (ExecutionException | InterruptedException e) {
            log.error("Failed to index product in Algolia: {}", e.getMessage());
        }
        return savedProduct;
    }

    @CachePut(value = "products", key = "#id")
    public Product updateProduct(String id, @Valid UpdateProductDTO updateProductDTO) {
        log.debug("Updating product with ID: {}", id);
        Product existingProduct = productRepository.findById(UUID.fromString(id))
                .orElseThrow(() -> new ProductNotFoundException(id));

        updateFields(existingProduct, updateProductDTO);
        existingProduct.setUpdatedAt(LocalDateTime.now());
        Product updatedProduct = productRepository.save(existingProduct);

        try {
            indexProduct(updatedProduct);
        } catch (ExecutionException | InterruptedException e) {
            log.error("Failed to index updated product in Algolia: {}", e.getMessage());
        }

        return updatedProduct;
    }

    @CacheEvict(value = "products", key = "#id")
    public void deleteProduct(String id) {
        log.debug("Deleting product with ID: {}", id);
        UUID productId = UUID.fromString(id);
        if (!productRepository.existsById(productId)) {
            throw new ProductNotFoundException(id);
        }
        productRepository.deleteById(productId);
        try {
            deleteProductFromAlgolia(productId.toString());
        } catch (ExecutionException | InterruptedException e) {
            log.error("Failed to delete product from Algolia: {}", e.getMessage());
        }
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
        if (updateProductDTO.getSizes() != null) {
            existingProduct.setSizes(updateProductDTO.getSizes());
        }
        if (updateProductDTO.getColorOptions() != null) {
            existingProduct.setColorOptions(updateProductDTO.getColorOptions());
        }
        if (updateProductDTO.getColorOptionImages() != null) {
            existingProduct.setColorOptionImages(updateProductDTO.getColorOptionImages());
        }
    }
}
