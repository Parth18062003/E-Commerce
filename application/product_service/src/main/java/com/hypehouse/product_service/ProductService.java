package com.hypehouse.product_service;

import com.algolia.search.SearchClient;
import com.algolia.search.SearchIndex;
import com.algolia.search.models.indexing.Query;
import com.algolia.search.models.indexing.SearchResult;
import com.hypehouse.common.model.InventoryUpdateMessage;
import com.hypehouse.product_service.config.RabbitConfig;
import com.hypehouse.product_service.model.DisplayProductDTO;
import com.hypehouse.product_service.model.IndexableProduct;
import com.hypehouse.common.model.ProductDTO;
import com.hypehouse.product_service.model.UpdateProductDTO;
import com.hypehouse.product_service.exception.ProductNotFoundException;
import com.hypehouse.product_service.model.Product;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
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
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import java.util.stream.Collectors;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final Logger log = LoggerFactory.getLogger(ProductService.class);
    private final SearchIndex<IndexableProduct> productIndex;
    private final RabbitTemplate productRabbitTemplate;
    private final ConcurrentMap<String, CompletableFuture<Boolean>> inventoryCheckFutures = new ConcurrentHashMap<>();

    private static final String PRODUCTS_CACHE = "products";

    public ProductService(ProductRepository productRepository, SearchClient searchClient, RabbitTemplate productRabbitTemplate) {
        this.productRepository = productRepository;
        this.productIndex = searchClient.initIndex("products", IndexableProduct.class);
        this.productRabbitTemplate = productRabbitTemplate;
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

    public Page<Product> getProductsByIds(List<String> ids, Pageable pageable) {
        log.debug("Fetching products by IDs: {} with pagination: {}", ids, pageable);
        return productRepository.findByIdIn(ids, pageable);
    }

    // Fetch products by category with pagination
    public Page<Product> getProductsByCategory(String category, Pageable pageable) {
        log.debug("Fetching products by category: {} with pagination: {}", category, pageable);
        return productRepository.findByCategory(category, pageable);
    }

    public Page<Product> getProductsByReleaseDate(String releaseDate, Pageable pageable) {
        log.debug("Fetching products released before {} with pagination: {}", releaseDate, pageable);
        return productRepository.findByReleaseDateBefore(releaseDate, pageable);
    }

    public Page<Product> getLatestProducts(String releaseDate, Pageable pageable) {
        log.debug("Fetching products released after {} with pagination: {}", releaseDate, pageable);
        return productRepository.findByReleaseDateAfter(releaseDate, pageable);
    }

    // Fetch products by brand with pagination
    public Page<Product> getProductsByBrand(String brand, Pageable pageable) {
        log.debug("Fetching products by brand: {} with pagination: {}", brand, pageable);
        return productRepository.findByBrand(brand, pageable);
    }

    // Fetch products by gender with pagination
    public Page<Product> getProductsByGender(String gender, Pageable pageable) {
        log.debug("Fetching products by gender: {} with pagination: {}", gender, pageable);
        return productRepository.findByGender(gender, pageable);
    }

    // Fetch products by tags (e.g., trending categories) with pagination
    public Page<Product> getProductsByTags(List<String> tags, Pageable pageable) {
        log.debug("Fetching products with tags: {} with pagination: {}", tags, pageable);

        // Fetch products with tags containing any of the specified tags
        return productRepository.findByTagsContaining(tags, pageable);
    }

    // Fetch products by featured status with pagination
    public Page<Product> getFeaturedProducts(Pageable pageable) {
        log.debug("Fetching featured products with pagination: {}", pageable);
        return productRepository.findByIsFeatured(true, pageable);
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

    public void sendProductToInventory(Product product) {
        // Convert savedProduct to ProductDTO
        log.debug("Sending product to Inventory Service: {}", product);
        ProductDTO productDTO = new ProductDTO();
        productDTO.setId(product.getId());
        productDTO.setSku(product.getSku());

        log.debug("Sending ProductDTO to RabbitMQ: {}", productDTO);
        // Convert the variant list into ProductDTO.VariantDTO objects
        List<ProductDTO.VariantDTO> variantDTOList = product.getVariantList().stream()
                .map(variant -> {
                    ProductDTO.VariantDTO variantDTO = new ProductDTO.VariantDTO();
                    variantDTO.setSku(variant.getSku());  // Variant SKU
                    variantDTO.setColor(variant.getColor());  // Variant color (optional)
                    // Convert sizes to SizeDTO objects
                    List<ProductDTO.SizeDTO> sizeDTOList = variant.getSizes().stream()
                            .map(size -> {
                                ProductDTO.SizeDTO sizeDTO = new ProductDTO.SizeDTO();
                                sizeDTO.setSize(size.getSize());
                                sizeDTO.setStockQuantity(size.getStockQuantity());  // Set stock quantity
                                return sizeDTO;
                            })
                            .collect(Collectors.toList());

                    variantDTO.setSizes(sizeDTOList);  // Set sizes for this variant
                    return variantDTO;
                })
                .collect(Collectors.toList());

        productDTO.setVariants(variantDTOList);  // Set the list of variants

        // Log the ProductDTO being sent
        log.debug("Sending ProductDTO to RabbitMQ: {}", productDTO);

        // Send the ProductDTO to RabbitMQ
        productRabbitTemplate.convertAndSend(RabbitConfig.EXCHANGE_NAME, "product.created", productDTO);
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
        deleteInventoryForProduct(String.valueOf(productId));
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


    @Transactional
    public void updateInventory(String productId, String variantSku, Map<String, Integer> sizeStockMap) {
        log.debug("Updating inventory for product ID: {}, variant SKU: {}", productId, variantSku);

        // Retrieve the product by ID (throws exception if not found)
        Product product = getProductById(productId)
                .orElseThrow(() -> new ProductNotFoundException(productId));

        // Find the variant by SKU
        Product.Variant variant = product.getVariantList().stream()
                .filter(v -> v.getSku().equals(variantSku))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Variant not found for SKU: " + variantSku));

        // Update the sizes in the variant based on sizeStockMap
        sizeStockMap.forEach((sizeName, stockQuantity) -> {
            // Check if the size already exists in the variant
            Optional<Product.SizeVariant> existingSizeVariant = variant.getSizes().stream()
                    .filter(sizeVariant -> sizeVariant.getSize().equals(sizeName)) // Fixed reference to sizeName
                    .findFirst();

            if (existingSizeVariant.isPresent()) {
                // Update stock for the existing size
                existingSizeVariant.get().setStockQuantity(stockQuantity);
            } else {
                // If size doesn't exist, add the new size to the variant
                Product.SizeVariant newSizeVariant = new Product.SizeVariant(sizeName, stockQuantity);
                variant.getSizes().add(newSizeVariant);
            }
        });

        // Recalculate total stock quantity for the variant
        int newVariantStockQuantity = variant.getSizes().stream()
                .mapToInt(Product.SizeVariant::getStockQuantity)  // Correct reference to SizeVariant
                .sum();

        variant.setStockQuantity(newVariantStockQuantity);  // Update the variant's total stock quantity

        // Save the updated product to the database
        productRepository.save(product);

        // Asynchronously index the updated product in Algolia
        indexProductAsync(product);
    }

    @Transactional
    public void addInventory(String productId, String variantSku, String color, Map<String, Integer> sizeStockMap) {
        log.debug("Adding inventory for product ID: {}, variant SKU: {}, color: {}", productId, variantSku, color);

        // Retrieve the product by ID (throws exception if not found)
        Product product = getProductById(productId)
                .orElseThrow(() -> new ProductNotFoundException(productId));

        // Find the variant by SKU
        Product.Variant variant = product.getVariantList().stream()
                .filter(v -> v.getSku().equals(variantSku))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Variant not found for SKU: " + variantSku));

        // Update the sizes in the variant
        variant.getSizes().forEach(size -> {
            String sizeName = size.getSize();
            if (sizeStockMap.containsKey(sizeName)) {
                size.setStockQuantity(sizeStockMap.get(sizeName));
            }
        });

        // Calculate total stock quantity for the variant
        int newVariantStockQuantity = variant.getSizes().stream()
                .mapToInt(Product.SizeVariant::getStockQuantity)  // Correct reference to SizeVariant
                .sum();

        variant.setStockQuantity(newVariantStockQuantity);
        // Save the updated product to the database
        productRepository.save(product);

        // Asynchronously index the updated product in Algolia
        indexProductAsync(product);
    }

    @Transactional
    public void deleteInventoryForProduct(String productId) {
        log.debug("Deleting inventory for product ID: {}", productId);
        // Send message to Inventory service to delete inventory
        InventoryUpdateMessage message = new InventoryUpdateMessage();
        message.setProductId(productId);
        message.setVariantSku(null); // Indicating to delete all inventories for this product
        message.setSizeStockMap(null); // Not needed for deletion
        productRabbitTemplate.convertAndSend(RabbitConfig.EXCHANGE_NAME, RabbitConfig.INVENTORY_UPDATE_ROUTING_KEY, message);
    }
}