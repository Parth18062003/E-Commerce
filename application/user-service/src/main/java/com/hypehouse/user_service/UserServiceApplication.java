package com.hypehouse.user_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.util.logging.Logger;

@SpringBootApplication

public class UserServiceApplication {

	private static final Logger logger = Logger.getLogger(UserServiceApplication.class.getName());
	public static void main(String[] args) {
		SpringApplication.run(UserServiceApplication.class, args);
		logger.info("User Service Application Started");
	}

}
