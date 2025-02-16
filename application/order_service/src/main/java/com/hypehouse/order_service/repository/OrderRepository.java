package com.hypehouse.order_service.repository;

import com.hypehouse.order_service.model.Order;
import com.hypehouse.order_service.model.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    // Find all orders for a specific user
    List<Order> findByUserId(String userId);

    // Find an order by ID and user ID
    Optional<Order> findByIdAndUserId(Long id, String userId);

    // Find all orders with a specific status
    List<Order> findByStatus(OrderStatus status);
}