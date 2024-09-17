package com.hypehouse.user_service.authentication;

import java.util.UUID;

public class JwtResponse {

    private String token;
    private UUID userId;

    public JwtResponse(String token, UUID userId) {
        this.token = token;
        this.userId = userId;
    }

    public UUID getUserId() {
        return userId;
    }

    public String getToken() {
        return token;
    }
}
