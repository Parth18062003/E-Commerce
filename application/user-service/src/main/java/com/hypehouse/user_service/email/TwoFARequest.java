package com.hypehouse.user_service.email;

public class TwoFARequest {

    public TwoFARequest() {
    }

    public TwoFARequest(String usernameOrEmail, String code) {
        this.usernameOrEmail = usernameOrEmail;
        this.code = code;
    }

    private String usernameOrEmail;
    private String code;

    // Getters and setters

    public String getUsernameOrEmail() {
        return usernameOrEmail;
    }

    public void setUsernameOrEmail(String usernameOrEmail) {
        this.usernameOrEmail = usernameOrEmail;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }
}
