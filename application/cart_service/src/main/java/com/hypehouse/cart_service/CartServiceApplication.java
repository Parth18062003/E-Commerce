package com.hypehouse.cart_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = {"com.hypehouse"})
public class CartServiceApplication {

	private static final org.slf4j.Logger logger = org.slf4j.LoggerFactory.getLogger(CartServiceApplication.class);
	public static void main(String[] args) {
		SpringApplication.run(CartServiceApplication.class, args);
		logger.info("Cart Service Application Started");
	}

}
