package com.hypehouse.order_service.model;

public enum OrderStatus {
    PENDING,       // Order is created but not yet processed
    PROCESSING,    // Order is being processed
    SHIPPED,       // Order has been shipped
    DELIVERED,     // Order has been delivered
    CANCELLED      // Order has been cancelled
}
