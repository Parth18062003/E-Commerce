package com.hypehouse.product_service.exception;

public class ProductAlreadyExistsException extends RuntimeException {
    public ProductAlreadyExistsException(String sku) {
        super("Product with SKU '" + sku + "' already exists.");
    }
}
