package com.hypehouse.user_service.authentication;

public class LoginRequest {
    private String username;
    private String password;
    private boolean is2FAEnabled;

    public LoginRequest() {
    }

    public LoginRequest(String username, String password, boolean is2FAEnabled) {
        this.username = username;
        this.password = password;
        this.is2FAEnabled = is2FAEnabled;
    }

    public String getUsername() {
        return username;
    }

    public String getPassword() {
        return password;
    }

    public boolean is2FAEnabled() {
        return is2FAEnabled;
    }
}
