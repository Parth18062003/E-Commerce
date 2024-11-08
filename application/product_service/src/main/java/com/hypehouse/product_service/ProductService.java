package com.hypehouse.product_service;

import com.algolia.search.SearchClient;
import com.algolia.search.SearchIndex;
import com.algolia.search.models.indexing.Query;
import com.algolia.search.models.indexing.SearchResult;
import com.hypehouse.product_service.model.IndexableProduct;
import com.hypehouse.product_service.model.UpdateProductDTO;
import com.hypehouse.product_service.exception.ProductNotFoundException;
import com.hypehouse.product_service.model.Product;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.scheduling.annotation.Async;

import jakarta.validation.Valid;
import org.springframework.transaction.annotation.Transactional;

import java.lang.reflect.Field;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final Logger log = LoggerFactory.getLogger(ProductService.class);
    private final SearchIndex<IndexableProduct> productIndex;

    public ProductService(ProductRepository productRepository, SearchClient searchClient) {
        this.productRepository = productRepository;
        this.productIndex = searchClient.initIndex("products", IndexableProduct.class);
    }

    // Async method for Algolia indexing to prevent blocking
    @Async
    public void indexProductAsync(Product product) {
        IndexableProduct indexableProduct = convertToIndexableProduct(product);
        try {
            productIndex.saveObject(indexableProduct).waitTask();
        } catch (Exception e) {
            log.error("Failed to index product in Algolia: {}", e.getMessage());
        }
    }

    // Optimizing product search with caching
    @Cacheable(value = "productSearchCache", key = "#query + #pageable.pageNumber")
    public List<IndexableProduct> searchProducts(String query, Pageable pageable) throws InterruptedException {
        // Map the Pageable to Algolia's RequestOptions (or a similar object if you're using a different search engine)
        int page = pageable.getPageNumber();
        int size = pageable.getPageSize();

        // Prepare the Algolia search query
        Query algoliaQuery = new Query(query)
                .setPage(page) // Page number
                .setHitsPerPage(size); // Number of results per page

        // Perform the search
        SearchResult<IndexableProduct> results = productIndex.search(algoliaQuery);

        // Return the hits (list of results)
        return results.getHits();
    }



    // Optimized method for fetching all products with pagination
    public Page<Product> getAllProducts(Pageable pageable) {
        log.debug("Fetching all products with pagination: {}", pageable);
        return productRepository.findAll(pageable);
    }

    // Fetch product by ID
    public Optional<Product> getProductById(String id) {
        log.debug("Fetching product with ID: {}", id);
        return productRepository.findById(UUID.fromString(id));
    }

    // Improved save method with async indexing
    public Product saveProduct(@Valid Product product) {
        log.debug("Inserting product with details: {}", product);
        Product savedProduct = productRepository.save(product);
        indexProductAsync(savedProduct); // Async indexing
        return savedProduct;
    }

    // Optimized update with less code repetition
    public Product updateProduct(String id, @Valid UpdateProductDTO updateProductDTO) {
        log.debug("Updating product with ID: {}", id);
        Product existingProduct = productRepository.findById(UUID.fromString(id))
                .orElseThrow(() -> new ProductNotFoundException(id));

        updateFields(existingProduct, updateProductDTO);
        existingProduct.setUpdatedAt(LocalDateTime.now());
        Product updatedProduct = productRepository.save(existingProduct);

        indexProductAsync(updatedProduct); // Async indexing
        return updatedProduct;
    }

    // Delete product with improved error handling and async delete from Algolia
    @Transactional
    public void deleteProduct(String id) {
        log.debug("Deleting product with ID: {}", id);
        UUID productId = UUID.fromString(id);
        if (!productRepository.existsById(productId)) {
            throw new ProductNotFoundException(id);
        }
        productRepository.deleteById(productId);
        CompletableFuture.runAsync(() -> deleteProductFromAlgolia(id));
    }


    // Method to delete product from Algolia
    public void deleteProductFromAlgolia(String productId) {
        try {
            productIndex.deleteObject(productId).waitTask(); // Blocking delete
            log.info("Successfully deleted product {} from Algolia", productId);
        } catch (Exception e) {
            log.error("Failed to delete product {} from Algolia: {}", productId, e.getMessage());
        }
    }

    private void updateFields(Product existingProduct, UpdateProductDTO updateProductDTO) {
        Arrays.stream(UpdateProductDTO.class.getDeclaredFields())
                .filter(field -> !field.isSynthetic())
                .forEach(field -> {
                    try {
                        field.setAccessible(true);
                        Object value = field.get(updateProductDTO);
                        if (value != null) {
                            Field productField = Product.class.getDeclaredField(field.getName());
                            productField.setAccessible(true);
                            productField.set(existingProduct, value);
                        }
                    } catch (NoSuchFieldException | IllegalAccessException e) {
                        log.warn("Error updating field: {}", field.getName(), e);
                    }
                });
    }

    private IndexableProduct convertToIndexableProduct(Product product) {
        IndexableProduct indexableProduct = new IndexableProduct();
        indexableProduct.setObjectID(product.getId());
        indexableProduct.setName(product.getName());
        indexableProduct.setDescription(product.getDescription());
        indexableProduct.setPrice(product.getPrice());
        indexableProduct.setSku(product.getSku());
        indexableProduct.setDiscount(product.getDiscount());
        indexableProduct.setTags(product.getTags());
        indexableProduct.setCategory(product.getCategory());
        indexableProduct.setBrand(product.getBrand());
        indexableProduct.setColorOptions(product.getColorOptions());
        indexableProduct.setColorOptionImages(product.getColorOptionImages());
        indexableProduct.setSizes(product.getSizes());
        return indexableProduct;
    }
}
