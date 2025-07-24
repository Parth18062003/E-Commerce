package com.hypehouse.order_service.dto;

import java.math.BigDecimal;
import java.util.UUID;

/**
 * DTO representing product information fetched from the Product Service.
 */
public class ProductDTO {
    private UUID id;
    private String sku;
    private String name;
    private BigDecimal price;

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getSku() { return sku; }
    public void setSku(String sku) { this.sku = sku; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
}