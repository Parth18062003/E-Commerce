package com.hypehouse.order_service.model;

/**
 * Represents the lifecycle status of an order.
 */
public enum OrderStatus {
    PENDING,       // Order created, awaiting payment confirmation.
    CONFIRMED,     // Payment successful, order is ready for fulfillment.
    SHIPPED,       // Order has been shipped to the customer.
    DELIVERED,     // Order has been successfully delivered.
    CANCELLED,     // Order was cancelled by the user or system.
    FAILED         // Order failed due to payment or processing issues.
}