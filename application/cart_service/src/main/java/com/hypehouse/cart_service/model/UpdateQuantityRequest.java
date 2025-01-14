package com.hypehouse.cart_service.model;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.io.Serializable;

@Data
public class UpdateQuantityRequest implements Serializable {
    @NotNull
    @Min(1)
    private Integer quantity;

    public UpdateQuantityRequest(Integer quantity) {
        this.quantity = quantity;
    }

    public UpdateQuantityRequest() {
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }
}
