package com.hypehouse.order_service.service;

import com.hypehouse.order_service.config.RabbitConfig;
import com.hypehouse.order_service.dto.CreateOrderRequest;
import com.hypehouse.order_service.dto.OrderConfirmedEvent;
import com.hypehouse.order_service.dto.ProductDTO;
import com.hypehouse.order_service.model.Order;
import com.hypehouse.order_service.model.OrderItem;
import com.hypehouse.order_service.model.OrderStatus;
import com.hypehouse.order_service.model.PaymentStatus;
import com.hypehouse.order_service.repository.OrderRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.math.BigDecimal;
import java.time.Year;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private static final Logger log = LoggerFactory.getLogger(OrderService.class);
    private final OrderRepository orderRepository;
    private final RabbitTemplate rabbitTemplate;
    private final WebClient.Builder webClientBuilder;
    private final AtomicLong orderCounter = new AtomicLong(0);

    @Value("${product.service.url}")
    private String productServiceUrl;

    public OrderService(OrderRepository orderRepository, RabbitTemplate rabbitTemplate, WebClient.Builder webClientBuilder) {
        this.orderRepository = orderRepository;
        this.rabbitTemplate = rabbitTemplate;
        this.webClientBuilder = webClientBuilder;
    }

    @Transactional
    public Mono<Order> createOrder(CreateOrderRequest request) {
        List<UUID> productIds = request.getItems().stream()
                .map(item -> item.getProductId())
                .collect(Collectors.toList());

        // Step 1: Fetch product details to validate prices and existence
        return fetchProductDetails(productIds)
                .flatMap(productsMap -> {
                    Order order = new Order();
                    order.setUserId(request.getUserId());
                    order.setShippingAddress(request.getShippingAddress());
                    order.setStatus(OrderStatus.PENDING);
                    order.setPaymentStatus(PaymentStatus.PENDING);
                    order.setOrderNumber(generateOrderNumber());

                    BigDecimal totalPrice = BigDecimal.ZERO;

                    for (var itemRequest : request.getItems()) {
                        ProductDTO product = productsMap.get(itemRequest.getProductId());
                        if (product == null) {
                            return Mono.error(new IllegalArgumentException("Invalid product ID in order: " + itemRequest.getProductId()));
                        }

                        OrderItem orderItem = new OrderItem();
                        orderItem.setOrder(order);
                        orderItem.setProductId(product.getId());
                        orderItem.setVariantSku(itemRequest.getVariantSku());
                        orderItem.setSize(itemRequest.getSize());
                        orderItem.setQuantity(itemRequest.getQuantity());
                        orderItem.setPriceAtPurchase(product.getPrice()); // Use validated price

                        order.getItems().add(orderItem);
                        totalPrice = totalPrice.add(product.getPrice().multiply(BigDecimal.valueOf(itemRequest.getQuantity())));
                    }
                    order.setTotalPrice(totalPrice);

                    // Step 2: Persist the initial order
                    Order savedOrder = orderRepository.save(order);

                    // Step 3: Simulate payment processing
                    // In a real application, you would integrate with a payment gateway here.
                    boolean paymentSuccessful = true; // Simulating success

                    if (paymentSuccessful) {
                        savedOrder.setStatus(OrderStatus.CONFIRMED);
                        savedOrder.setPaymentStatus(PaymentStatus.PAID);
                        Order confirmedOrder = orderRepository.save(savedOrder);

                        // Step 4: Publish event for successful order
                        publishOrderConfirmedEvent(confirmedOrder);

                        return Mono.just(confirmedOrder);
                    } else {
                        savedOrder.setStatus(OrderStatus.FAILED);
                        savedOrder.setPaymentStatus(PaymentStatus.FAILED);
                        orderRepository.save(savedOrder);
                        return Mono.error(new RuntimeException("Payment failed for order: " + savedOrder.getId()));
                    }
                });
    }

    public List<Order> getOrdersByUserId(UUID userId) {
        return orderRepository.findByUserId(userId);
    }

    public Optional<Order> getOrderByOrderNumber(String orderNumber) {
        return orderRepository.findByOrderNumber(orderNumber);
    }

    private void publishOrderConfirmedEvent(Order order) {
        OrderConfirmedEvent event = new OrderConfirmedEvent();
        event.setOrderId(order.getId());
        event.setUserId(order.getUserId());
        List<OrderConfirmedEvent.OrderItemDTO> itemDTOs = order.getItems().stream()
                .map(item -> new OrderConfirmedEvent.OrderItemDTO(
                        item.getProductId(),
                        item.getVariantSku(),
                        item.getSize(),
                        item.getQuantity()
                ))
                .collect(Collectors.toList());
        event.setItems(itemDTOs);

        try {
            log.info("Publishing OrderConfirmedEvent for Order ID: {}", order.getId());
            rabbitTemplate.convertAndSend(RabbitConfig.EXCHANGE_NAME, RabbitConfig.ORDER_CONFIRMED_ROUTING_KEY, event);
        } catch (Exception e) {
            log.error("Failed to publish OrderConfirmedEvent for Order ID: {}", order.getId(), e);
            // Implement retry logic or a fallback mechanism here
        }
    }

    private Mono<Map<UUID, ProductDTO>> fetchProductDetails(List<UUID> productIds) {
        return webClientBuilder.build()
                .get()
                .uri(productServiceUrl + "/api/v1/products/ids", uriBuilder -> uriBuilder
                        .queryParam("ids", productIds.stream().map(UUID::toString).collect(Collectors.joining(",")))
                        .build())
                .retrieve()
                .bodyToFlux(ProductDTO.class)
                .collectMap(ProductDTO::getId, product -> product);
    }

    private String generateOrderNumber() {
        long count = orderRepository.count() + 1; // Simple counter, can be improved
        return String.format("ORD-%d-%06d", Year.now().getValue(), count);
    }
}