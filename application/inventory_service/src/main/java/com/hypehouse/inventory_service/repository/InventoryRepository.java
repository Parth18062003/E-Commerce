package com.hypehouse.inventory_service.repository;

import com.hypehouse.inventory_service.model.Inventory;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InventoryRepository extends MongoRepository<Inventory, String> {

    Optional<Inventory> findByProductIdAndVariantSku(String productId, String variantSku);

    List<Inventory> findByProductId(String productId);

}