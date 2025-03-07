package com.hypehouse.product_service.config;

import com.hypehouse.product_service.ProductEventListener;
import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.DirectExchange;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.rabbit.listener.SimpleMessageListenerContainer;
import org.springframework.amqp.rabbit.listener.adapter.MessageListenerAdapter;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitConfig {

    public static final String EXCHANGE_NAME = "product-exchange";
    public static final String INVENTORY_QUEUE_NAME = "inventory-queue";
    public static final String INVENTORY_UPDATE_QUEUE_NAME = "inventory-update-queue";
    public static final String INVENTORY_CHECK_QUEUE_NAME = "inventory-check-queue";
    public static final String INVENTORY_RESPONSE_QUEUE_NAME = "inventory-response-queue";

    public static final String INVENTORY_UPDATE_ROUTING_KEY = "inventory.update";

    @Bean
    public Queue inventoryQueue() {
        return new Queue(INVENTORY_QUEUE_NAME, true);
    }

    @Bean
    public Queue inventoryUpdateQueue() {
        return new Queue(INVENTORY_UPDATE_QUEUE_NAME, true); // Make the queue durable
    }

    @Bean
    public Queue inventoryCheckQueue() {
        return new Queue(INVENTORY_CHECK_QUEUE_NAME, true); // Make the queue durable
    }

    @Bean
    public Queue inventoryResponseQueue() {
        return new Queue(INVENTORY_RESPONSE_QUEUE_NAME, true); // Make the queue durable
    }

    @Bean
    public DirectExchange exchange() {
        return new DirectExchange(EXCHANGE_NAME);
    }

    @Bean
    public Binding inventoryBinding(Queue inventoryQueue, DirectExchange exchange) {
        return BindingBuilder.bind(inventoryQueue).to(exchange).with("product.created");
    }

    @Bean
    public Binding inventoryUpdateBinding(Queue inventoryUpdateQueue, DirectExchange exchange) {
        return BindingBuilder.bind(inventoryUpdateQueue).to(exchange).with(INVENTORY_UPDATE_ROUTING_KEY);
    }

    @Bean
    public Binding inventoryCheckBinding(Queue inventoryCheckQueue, DirectExchange exchange) {
        return BindingBuilder.bind(inventoryCheckQueue).to(exchange).with("inventory.check");
    }

    @Bean
    public Binding inventoryResponseBinding(Queue inventoryResponseQueue, DirectExchange exchange) {
        return BindingBuilder.bind(inventoryResponseQueue).to(exchange).with("inventory.response");
    }

    @Bean
    public RabbitTemplate productRabbitTemplate(ConnectionFactory connectionFactory) {
        RabbitTemplate rabbitTemplate = new RabbitTemplate(connectionFactory);
        rabbitTemplate.setMessageConverter(jackson2JsonMessageConverter());
        return rabbitTemplate;
    }

    @Bean
    public SimpleMessageListenerContainer messageListenerContainer(ConnectionFactory connectionFactory,
                                                                   ProductEventListener productEventListener,
                                                                   Jackson2JsonMessageConverter messageConverter) {
        SimpleMessageListenerContainer container = new SimpleMessageListenerContainer();
        container.setConnectionFactory(connectionFactory);
        container.setQueues(inventoryResponseQueue(), inventoryUpdateQueue());
        MessageListenerAdapter listenerAdapter = new MessageListenerAdapter(productEventListener, "receiveInventoryUpdateEvent");
        listenerAdapter.setMessageConverter(messageConverter);
        container.setMessageListener(listenerAdapter);
        return container;
    }

    @Bean
    public Jackson2JsonMessageConverter jackson2JsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }
}