package com.hypehouse.order_service.model;

public enum PaymentStatus {
    PENDING,       // Payment is pending
    PAID,          // Payment is successful
    FAILED,        // Payment failed
    REFUNDED       // Payment has been refunded
}
