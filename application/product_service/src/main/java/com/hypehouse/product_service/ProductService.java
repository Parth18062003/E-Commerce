/*
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
*/
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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.scheduling.annotation.Async;
import jakarta.validation.Valid;
import org.springframework.transaction.annotation.Transactional;
import java.lang.reflect.Field;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.CompletableFuture;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final Logger log = LoggerFactory.getLogger(ProductService.class);
    private final SearchIndex<IndexableProduct> productIndex;

    private static final String PRODUCTS_CACHE = "products";

    public ProductService(ProductRepository productRepository, SearchClient searchClient) {
        this.productRepository = productRepository;
        this.productIndex = searchClient.initIndex("products", IndexableProduct.class);
    }

    // Fetch all products with pagination
    //@Cacheable(value = PRODUCTS_CACHE, key = "'all.page.'+#pageable.pageNumber+'.size.'+#pageable.pageSize")
    public Page<Product> getAllProducts(Pageable pageable) {
        log.debug("Fetching all products with pagination: {}", pageable);
        return productRepository.findAll(pageable);
    }

    // Fetch product by ID with caching
    //@Cacheable(value = PRODUCTS_CACHE, key = "#id")
    public Optional<Product> getProductById(String id) {
        log.debug("Fetching product with ID: {}", id);
        return productRepository.findById(id); // Return an Optional<Product> from repository
    }

    // Search products through Algolia
    public List<IndexableProduct> searchProducts(String query, Pageable pageable) {
        try {
            Query algoliaQuery = new Query(query)
                    .setPage(pageable.getPageNumber())
                    .setHitsPerPage(pageable.getPageSize());

            SearchResult<IndexableProduct> results = productIndex.search(algoliaQuery);
            return results.getHits();
        } catch (Exception e) {
            log.error("Error searching products: {}", e.getMessage());
            return Collections.emptyList();
        }
    }

    // Save product and index asynchronously
    //@CacheEvict(value = PRODUCTS_CACHE, allEntries = true)
    public Product saveProduct(@Valid Product product) {
        log.debug("Saving product with details: {}", product);
        Product savedProduct = productRepository.save(product);
        indexProductAsync(savedProduct);
        return savedProduct;
    }

    // Update product and index asynchronously
    //@CacheEvict(value = PRODUCTS_CACHE, allEntries = true)
    public Product updateProduct(String id, @Valid UpdateProductDTO updateProductDTO) {
        log.debug("Updating product with ID: {}", id);

        // Retrieve the product by ID (throws exception if not found)
        Product existingProduct = getProductById(id)
                .orElseThrow(() -> new ProductNotFoundException(id)); // Ensure we handle the case where the product is not found

        // Update the fields of the existing product
        updateFields(existingProduct, updateProductDTO);

        // Set the updated timestamp
        existingProduct.setUpdatedAt(LocalDateTime.now());

        // Save the updated product to the database
        Product updatedProduct = productRepository.save(existingProduct);

        // Asynchronously index the updated product in Algolia
        indexProductAsync(updatedProduct);

        return updatedProduct;
    }

    // Delete product and async delete from Algolia
    @Transactional
    //@CacheEvict(value = PRODUCTS_CACHE, allEntries = true)
    public void deleteProduct(String id) {
        log.debug("Deleting product with ID: {}", id);
        UUID productId = UUID.fromString(id);
        if (!productRepository.existsById(String.valueOf(productId))) {
            throw new ProductNotFoundException(id);
        }
        productRepository.deleteById(String.valueOf(productId));
        CompletableFuture.runAsync(() -> deleteProductFromAlgolia(id));
    }

    // Async method to index product in Algolia
    @Async
    public void indexProductAsync(Product product) {
        IndexableProduct indexableProduct = convertToIndexableProduct(product);
        try {
            productIndex.saveObject(indexableProduct).waitTask();
            log.info("Successfully indexed product with ID: {}", product.getId());
        } catch (Exception e) {
            log.error("Failed to index product in Algolia: {}", e.getMessage());
        }
    }

    // Async method to delete product from Algolia
    private void deleteProductFromAlgolia(String productId) {
        try {
            productIndex.deleteObject(productId).waitTask();
            log.info("Successfully deleted product {} from Algolia", productId);
        } catch (Exception e) {
            log.error("Failed to delete product {} from Algolia: {}", productId, e.getMessage());
        }
    }

    // Method to update fields from UpdateProductDTO to Product
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

    // Method to convert Product to IndexableProduct for Algolia indexing
    private IndexableProduct convertToIndexableProduct(Product product) {
        // Create a new IndexableProduct instance
        IndexableProduct indexableProduct = new IndexableProduct();

        // Set general product information
        indexableProduct.setObjectID(product.getId());
        indexableProduct.setName(product.getName());
        indexableProduct.setDescription(product.getDescription());
        indexableProduct.setSku(product.getSku());
        indexableProduct.setPrice(product.getPrice());
        indexableProduct.setDiscount(product.getDiscount());
        indexableProduct.setCategory(product.getCategory());
        indexableProduct.setBrand(product.getBrand());
        indexableProduct.setTags(product.getTags());
        indexableProduct.setRating(product.getRating());
        indexableProduct.setType(product.getType());
        indexableProduct.setGender(product.getGender());
        indexableProduct.setMaterial(product.getMaterial());
        indexableProduct.setReleaseDate(product.getReleaseDate());

        // Handle price and discount (use the first variant's price if available)
        Float price = Optional.ofNullable(product.getPrice()).orElse(0.0f);  // Default to 0.0f if null
        Float discount = Optional.ofNullable(product.getDiscount()).orElse(0.0f);

        // Create list to hold variants
        List<Product.Variant> variants = new ArrayList<>();

        // Handle variants data
        if (product.getVariantList() != null && !product.getVariantList().isEmpty()) {
            for (Product.Variant productVariant : product.getVariantList()) {
                IndexableProduct.Variant indexableVariant = new IndexableProduct.Variant();

                // Set variant-specific fields (color, SKU, price, sale price, etc.)
                indexableVariant.setColor(productVariant.getColor());
                indexableVariant.setPrice(Optional.ofNullable(productVariant.getPrice()).orElse(price));
                indexableVariant.setDiscount(Optional.ofNullable(productVariant.getDiscount()).orElse(discount));

                // Handle sizes (multiple sizes per variant)
                List<String> sizes = new ArrayList<>();
                if (productVariant.getSizes() != null) {
                    productVariant.getSizes().forEach(sizeVariant -> sizes.add(sizeVariant.getSize()));
                }
                indexableVariant.setSizes(sizes);

                // Handle color option images (specific to variant's color)
                List<String> colorImages = productVariant.getColorOptionImages();
                indexableVariant.setColorOptionImages(colorImages);

                // Add the variant to the list of variants
                variants.add(productVariant);
            }
        }

        // Set the list of variants in the IndexableProduct
        indexableProduct.setVariants(variants);

        return indexableProduct;
    }


/*
    private IndexableProduct convertToIndexableProduct(Product product) {
        IndexableProduct indexableProduct = new IndexableProduct();
        indexableProduct.setObjectID(product.getId());
        indexableProduct.setName(product.getName());
        indexableProduct.setDescription(product.getDescription());
        indexableProduct.setProductURL(product.getProductURL());
        indexableProduct.setCategory(product.getCategory());
        indexableProduct.setBrand(product.getBrand());
        indexableProduct.setTags(product.getTags());
        indexableProduct.setRating(product.getRating());
        indexableProduct.setReviewCount(product.getReviewCount());

        // Handle price and variants
        BigDecimal price = product.getPrice();
        BigDecimal discount = product.getDiscount();
        if (product.getVariantList() != null && !product.getVariantList().isEmpty()) {
            Product.Variant firstVariant = product.getVariantList().get(0);
            price = Optional.ofNullable(firstVariant.getPrice()).orElse(price);
            discount = Optional.ofNullable(firstVariant.getSalePrice()).orElse(discount);
            if (firstVariant.getSizes() != null && !firstVariant.getSizes().isEmpty()) {
                indexableProduct.setSku(firstVariant.getSizes().get(0).getSku());
            }
        }
        indexableProduct.setPrice(price);
        indexableProduct.setDiscount(discount);

        // Handle variants data
        List<String> colorOptions = new ArrayList<>();
        Map<String, List<String>> colorOptionImages = new HashMap<>();
        List<String> sizes = new ArrayList<>();
        if (product.getVariantList() != null) {
            for (Product.Variant variant : product.getVariantList()) {
                if (variant.getColor() != null) {
                    colorOptions.add(variant.getColor());
                }
                if (variant.getColorOptionImages() != null) {
                    colorOptionImages.put(variant.getColor(), variant.getColorOptionImages());
                }
                if (variant.getSizes() != null) {
                    variant.getSizes().forEach(sizeVariant -> sizes.add(sizeVariant.getSize()));
                }
            }
        }
        indexableProduct.setColorOptions(colorOptions);
        indexableProduct.setColorOptionImages(colorOptionImages);
        indexableProduct.setSizes(sizes);

        // Additional attributes
        indexableProduct.setType(product.getType());
        indexableProduct.setGender(product.getGender());
        indexableProduct.setMaterial(product.getMaterial());
        indexableProduct.setReleaseDate(product.getReleaseDate());

        return indexableProduct;
    }
*/

}
