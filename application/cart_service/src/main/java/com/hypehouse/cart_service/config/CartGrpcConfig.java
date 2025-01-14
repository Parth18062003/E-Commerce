package com.hypehouse.cart_service.config;

import com.hypehouse.common.grpc.InventoryServiceGrpc;
import io.grpc.StatusRuntimeException;
import net.devh.boot.grpc.client.inject.GrpcClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CartGrpcConfig {
    @GrpcClient("inventory_service")
    private InventoryServiceGrpc.InventoryServiceBlockingStub inventoryStub;

    @Bean
    public InventoryServiceGrpc.InventoryServiceBlockingStub inventoryServiceStub() {
        if (inventoryStub == null) {
            throw new IllegalStateException("Failed to initialize gRPC stub for InventoryService");
        }
        return inventoryStub;
    }
}