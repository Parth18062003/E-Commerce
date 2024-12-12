package com.hypehouse.product_service;

import com.hypehouse.common.model.InventoryUpdateMessage;
import com.hypehouse.common.model.ProductDTO;
import com.hypehouse.product_service.config.RabbitConfig;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.stream.Collectors;

@Component
public class ProductEventListener {

    private static final Logger log = LoggerFactory.getLogger(ProductEventListener.class);

    @Autowired
    private ProductService productService;

    @RabbitListener(queues = RabbitConfig.INVENTORY_QUEUE_NAME)
    public void receiveProductCreatedEvent(ProductDTO productDTO) {
        log.debug("Received ProductDTO: {}", productDTO);
        handleProductCreatedEvent(productDTO);
    }

    @RabbitListener(queues = RabbitConfig.INVENTORY_UPDATE_QUEUE_NAME)
    public void receiveInventoryUpdateEvent(InventoryUpdateMessage inventoryUpdateMessage) {
        log.debug("Received InventoryUpdateMessage: {}", inventoryUpdateMessage);
        handleInventoryUpdateEvent(inventoryUpdateMessage);
    }

    public void handleProductCreatedEvent(ProductDTO productDTO) {
        productDTO.getVariants().forEach(variant -> {
            Map<String, Integer> sizeStockMap = variant.getSizes().stream()
                    .collect(Collectors.toMap(ProductDTO.SizeDTO::getSize, ProductDTO.SizeDTO::getStockQuantity)); // Use SizeDTO here
            log.debug("Adding inventory for productId: {}, variantSku: {}, sizeStock: {}", productDTO.getId(), variant.getSku(), sizeStockMap);
            productService.addInventory(productDTO.getId(), variant.getSku(), variant.getColor(), sizeStockMap);
        });
    }

    public void handleInventoryUpdateEvent(InventoryUpdateMessage inventoryUpdateMessage) {
        String productId = inventoryUpdateMessage.getProductId();
        String variantSku = inventoryUpdateMessage.getVariantSku();
        Map<String, Integer> sizeStockMap = inventoryUpdateMessage.getSizeStockMap();

        if (variantSku == null && sizeStockMap == null) {
            // This indicates a request to delete all inventories for the product
            log.debug("Deleting all inventories for product ID: {}", productId);
            productService.deleteInventoryForProduct(productId);
            return;
        }

        log.debug("Updating inventory for productId: {}, variantSku: {}, sizeStock: {}", productId, variantSku, sizeStockMap);
        productService.updateInventory(productId, variantSku, sizeStockMap);
    }
}