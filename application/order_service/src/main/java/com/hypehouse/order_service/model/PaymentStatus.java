package com.hypehouse.order_service.model;

/**
 * Represents the status of a payment for an order.
 */
public enum PaymentStatus {
    PENDING,    // Awaiting payment.
    PAID,       // Payment was successful.
    FAILED,     // Payment failed.
    REFUNDED    // Payment has been refunded.
}