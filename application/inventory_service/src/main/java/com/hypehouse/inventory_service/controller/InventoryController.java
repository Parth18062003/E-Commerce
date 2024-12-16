package com.hypehouse.inventory_service.controller;

import com.hypehouse.common.rate_limit.RateLimit;
import com.hypehouse.inventory_service.model.Inventory;
import com.hypehouse.inventory_service.service.InventoryService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/inventory")
public class InventoryController {

    private final InventoryService inventoryService;
    private static final Logger logger = LoggerFactory.getLogger(InventoryController.class);

    public InventoryController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    /**
     * Fetch all inventory records.
     *
     * @return List of all inventory records.
     */
    @GetMapping
    @RateLimit(limitForPeriod = 5, limitRefreshPeriod = 60)
    public ResponseEntity<Page<Inventory>> getAllInventory(Pageable pageable) {
        logger.info("Fetching all inventory records");
        Page<Inventory> inventories = inventoryService.getAllInventory(pageable);
        if(inventories.isEmpty()){
            logger.warn("No inventory records found");
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        }
        logger.info("Fetched {} inventory records", inventories.getTotalElements());
        return ResponseEntity.ok(inventories);
    }

    /**
     * Fetch inventory details for a specific product variant.
     *
     * @param productId  The ID of the product.
     * @param variantSku The SKU of the variant.
     * @return The inventory for the given product variant.
     */
    @GetMapping("/{productId}/variant/{variantSku}")
    @RateLimit(limitForPeriod = 5, limitRefreshPeriod = 60)
    public ResponseEntity<Inventory> getInventory(@PathVariable String productId, @PathVariable String variantSku) {
        logger.info("Fetching inventory for productId: {} and variantSku: {}", productId, variantSku);
        Optional<Inventory> inventory = inventoryService.getInventoryByProductAndVariant(productId, variantSku);

        if (inventory.isPresent()) {
            logger.info("Inventory found for productId: {} and variantSku: {}", productId, variantSku);
            return ResponseEntity.ok(inventory.get());
        } else {
            logger.warn("Inventory not found for productId: {} and variantSku: {}", productId, variantSku);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    /**
     * Fetch all inventory for a specific product.
     *
     * @param productId The ID of the product.
     * @return List of inventory for the given product.
     */
    @GetMapping("/{productId}")
    @RateLimit(limitForPeriod = 5, limitRefreshPeriod = 60)
    public ResponseEntity<List<Inventory>> getAllInventory(@PathVariable String productId) {
        logger.info("Fetching all inventory for productId: {}", productId);
        try {
            List<Inventory> inventories = inventoryService.getAllInventoryByProductId(productId);
            logger.info("Fetched {} inventory records for productId: {}", inventories.size(), productId);
            return ResponseEntity.ok(inventories);
        } catch (RuntimeException e) {
            logger.error("Error fetching inventory for productId: {}", productId, e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    /**
     * Add inventory for a product, which could include adding stock for sizes or creating a new variant.
     *
     * @param productId  The ID of the product.
     * @param variantSku The SKU of the variant.
     * @param inventoryRequest The request body containing color and size stock.
     * @return The updated inventory.
     */
    @PostMapping("/add/{productId}/{variantSku}")
    @RateLimit(limitForPeriod = 5, limitRefreshPeriod = 60)
    public ResponseEntity<Inventory> addInventory(
            @PathVariable String productId,
            @PathVariable String variantSku,
            @RequestBody InventoryRequest inventoryRequest) {
        logger.info("Adding inventory for productId: {}, variantSku: {}", productId, variantSku);
        try {
            Inventory updatedInventory = inventoryService.addInventory(productId, variantSku, inventoryRequest.getColor(), inventoryRequest.getSizeStock());
            logger.info("Successfully added inventory for productId: {}, variantSku: {}", productId, variantSku);
            return ResponseEntity.status(HttpStatus.CREATED).body(updatedInventory);
        } catch (RuntimeException e) {
            logger.error("Error adding inventory for productId: {}, variantSku: {}", productId, variantSku, e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    /**
     * Add stock to a specific product variant.
     *
     * @param productId  The ID of the product.
     * @param variantSku The SKU of the variant.
     * @param size       The size of the product variant.
     * @param quantity   The quantity to add.
     * @return The updated inventory.
     */
    @PostMapping("/{productId}/variant/{variantSku}/size/{size}/add-stock")
    @RateLimit(limitForPeriod = 5, limitRefreshPeriod = 60)
    public ResponseEntity<Inventory> addStock(
            @PathVariable String productId,
            @PathVariable String variantSku,
            @PathVariable String size,
            @RequestParam int quantity) {
        if (quantity <= 0) {
            logger.warn("Invalid quantity: {}. Quantity must be greater than zero.", quantity);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }

        logger.info("Adding stock for productId: {}, variantSku: {}, size: {}, quantity: {}", productId, variantSku, size, quantity);
        try {
            Inventory updatedInventory = inventoryService.addStock(productId, variantSku, size, quantity);
            logger.info("Successfully added stock for productId: {}, variantSku: {}, size: {}", productId, variantSku, size);
            return ResponseEntity.ok(updatedInventory);
        } catch (RuntimeException e) {
            logger.error("Error adding stock for productId: {}, variantSku: {}, size: {}", productId, variantSku, size, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    /**
     * Update stock quantity for a specific product variant.
     *
     * @param productId  The ID of the product.
     * @param variantSku The SKU of the variant.
     * @param size       The size of the product variant.
     * @param quantity   The quantity to update (positive to add, negative to reduce).
     * @return The updated inventory.
     */
    @PutMapping("/{productId}/variant/{variantSku}/size/{size}/stock")
    @RateLimit(limitForPeriod = 5, limitRefreshPeriod = 60)
    public ResponseEntity<Inventory> updateStockQuantity(
            @PathVariable String productId,
            @PathVariable String variantSku,
            @PathVariable String size,
            @RequestParam int quantity) {
        if (quantity == 0) {
            logger.warn("Invalid quantity: {}. Quantity cannot be zero.", quantity);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }

        logger.info("Updating stock quantity for productId: {}, variantSku: {}, size: {}, quantity: {}", productId, variantSku, size, quantity);
        try {
            Inventory updatedInventory = inventoryService.updateStockQuantity(productId, variantSku, size, quantity);
            logger.info("Successfully updated stock for productId: {}, variantSku: {}, size: {}", productId, variantSku, size);
            return ResponseEntity.ok(updatedInventory);
        } catch (RuntimeException e) {
            logger.error("Error updating stock for productId: {}, variantSku: {}, size: {}", productId, variantSku, size, e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    /**
     * Reduce stock when an order is placed.
     *
     * @param productId  The ID of the product.
     * @param variantSku The SKU of the variant.
     * @param size       The size of the product variant.
     * @param quantity   The quantity to reduce.
     * @return The updated inventory.
     */
    @PutMapping("/{productId}/variant/{variantSku}/size/{size}/reduce-stock")
    @RateLimit(limitForPeriod = 5, limitRefreshPeriod = 60)
    public ResponseEntity<Inventory> reduceStock(
            @PathVariable String productId,
            @PathVariable String variantSku,
            @PathVariable String size,
            @RequestParam int quantity) {
        if (quantity <= 0) {
            logger.warn("Invalid quantity: {}. Quantity must be greater than zero for reducing stock.", quantity);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }

        logger.info("Reducing stock for productId: {}, variantSku: {}, size: {}, quantity: {}", productId, variantSku, size, quantity);
        try {
            Inventory updatedInventory = inventoryService.reduceStock(productId, variantSku, size, quantity);
            logger.info("Successfully reduced stock for productId: {}, variantSku: {}, size: {}", productId, variantSku, size);
            return ResponseEntity.ok(updatedInventory);
        } catch (RuntimeException e) {
            logger.error("Error reducing stock for productId: {}, variantSku: {}, size: {}", productId, variantSku, size, e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    /**
     * Reserve stock for a specific product variant.
     *
     * @param productId  The ID of the product.
     * @param variantSku The SKU of the variant.
     * @param size       The size of the product variant.
     * @param quantity   The quantity to reserve.
     * @return The updated inventory with reserved stock.
     */
    @PutMapping("/{productId}/variant/{variantSku}/size/{size}/reserve-stock")
    @RateLimit(limitForPeriod = 5, limitRefreshPeriod = 60)
    public ResponseEntity<Inventory> reserveStock(
            @PathVariable String productId,
            @PathVariable String variantSku,
            @PathVariable String size,
            @RequestParam int quantity) {
        if (quantity <= 0) {
            logger.warn("Invalid quantity: {}. Quantity must be greater than zero for reserving stock.", quantity);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }

        logger.info("Reserving stock for productId: {}, variantSku: {}, size: {}, quantity: {}", productId, variantSku, size, quantity);
        try {
            Inventory updatedInventory = inventoryService.reserveStock(productId, variantSku, size, quantity);
            logger.info("Successfully reserved stock for productId: {}, variantSku: {}, size: {}", productId, variantSku, size);
            return ResponseEntity.ok(updatedInventory);
        } catch (RuntimeException e) {
            logger.error("Error reserving stock for productId: {}, variantSku: {}, size: {}", productId, variantSku, size, e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    /**
     * Release reserved stock if an order is cancelled.
     *
     * @param productId  The ID of the product.
     * @param variantSku The SKU of the variant.
     * @param size       The size of the product variant.
     * @param quantity   The quantity to release.
     * @return The updated inventory with released reserved stock.
     */
    @PutMapping("/{productId}/variant/{variantSku}/size/{size}/release-reserved-stock")
    @RateLimit(limitForPeriod = 5, limitRefreshPeriod = 60)
    public ResponseEntity<Inventory> releaseReservedStock(
            @PathVariable String productId,
            @PathVariable String variantSku,
            @PathVariable String size,
            @RequestParam int quantity) {
        if (quantity <= 0) {
            logger.warn("Invalid quantity: {}. Quantity must be greater than zero for releasing reserved stock.", quantity);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }

        logger.info("Releasing reserved stock for productId: {}, variantSku: {}, size: {}, quantity: {}", productId, variantSku, size, quantity);
        try {
            Inventory updatedInventory = inventoryService.releaseReservedStock(productId, variantSku, size, quantity);
            logger.info("Successfully released reserved stock for productId: {}, variantSku: {}, size: {}", productId, variantSku, size);
            return ResponseEntity.ok(updatedInventory);
        } catch (RuntimeException e) {
            logger.error("Error releasing reserved stock for productId: {}, variantSku: {}, size: {}", productId, variantSku, size, e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    public static class InventoryRequest {
        private String color;
        private Map<String, Integer> sizeStock;

        // Getters and setters
        public String getColor() {
            return color;
        }

        public void setColor(String color) {
            this.color = color;
        }

        public Map<String, Integer> getSizeStock() {
            return sizeStock;
        }

        public void setSizeStock(Map<String, Integer> sizeStock) {
            this.sizeStock = sizeStock;
        }
    }

}