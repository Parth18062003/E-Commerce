package com.hypehouse.order_service.controller;

import com.hypehouse.order_service.dto.CreateOrderRequest;
import com.hypehouse.order_service.dto.OrderResponse;
import com.hypehouse.order_service.model.Order;
import com.hypehouse.order_service.service.OrderService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/orders")
public class OrderController {

    private static final Logger log = LoggerFactory.getLogger(OrderController.class);
    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public Mono<ResponseEntity<OrderResponse>> createOrder(@Valid @RequestBody CreateOrderRequest request) {
        log.info("Received request to create order for user: {}", request.getUserId());
        return orderService.createOrder(request)
                .map(order -> ResponseEntity.status(HttpStatus.CREATED).body(OrderResponse.fromEntity(order)))
                .doOnError(error -> log.error("Failed to create order", error))
                .onErrorResume(IllegalArgumentException.class, e ->
                        Mono.just(ResponseEntity.badRequest().build())
                )
                .onErrorResume(Exception.class, e ->
                        Mono.just(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build())
                );
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<OrderResponse>> getOrdersByUser(@PathVariable UUID userId) {
        log.info("Fetching orders for user ID: {}", userId);
        List<Order> orders = orderService.getOrdersByUserId(userId);
        List<OrderResponse> response = orders.stream()
                .map(OrderResponse::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{orderNumber}")
    public ResponseEntity<OrderResponse> getOrderByOrderNumber(@PathVariable String orderNumber) {
        log.info("Fetching order by order number: {}", orderNumber);
        return orderService.getOrderByOrderNumber(orderNumber)
                .map(order -> ResponseEntity.ok(OrderResponse.fromEntity(order)))
                .orElse(ResponseEntity.notFound().build());
    }
}