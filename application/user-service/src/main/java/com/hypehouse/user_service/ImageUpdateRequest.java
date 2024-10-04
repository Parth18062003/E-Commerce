package com.hypehouse.user_service;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

public class ImageUpdateRequest {
    private String imageUrl;

    // Constructor, getters, and setters
    @JsonCreator
    public ImageUpdateRequest(@JsonProperty("imageUrl") String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
}
