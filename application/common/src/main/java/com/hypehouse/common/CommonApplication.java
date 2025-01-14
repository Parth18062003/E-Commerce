package com.hypehouse.common;

import org.slf4j.Logger;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication()
public class CommonApplication {

    private static final Logger logger = org.slf4j.LoggerFactory.getLogger(CommonApplication.class);

    public static void main(String[] args) {
        SpringApplication.run(CommonApplication.class, args);
        logger.info("Common Service Application Started");
    }

}
