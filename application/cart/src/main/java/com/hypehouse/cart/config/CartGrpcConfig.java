package com.hypehouse.cart.config;

import com.hypehouse.common.grpc.InventoryServiceGrpc;
import net.devh.boot.grpc.client.inject.GrpcClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CartGrpcConfig {

    @GrpcClient("inventory_service")
    private InventoryServiceGrpc.InventoryServiceBlockingStub inventoryStub;

    @Bean
    public InventoryServiceGrpc.InventoryServiceBlockingStub inventoryServiceStub() {
        return inventoryStub;
    }
}