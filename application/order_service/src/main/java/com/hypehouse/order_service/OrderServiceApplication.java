package com.hypehouse.order_service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaRepositories(basePackages = "com.hypehouse.order_service.repository")
@EntityScan(basePackages = "com.hypehouse.order_service.model")
public class OrderServiceApplication {

	private static final Logger logger = LoggerFactory.getLogger(OrderServiceApplication.class);

	public static void main(String[] args) {
		SpringApplication.run(OrderServiceApplication.class, args);
		logger.info("Order Service Application Started Successfully.");
	}
}