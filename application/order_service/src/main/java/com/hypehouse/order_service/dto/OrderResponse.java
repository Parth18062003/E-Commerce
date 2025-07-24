package com.hypehouse.order_service.dto;

import com.hypehouse.order_service.model.Order;
import com.hypehouse.order_service.model.OrderItem;
import com.hypehouse.order_service.model.OrderStatus;
import com.hypehouse.order_service.model.PaymentStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * A DTO representing an order, safe to expose to clients.
 */
public class OrderResponse {

    private UUID id;
    private String orderNumber;
    private UUID userId;
    private OrderStatus status;
    private PaymentStatus paymentStatus;
    private BigDecimal totalPrice;
    private String shippingAddress;
    private LocalDateTime createdAt;
    private List<OrderItemResponse> items;

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getOrderNumber() { return orderNumber; }
    public void setOrderNumber(String orderNumber) { this.orderNumber = orderNumber; }
    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }
    public OrderStatus getStatus() { return status; }
    public void setStatus(OrderStatus status) { this.status = status; }
    public PaymentStatus getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(PaymentStatus paymentStatus) { this.paymentStatus = paymentStatus; }
    public BigDecimal getTotalPrice() { return totalPrice; }
    public void setTotalPrice(BigDecimal totalPrice) { this.totalPrice = totalPrice; }
    public String getShippingAddress() { return shippingAddress; }
    public void setShippingAddress(String shippingAddress) { this.shippingAddress = shippingAddress; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public List<OrderItemResponse> getItems() { return items; }
    public void setItems(List<OrderItemResponse> items) { this.items = items; }

    /**
     * A helper method to convert a JPA Order entity to a client-friendly OrderResponse DTO.
     */
    public static OrderResponse fromEntity(Order order) {
        OrderResponse dto = new OrderResponse();
        dto.setId(order.getId());
        dto.setOrderNumber(order.getOrderNumber());
        dto.setUserId(order.getUserId());
        dto.setStatus(order.getStatus());
        dto.setPaymentStatus(order.getPaymentStatus());
        dto.setTotalPrice(order.getTotalPrice());
        dto.setShippingAddress(order.getShippingAddress());
        dto.setCreatedAt(order.getCreatedAt());
        dto.setItems(order.getItems().stream()
                .map(OrderItemResponse::fromEntity)
                .collect(Collectors.toList()));
        return dto;
    }

    // Inner DTO for order items
    public static class OrderItemResponse {
        private UUID productId;
        private String variantSku;
        private String size;
        private int quantity;
        private BigDecimal priceAtPurchase;

        // Getters and Setters
        public UUID getProductId() { return productId; }
        public void setProductId(UUID productId) { this.productId = productId; }
        public String getVariantSku() { return variantSku; }
        public void setVariantSku(String variantSku) { this.variantSku = variantSku; }
        public String getSize() { return size; }
        public void setSize(String size) { this.size = size; }
        public int getQuantity() { return quantity; }
        public void setQuantity(int quantity) { this.quantity = quantity; }
        public BigDecimal getPriceAtPurchase() { return priceAtPurchase; }
        public void setPriceAtPurchase(BigDecimal price) { this.priceAtPurchase = price; }

        public static OrderItemResponse fromEntity(OrderItem item) {
            OrderItemResponse dto = new OrderItemResponse();
            dto.setProductId(item.getProductId());
            dto.setVariantSku(item.getVariantSku());
            dto.setSize(item.getSize());
            dto.setQuantity(item.getQuantity());
            dto.setPriceAtPurchase(item.getPriceAtPurchase());
            return dto;
        }
    }
}