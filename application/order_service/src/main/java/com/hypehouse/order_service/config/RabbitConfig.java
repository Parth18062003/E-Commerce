package com.hypehouse.order_service.config;

import org.springframework.amqp.core.DirectExchange;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitConfig {

    public static final String EXCHANGE_NAME = "order-exchange";
    public static final String ORDER_CONFIRMED_QUEUE_NAME = "order-confirmed-queue";
    public static final String ORDER_CONFIRMED_ROUTING_KEY = "order.confirmed";

    @Bean
    public DirectExchange orderExchange() {
        return new DirectExchange(EXCHANGE_NAME);
    }

    @Bean
    public Queue orderConfirmedQueue() {
        // durable=true means the queue will survive a broker restart
        return new Queue(ORDER_CONFIRMED_QUEUE_NAME, true);
    }

    // We don't need a binding here in the Order service because this service is only a PRODUCER.
    // The CONSUMERS (inventory_service, cart_service) will define their own queues and bind them to this exchange.

    @Bean
    public Jackson2JsonMessageConverter messageConverter() {
        // This converter will automatically serialize our event DTOs to JSON
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory) {
        RabbitTemplate rabbitTemplate = new RabbitTemplate(connectionFactory);
        rabbitTemplate.setMessageConverter(messageConverter());
        return rabbitTemplate;
    }
}