package com.hypehouse.order_service.dto;

import java.io.Serializable;
import java.util.List;
import java.util.UUID;

/**
 * Event payload for when an order is successfully confirmed.
 * This is published to a RabbitMQ exchange.
 */
public class OrderConfirmedEvent implements Serializable {

    private UUID orderId;
    private UUID userId;
    private List<OrderItemDTO> items;

    // Inner DTO for items within the event
    public static class OrderItemDTO implements Serializable {
        private UUID productId;
        private String variantSku;
        private String size;
        private int quantity;

        // Constructors, Getters, and Setters
        public OrderItemDTO() {}
        public OrderItemDTO(UUID productId, String variantSku, String size, int quantity) {
            this.productId = productId;
            this.variantSku = variantSku;
            this.size = size;
            this.quantity = quantity;
        }
        public UUID getProductId() { return productId; }
        public void setProductId(UUID productId) { this.productId = productId; }
        public String getVariantSku() { return variantSku; }
        public void setVariantSku(String variantSku) { this.variantSku = variantSku; }
        public String getSize() { return size; }
        public void setSize(String size) { this.size = size; }
        public int getQuantity() { return quantity; }
        public void setQuantity(int quantity) { this.quantity = quantity; }
    }

    // Getters and Setters
    public UUID getOrderId() { return orderId; }
    public void setOrderId(UUID orderId) { this.orderId = orderId; }
    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }
    public List<OrderItemDTO> getItems() { return items; }
    public void setItems(List<OrderItemDTO> items) { this.items = items; }
}