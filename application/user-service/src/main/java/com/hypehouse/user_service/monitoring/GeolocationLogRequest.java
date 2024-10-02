package com.hypehouse.user_service.monitoring;

import jakarta.validation.constraints.NotNull;

public class GeolocationLogRequest {
    @NotNull
    private String userId;
    @NotNull
    private double latitude;
    @NotNull
    private double longitude;

    public GeolocationLogRequest(String userId, double latitude, double longitude) {
        this.userId = userId;
        this.latitude = latitude;
        this.longitude = longitude;
    }

    public String getUserId() {
        return userId;
    }

    public double getLatitude() {
        return latitude;
    }

    public double getLongitude() {
        return longitude;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public void setLatitude(double latitude) {
        this.latitude = latitude;
    }

    public void setLongitude(double longitude) {
        this.longitude = longitude;
    }
}
