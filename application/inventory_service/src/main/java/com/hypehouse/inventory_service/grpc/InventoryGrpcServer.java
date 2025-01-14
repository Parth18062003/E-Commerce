package com.hypehouse.inventory_service.grpc;

import com.hypehouse.common.grpc.*;
import com.hypehouse.inventory_service.model.Inventory;
import com.hypehouse.inventory_service.service.InventoryService;
import io.grpc.stub.StreamObserver;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import net.devh.boot.grpc.server.service.GrpcService;

@GrpcService
@RequiredArgsConstructor
public class InventoryGrpcServer extends InventoryServiceGrpc.InventoryServiceImplBase {

    private static final Logger logger = LoggerFactory.getLogger(InventoryGrpcServer.class);

    private final InventoryService inventoryService;

    public InventoryGrpcServer(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    @Override
    public void reserveStock(ReserveStockRequest request,
                             StreamObserver<ReserveStockResponse> responseObserver) {
        logger.info("Received reserveStock request: ProductId={}, VariantSku={}, Size={}, Quantity={}",
                request.getProductId(), request.getVariantSku(), request.getSize(), request.getQuantity());

        try {
            // Simulate reserving stock
            Inventory inventory = inventoryService.reserveStock(
                    request.getProductId(),
                    request.getVariantSku(),
                    request.getSize(),
                    request.getQuantity()
            );

            logger.info("Successfully reserved stock for ProductId: {}. AvailableStock: {}, ReservedStock: {}",
                    request.getProductId(), inventory.getAvailableStock(), inventory.getReservedStock());

            responseObserver.onNext(ReserveStockResponse.newBuilder()
                    .setSuccess(true)
                    .setMessage("Stock reserved successfully")
                    .setAvailableQuantity(inventory.getAvailableStock())
                    .setReservedQuantity(inventory.getReservedStock())
                    .build());

        } catch (RuntimeException e) {
            logger.error("Error while reserving stock: {}", e.getMessage(), e);
            responseObserver.onNext(ReserveStockResponse.newBuilder()
                    .setSuccess(false)
                    .setMessage(e.getMessage())
                    .setAvailableQuantity(0)
                    .setReservedQuantity(0)
                    .build());
        }
        responseObserver.onCompleted();
    }

    @Override
    public void releaseStock(ReleaseStockRequest request,
                             StreamObserver<ReleaseStockResponse> responseObserver) {
        logger.info("Received releaseStock request: ProductId={}, VariantSku={}, Size={}, Quantity={}",
                request.getProductId(), request.getVariantSku(), request.getSize(), request.getQuantity());

        try {
            // Simulate releasing stock
            inventoryService.releaseReservedStock(
                    request.getProductId(),
                    request.getVariantSku(),
                    request.getSize(),
                    request.getQuantity()
            );

            logger.info("Successfully released stock for ProductId: {}. Quantity released: {}",
                    request.getProductId(), request.getQuantity());

            responseObserver.onNext(ReleaseStockResponse.newBuilder()
                    .setSuccess(true)
                    .setMessage("Stock released successfully")
                    .build());

        } catch (RuntimeException e) {
            logger.error("Error while releasing stock: {}", e.getMessage(), e);
            responseObserver.onNext(ReleaseStockResponse.newBuilder()
                    .setSuccess(false)
                    .setMessage(e.getMessage())
                    .build());
        }
        responseObserver.onCompleted();
    }
}
