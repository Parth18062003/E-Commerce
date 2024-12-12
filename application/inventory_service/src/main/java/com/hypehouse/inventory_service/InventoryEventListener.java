package com.hypehouse.inventory_service;

import com.hypehouse.inventory_service.config.RabbitConfig;
import com.hypehouse.common.model.ProductDTO;
import com.hypehouse.inventory_service.service.InventoryService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
public class InventoryEventListener {

    private final InventoryService inventoryService;
    private static final Logger log = LoggerFactory.getLogger(InventoryEventListener.class);

    @Autowired
    public InventoryEventListener(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    @RabbitListener(queues = RabbitConfig.INVENTORY_QUEUE_NAME)
    public void receiveProductCreatedEvent(ProductDTO productDTO) {
        log.debug("Received ProductDTO: {}", productDTO);
        handleProductCreatedEvent(productDTO);
    }

    public void handleProductCreatedEvent(ProductDTO productDTO) {
        productDTO.getVariants().forEach(variant -> {
            Map<String, Integer> sizeStockMap = new HashMap<>();
            variant.getSizes().forEach(size -> {
                sizeStockMap.put(size.getSize(), size.getStockQuantity());
            });

            log.debug("Adding inventory for productId: {}, variantSku: {}, sizeStock: {}",
                    productDTO.getId(), variant.getSku(), sizeStockMap);
            inventoryService.addInventory(
                    productDTO.getId(),
                    variant.getSku(),
                    variant.getColor(),
                    sizeStockMap
            );
        });
    }
}