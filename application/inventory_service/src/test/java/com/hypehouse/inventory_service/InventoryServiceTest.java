package com.hypehouse.inventory_service;

import com.hypehouse.inventory_service.model.Inventory;
import com.hypehouse.inventory_service.model.Inventory.Variant;
import com.hypehouse.inventory_service.repository.InventoryRepository;
import com.hypehouse.inventory_service.service.InventoryService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentMatchers;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

class InventoryServiceTest {

    @Mock
    private InventoryRepository inventoryRepository;

    @InjectMocks
    private InventoryService inventoryService;

    private Inventory inventory;

    @BeforeEach
    void setUp() {
        // Setup mock inventory for tests
        Variant variant = new Variant();
        variant.setColor("Multi-Colour");

        Map<String, Integer> sizeStock = new HashMap<>();
        sizeStock.put("7", 10);
        sizeStock.put("8", 100);
        sizeStock.put("9", 200);
        variant.setSizeStock(sizeStock);

        inventory = new Inventory();
        inventory.setProductId("FV2305-900");
        inventory.setVariantSku("FV2305-900-100");
        inventory.setVariant(variant);
        inventory.setStockQuantity(310);
        inventory.setReservedStock(50);
        inventory.setAvailableStock(260);

        // Setting up timestamps
        ReflectionTestUtils.setField(inventory, "createdAt", "2024-12-05T13:21:55.412Z");
        ReflectionTestUtils.setField(inventory, "lastUpdated", "2024-12-05T13:21:55.412Z");
    }

    @Test
    void testGetInventoryByProductAndVariant_Success() {
        // Arrange
        when(inventoryRepository.findByProductIdAndVariantSku(anyString(), anyString()))
                .thenReturn(Optional.of(inventory));

        // Act
        Optional<Inventory> result = inventoryService.getInventoryByProductAndVariant("FV2305-900", "FV2305-900-100");

        // Assert
        assertEquals(inventory, result);
        verify(inventoryRepository, times(1)).findByProductIdAndVariantSku("FV2305-900", "FV2305-900-100");
    }

    @Test
    void testUpdateStockQuantity_Success() {
        // Arrange
        when(inventoryRepository.findByProductIdAndVariantSku(anyString(), anyString()))
                .thenReturn(Optional.of(inventory));
        when(inventoryRepository.save(any(Inventory.class)))
                .thenReturn(inventory);

        // Act
        Inventory updatedInventory = inventoryService.updateStockQuantity("FV2305-900", "FV2305-900-100", "7", 5);

        // Assert
        assertEquals(15, updatedInventory.getVariant().getSizeStock().get("7"));
        verify(inventoryRepository, times(1)).save(inventory);
    }

    @Test
    void testReduceStock_Success() {
        // Arrange
        when(inventoryRepository.findByProductIdAndVariantSku(anyString(), anyString()))
                .thenReturn(Optional.of(inventory));
        when(inventoryRepository.save(any(Inventory.class)))
                .thenReturn(inventory);

        // Act
        Inventory updatedInventory = inventoryService.reduceStock("FV2305-900", "FV2305-900-100", "7", 2);

        // Assert
        assertEquals(8, updatedInventory.getVariant().getSizeStock().get("7"));
        verify(inventoryRepository, times(1)).save(inventory);
    }

    @Test
    void testReserveStock_Success() {
        // Arrange
        when(inventoryRepository.findByProductIdAndVariantSku(anyString(), anyString()))
                .thenReturn(Optional.of(inventory));
        when(inventoryRepository.save(any(Inventory.class)))
                .thenReturn(inventory);

        // Act
        Inventory updatedInventory = inventoryService.reserveStock("FV2305-900", "FV2305-900-100", "7", 5);

        // Assert
        assertEquals(5, updatedInventory.getReservedStock());
        verify(inventoryRepository, times(1)).save(inventory);
    }

    @Test
    void testReleaseReservedStock_Success() {
        // Arrange
        inventory.setReservedStock(10);
        when(inventoryRepository.findByProductIdAndVariantSku(anyString(), anyString()))
                .thenReturn(Optional.of(inventory));
        when(inventoryRepository.save(any(Inventory.class)))
                .thenReturn(inventory);

        // Act
        Inventory updatedInventory = inventoryService.releaseReservedStock("FV2305-900", "FV2305-900-100", "7", 5);

        // Assert
        assertEquals(5, updatedInventory.getReservedStock());
        verify(inventoryRepository, times(1)).save(inventory);
    }

    @Test
    void testUpdateStockQuantity_ProductNotFound() {
        // Arrange
        when(inventoryRepository.findByProductIdAndVariantSku(anyString(), anyString()))
                .thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(RuntimeException.class, () -> inventoryService.updateStockQuantity("FV2305-900", "FV2305-900-100", "7", 5));
    }
}
