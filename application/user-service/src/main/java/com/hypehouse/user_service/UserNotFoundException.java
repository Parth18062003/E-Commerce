package com.hypehouse.user_service;

public class UserNotFoundException extends RuntimeException {
    public UserNotFoundException(String id) {
        super("User with id " + id + " not found");
    }
}
