package com.hypehouse.inventory_service.config;

import com.hypehouse.inventory_service.InventoryEventListener;
import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.FanoutExchange;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.rabbit.annotation.EnableRabbit;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.listener.SimpleMessageListenerContainer;
import org.springframework.amqp.rabbit.listener.adapter.MessageListenerAdapter;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@EnableRabbit
@Configuration
public class InventoryRabbitConfig {

    public static final String EXCHANGE_NAME = "product-exchange";
    public static final String QUEUE_NAME = "inventory-queue";

    @Bean
    public Queue inventoryServiceQueue() {
        return new Queue(QUEUE_NAME, true); // Make the queue durable
    }

    @Bean
    public FanoutExchange inventoryExchange() {
        return new FanoutExchange(EXCHANGE_NAME);
    }

    @Bean
    public Binding InventoryBinding(Queue inventoryQueue, FanoutExchange exchange) {
        return BindingBuilder.bind(inventoryQueue).to(exchange);
    }

    @Bean
    public Jackson2JsonMessageConverter messageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    public RabbitTemplate InventoryRabbitTemplate(ConnectionFactory connectionFactory) {
        RabbitTemplate rabbitTemplate = new RabbitTemplate(connectionFactory);
        rabbitTemplate.setMessageConverter(messageConverter());
        return rabbitTemplate;
    }

    @Bean
    public SimpleMessageListenerContainer messageListenerContainer(ConnectionFactory connectionFactory,
                                                                   InventoryEventListener inventoryEventListener,
                                                                   Jackson2JsonMessageConverter messageConverter) {
        SimpleMessageListenerContainer container = new SimpleMessageListenerContainer();
        container.setConnectionFactory(connectionFactory);
        container.setQueues(inventoryServiceQueue());

        MessageListenerAdapter listenerAdapter = new MessageListenerAdapter(inventoryEventListener, "receiveProductCreatedEvent");
        listenerAdapter.setMessageConverter(messageConverter);

        container.setMessageListener(listenerAdapter);
        return container;
    }
}