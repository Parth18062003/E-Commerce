package com.hypehouse.user_service.authentication;

public class LoginResponse {
    private String message;
    private String token; // Optional, only populated if 2FA is not required
    private boolean is2FARequired;

    public LoginResponse(String message, String token, boolean is2FARequired) {
        this.message = message;
        this.token = token;
        this.is2FARequired = is2FARequired;
    }

    public LoginResponse(String message, boolean is2FARequired) {
        this(message, null, is2FARequired);
    }

    // Getters and setters
    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public boolean is2FARequired() {
        return is2FARequired;
    }

    public void setis2FARequired(boolean is2FARequired) {
        this.is2FARequired = is2FARequired;
    }
}
