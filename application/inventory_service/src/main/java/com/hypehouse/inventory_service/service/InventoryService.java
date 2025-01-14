package com.hypehouse.inventory_service.service;

import com.hypehouse.common.model.InventoryUpdateMessage;
import com.hypehouse.inventory_service.config.RabbitConfig;
import com.hypehouse.inventory_service.model.Inventory;
import com.hypehouse.inventory_service.model.Inventory.Variant;
import com.hypehouse.inventory_service.model.Inventory.SizeStock;
import com.hypehouse.inventory_service.repository.InventoryRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class InventoryService {

    private static final Logger log = LoggerFactory.getLogger(InventoryService.class);
    @Autowired
    private InventoryRepository inventoryRepository;

    @Autowired
    private RabbitTemplate inventoryRabbitTemplate;

    /**
     * Add inventory for a product (could include adding quantities for sizes or creating a new variant).
     *
     * @param productId The ID of the product.
     * @param variantSku The SKU of the variant.
     * @param color The color of the variant.
     * @param sizeStock A map of size and quantity to be added.
     * @return The updated inventory.
     */
    public Inventory addInventory(String productId, String variantSku, String color, Map<String, Integer> sizeStock) {
        if (sizeStock == null || sizeStock.isEmpty()) {
            throw new RuntimeException("Size stock map cannot be null or empty.");
        }

        // Convert map to list of SizeStock
        List<SizeStock> sizeStockList = new ArrayList<>();
        sizeStock.forEach((size, quantity) -> {
            if (quantity <= 0) {
                throw new RuntimeException("Quantity must be a positive integer for size: " + size);
            }
            sizeStockList.add(new SizeStock(size, quantity));
        });

        // Check if the inventory already exists for the given productId and variantSku
        Optional<Inventory> existingInventory = inventoryRepository.findByProductIdAndVariantSku(productId, variantSku);
        Inventory inventory;

        if (existingInventory.isPresent()) {
            // If the inventory already exists, update the sizes and quantities
            inventory = existingInventory.get();
            Variant variant = inventory.getVariant();
            List<SizeStock> currentSizeStock = variant.getSizeStock();

            // Add the new stock to the existing stock
            sizeStockList.forEach(newSizeStock -> {
                boolean found = false;
                for (SizeStock currentSizeStockItem : currentSizeStock) {
                    if (currentSizeStockItem.getSize().equals(newSizeStock.getSize())) {
                        currentSizeStockItem.setStockQuantity(currentSizeStockItem.getStockQuantity() + newSizeStock.getStockQuantity());
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    currentSizeStock.add(newSizeStock);
                }
            });

            // Recalculate total stock and available stock
            int newStockQuantity = currentSizeStock.stream().mapToInt(SizeStock::getStockQuantity).sum();
            inventory.setStockQuantity(newStockQuantity);
            inventory.setAvailableStock(newStockQuantity - inventory.getReservedStock());
            inventory.setUpdatedAt(LocalDateTime.now());
        } else {
            // If inventory doesn't exist, create a new inventory entry
            Variant newVariant = new Variant();
            newVariant.setSizeStock(sizeStockList);
            newVariant.setColor(color);

            inventory = new Inventory();
            inventory.setProductId(productId);
            inventory.setVariantSku(variantSku);
            inventory.setVariant(newVariant);
            inventory.setStockQuantity(sizeStockList.stream().mapToInt(SizeStock::getStockQuantity).sum());
            inventory.setReservedStock(0);
            inventory.setAvailableStock(inventory.getStockQuantity());
            inventory.setCreatedAt(LocalDateTime.now());
            inventory.setUpdatedAt(LocalDateTime.now());
        }

        // Save the updated or new inventory
        Inventory updatedInventory = inventoryRepository.save(inventory);

        // Send message to Product service
        sendInventoryUpdateMessage(updatedInventory);

        return updatedInventory;
    }

    /**
     * Add stock for a specific product variant.
     *
     * @param productId The ID of the product.
     * @param variantSku The SKU of the variant.
     * @param size The size of the product variant.
     * @param quantity The quantity to add (should be a positive integer).
     * @return The updated inventory.
     */
    public Inventory addStock(String productId, String variantSku,String size, int quantity) {
        if (quantity <= 0) {
            throw new RuntimeException("Quantity must be a positive integer.");
        }

        // Check if the inventory already exists for the given productId and variantSku
        Optional<Inventory> existingInventory = inventoryRepository.findByProductIdAndVariantSku(productId, variantSku);
        Inventory inventory;

        if (existingInventory.isPresent()) {
            // If the inventory already exists, update the sizes and quantities
            inventory = existingInventory.get();
            Variant variant = inventory.getVariant();
            List<SizeStock> currentSizeStock = variant.getSizeStock();

            // Find the SizeStock object with the matching size and update the quantity
            boolean found = false;
            for (SizeStock sizeStockItem : currentSizeStock) {
                if (sizeStockItem.getSize().equals(size)) {
                    sizeStockItem.setStockQuantity(sizeStockItem.getStockQuantity() + quantity);
                    found = true;
                    break;
                }
            }
            if (!found) {
                currentSizeStock.add(new SizeStock(size, quantity));
            }

            // Recalculate total stock and available stock
            int newStockQuantity = currentSizeStock.stream().mapToInt(SizeStock::getStockQuantity).sum();
            inventory.setStockQuantity(newStockQuantity);
            inventory.setAvailableStock(newStockQuantity - inventory.getReservedStock());
            inventory.setUpdatedAt(LocalDateTime.now());
        } else {
            // If inventory doesn't exist, create a new inventory entry
            Variant newVariant = new Variant();
            List<SizeStock> sizeStockList = new ArrayList<>();
            sizeStockList.add(new SizeStock(size, quantity));
            newVariant.setSizeStock(sizeStockList);
            newVariant.setColor("Default"); // Assuming "Default" color for simplicity, this can be customized

            inventory = new Inventory();
            inventory.setProductId(productId);
            inventory.setVariantSku(variantSku);
            inventory.setVariant(newVariant);
            inventory.setStockQuantity(quantity);
            inventory.setReservedStock(0);
            inventory.setAvailableStock(quantity);
            inventory.setCreatedAt(LocalDateTime.now());
            inventory.setUpdatedAt(LocalDateTime.now());
        }

        // Save the updated or new inventory
        Inventory updatedInventory = inventoryRepository.save(inventory);

        // Send message to Product service
        sendInventoryUpdateMessage(updatedInventory);

        return updatedInventory;
    }

    /**
     * Fetch all inventory.
     * @return List of all inventory.
     */
    public Page<Inventory> getAllInventory(Pageable pageable) {
        log.debug("Fetching all inventory.");
        return inventoryRepository.findAll(pageable);
    }

    /**
     * Fetch all inventory for a product by its productId.
     *
     * @param productId The ID of the product.
     * @return List of inventory for the given product.
     */
    public List<Inventory> getAllInventoryByProductId(String productId) {
        // Fetching all inventories related to the productId
        return inventoryRepository.findByProductId(productId);
    }

    /**
     * Fetch inventory for a specific product variant.
     *
     * @param productId The ID of the product.
     * @param variantSku The SKU of the variant.
     * @return The inventory for the given product variant.
     */
    public Optional<Inventory> getInventoryByProductAndVariant(String productId, String variantSku) {
        return inventoryRepository.findByProductIdAndVariantSku(productId, variantSku);
    }

    /**
     * Get the inventory object and handle errors if inventory or size is invalid.
     */
    private Inventory getInventoryWithValidSize(String productId, String variantSku, String size) {
        Inventory inventory = getInventoryByProductAndVariant(productId, variantSku)
                .orElseThrow(() -> new RuntimeException("Inventory not found for SKU: " + variantSku));
        Variant variant = inventory.getVariant();
        List<SizeStock> sizeStock = variant.getSizeStock();
        boolean found = false;
        for (SizeStock sizeStockItem : sizeStock) {
            if (sizeStockItem.getSize().equals(size)) {
                found = true;
                break;
            }
        }
        if (!found) {
            throw new RuntimeException("Size " + size + " not found in inventory.");
        }
        return inventory;
    }

    /**
     * Update stock for a specific product variant (e.g., after an order or manual stock adjustment).
     *
     * @param productId The ID of the product.
     * @param variantSku The SKU of the variant.
     * @param size The size of the product variant.
     * @param quantity The quantity to update (positive to add stock, negative to remove).
     * @return The updated inventory.
     */
    public Inventory updateStockQuantity(String productId, String variantSku, String size, int quantity) {
        Inventory inventory = getInventoryWithValidSize(productId, variantSku, size);
        Variant variant = inventory.getVariant();
        List<SizeStock> sizeStock = variant.getSizeStock();
        boolean found = false;
        for (SizeStock sizeStockItem : sizeStock) {
            if (sizeStockItem.getSize().equals(size)) {
                int currentStock = sizeStockItem.getStockQuantity();
                int updatedStock = currentStock + quantity;
                if (updatedStock < 0) {
                    throw new RuntimeException("Insufficient stock available.");
                }
                sizeStockItem.setStockQuantity(updatedStock);
                found = true;
                break;
            }
        }
        if (!found) {
            throw new RuntimeException("Size " + size + " not found in inventory.");
        }

        // Recalculate total stock and available stock
        int newStockQuantity = sizeStock.stream().mapToInt(SizeStock::getStockQuantity).sum();
        inventory.setStockQuantity(newStockQuantity);
        inventory.setAvailableStock(newStockQuantity - inventory.getReservedStock());
        inventory.setUpdatedAt(LocalDateTime.now());

        Inventory updatedInventory = inventoryRepository.save(inventory);

        // Send message to Product service
        sendInventoryUpdateMessage(updatedInventory);

        return updatedInventory;
    }

    /**
     * Reduce stock for a specific product variant when an order is placed.
     *
     * @param productId The ID of the product.
     * @param variantSku The SKU of the variant.
     * @param size The size of the product variant.
     * @param quantity The quantity to reduce (should be a positive integer).
     * @return The updated inventory.
     */
    public Inventory reduceStock(String productId, String variantSku, String size, int quantity) {
        Inventory inventory = getInventoryWithValidSize(productId, variantSku, size);
        Variant variant = inventory.getVariant();
        List<SizeStock> sizeStock = variant.getSizeStock();
        boolean found = false;
        for (SizeStock sizeStockItem : sizeStock) {
            if (sizeStockItem.getSize().equals(size)) {
                int currentStock = sizeStockItem.getStockQuantity();
                int newStock = currentStock - quantity;
                if (newStock < 0) {
                    throw new RuntimeException("Not enough stock to reduce.");
                }
                sizeStockItem.setStockQuantity(newStock);
                found = true;
                break;
            }
        }
        if (!found) {
            throw new RuntimeException("Size " + size + " not found in inventory.");
        }

        // Recalculate total stock and available stock
        int newStockQuantity = sizeStock.stream().mapToInt(SizeStock::getStockQuantity).sum();
        inventory.setStockQuantity(newStockQuantity);
        inventory.setAvailableStock(newStockQuantity - inventory.getReservedStock());
        inventory.setUpdatedAt(LocalDateTime.now());

        Inventory updatedInventory = inventoryRepository.save(inventory);

        // Send message to Product service
        sendInventoryUpdateMessage(updatedInventory);

        return updatedInventory;
    }

    /**
     * Reserve stock for a specific product variant (e.g., when a customer adds to cart).
     *
     * @param productId The ID of the product.
     * @param variantSku The SKU of the variant.
     * @param size The size of the product variant.
     * @param quantity The quantity to reserve.
     * @return The updated inventory with reserved stock.
     */
    public Inventory reserveStock(String productId, String variantSku, String size, int quantity) {
        Inventory inventory = getInventoryWithValidSize(productId, variantSku, size);
        Variant variant = inventory.getVariant();
        List<SizeStock> sizeStock = variant.getSizeStock();
        boolean found = false;
        for (SizeStock sizeStockItem : sizeStock) {
            if (sizeStockItem.getSize().equals(size)) {
                int currentStock = sizeStockItem.getStockQuantity();
                if (currentStock < quantity) {
                    throw new RuntimeException("Not enough stock to reserve.");
                }

                int availableStock = currentStock - inventory.getReservedStock();
                if (availableStock < quantity) {
                    throw new RuntimeException("Not enough available stock to reserve.");
                }

                found = true;
                break;
            }
        }
        if (!found) {
            throw new RuntimeException("Size " + size + " not found in inventory.");
        }

        inventory.setReservedStock(inventory.getReservedStock() + quantity);
        inventory.setAvailableStock(inventory.getStockQuantity() - inventory.getReservedStock());
        inventory.setUpdatedAt(LocalDateTime.now());

        Inventory updatedInventory = inventoryRepository.save(inventory);

        // Send message to Product service
        sendInventoryUpdateMessage(updatedInventory);

        return updatedInventory;
    }

    /**
     * Release reserved stock if a customer cancels an order or removes items from their cart.
     *
     * @param productId The ID of the product.
     * @param variantSku The SKU of the variant.
     * @param size The size of the product variant.
     * @param quantity The quantity to release.
     * @return The updated inventory.
     */
    public Inventory releaseReservedStock(String productId, String variantSku, String size, int quantity) {
        Inventory inventory = getInventoryWithValidSize(productId, variantSku, size);
        int newReservedStock = inventory.getReservedStock() - quantity;
        if (newReservedStock < 0) {
            throw new RuntimeException("No reserved stock to release.");
        }
        inventory.setReservedStock(newReservedStock);
        inventory.setAvailableStock(inventory.getStockQuantity() - inventory.getReservedStock());
        inventory.setUpdatedAt(LocalDateTime.now());

        Inventory updatedInventory = inventoryRepository.save(inventory);

        // Send message to Product service
        sendInventoryUpdateMessage(updatedInventory);

        return updatedInventory;
    }

    /**
     * Check if the inventory for a product is zero for all variants.
     *
     * @param productId The ID of the product.
     * @return True if inventory is zero for all variants, false otherwise.
     */
    public boolean isInventoryZeroForProduct(String productId) {
        List<Inventory> inventories = getAllInventoryByProductId(productId);
        for (Inventory inventory : inventories) {
            if (inventory.getStockQuantity() > 0) {
                return false;
            }
        }
        return true;
    }

    /**
     * Delete inventory for a specific product.
     *
     * @param productId The ID of the product.
     */
    public void deleteInventoryForProduct(String productId) {
        List<Inventory> inventories = getAllInventoryByProductId(productId);
        for (Inventory inventory : inventories) {
            inventoryRepository.delete(inventory);
        }
        // Send message to Product service to delete product
        sendInventoryDeleteMessage(productId);
    }

    private void sendInventoryUpdateMessage(Inventory inventory) {
        Map<String, Integer> sizeStockMap = new HashMap<>();
        for (SizeStock sizeStock : inventory.getVariant().getSizeStock()) {
            sizeStockMap.put(sizeStock.getSize(), sizeStock.getStockQuantity());
        }

        InventoryUpdateMessage message = new InventoryUpdateMessage();
        message.setProductId(inventory.getProductId());
        message.setVariantSku(inventory.getVariantSku());
        message.setSizeStockMap(sizeStockMap);

        inventoryRabbitTemplate.convertAndSend(RabbitConfig.EXCHANGE_NAME, RabbitConfig.INVENTORY_UPDATE_ROUTING_KEY, message);
    }

    private void sendInventoryDeleteMessage(String productId) {
        InventoryUpdateMessage message = new InventoryUpdateMessage();
        message.setProductId(productId);
        message.setVariantSku(null); // Indicating to delete all inventories for this product
        message.setSizeStockMap(null); // Not needed for deletion

        inventoryRabbitTemplate.convertAndSend(RabbitConfig.EXCHANGE_NAME, RabbitConfig.INVENTORY_UPDATE_ROUTING_KEY, message);
    }
}