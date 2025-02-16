package com.hypehouse.order_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class OrderServiceApplication {

	private static final org.slf4j.Logger logger = org.slf4j.LoggerFactory.getLogger(OrderServiceApplication.class);
	public static void main(String[] args) {
		SpringApplication.run(OrderServiceApplication.class, args);
		logger.info("Order Service Application Started");
	}

}
