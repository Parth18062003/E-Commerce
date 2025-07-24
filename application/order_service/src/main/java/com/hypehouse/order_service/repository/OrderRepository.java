package com.hypehouse.order_service.repository;

import com.hypehouse.order_service.model.Order;
import com.hypehouse.order_service.model.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface OrderRepository extends JpaRepository<Order, UUID> {

    /**
     * Finds an order by its user-friendly order number.
     * @param orderNumber The unique order number.
     * @return An Optional containing the order if found.
     */
    Optional<Order> findByOrderNumber(String orderNumber);

    /**
     * Finds all orders placed by a specific user.
     * @param userId The UUID of the user.
     * @return A list of orders for that user.
     */
    List<Order> findByUserId(UUID userId);

    /**
     * Finds all orders that are currently in a specific status.
     * @param status The status to filter by.
     * @return A list of orders matching the status.
     */
    List<Order> findByStatus(OrderStatus status);
}