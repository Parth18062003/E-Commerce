package com.hypehouse.inventory_service;

import com.hypehouse.inventory_service.controller.InventoryController;
import com.hypehouse.inventory_service.model.Inventory;
import com.hypehouse.inventory_service.service.InventoryService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Optional;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class InventoryControllerTest {

    @Mock
    private InventoryService inventoryService;

    @InjectMocks
    private InventoryController inventoryController;

    private MockMvc mockMvc;

    private Inventory inventory;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(inventoryController).build();

        // Prepare mock inventory for controller tests
        inventory = new Inventory();
        inventory.setProductId("FV2305-900");
        inventory.setVariantSku("FV2305-900-100");
        inventory.setStockQuantity(310);
        inventory.setReservedStock(50);
        inventory.setAvailableStock(260);
    }

    @Test
    void testGetInventory_Success() throws Exception {
        // Arrange
        when(inventoryService.getInventoryByProductAndVariant("FV2305-900", "FV2305-900-100"))
                .thenReturn(Optional.ofNullable(inventory));

        // Act & Assert
        mockMvc.perform(get("/api/inventory/FV2305-900/variant/FV2305-900-100"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.productId").value("FV2305-900"))
                .andExpect(jsonPath("$.variantSku").value("FV2305-900-100"))
                .andExpect(jsonPath("$.stockQuantity").value(310));
    }

    @Test
    void testGetInventory_NotFound() throws Exception {
        // Arrange
        when(inventoryService.getInventoryByProductAndVariant("FV2305-900", "FV2305-900-100"))
                .thenReturn(null);

        // Act & Assert
        mockMvc.perform(get("/api/inventory/FV2305-900/variant/FV2305-900-100"))
                .andExpect(status().isNotFound());
    }

    @Test
    void testUpdateStockQuantity_Success() throws Exception {
        // Arrange
        when(inventoryService.updateStockQuantity("FV2305-900", "FV2305-900-100", "7", 5))
                .thenReturn(inventory);

        // Act & Assert
        mockMvc.perform(put("/api/inventory/FV2305-900/variant/FV2305-900-100/size/7/stock")
                        .param("quantity", "5")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.variant.sizeStock['7']").value(15));
    }

    @Test
    void testReduceStock_Success() throws Exception {
        // Arrange
        when(inventoryService.reduceStock("FV2305-900", "FV2305-900-100", "7", 2))
                .thenReturn(inventory);

        // Act & Assert
        mockMvc.perform(put("/api/inventory/FV2305-900/variant/FV2305-900-100/size/7/reduce-stock")
                        .param("quantity", "2")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.variant.sizeStock['7']").value(8));
    }
}
