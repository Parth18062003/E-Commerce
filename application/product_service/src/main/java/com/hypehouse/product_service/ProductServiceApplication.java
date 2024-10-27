package com.hypehouse.product_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.util.logging.Logger;

@SpringBootApplication
public class ProductServiceApplication {

	private static final Logger logger = Logger.getLogger(ProductServiceApplication.class.getName());
	public static void main(String[] args) {
		SpringApplication.run(ProductServiceApplication.class, args);
		logger.info("Product Service Application Started");
	}


}
