package com.hypehouse.user_service.monitoring;

import jakarta.validation.constraints.NotNull;

public class DeviceLogRequest {
    @NotNull
    private String userId;
    @NotNull
    private String os;
    @NotNull
    private String browser;
    @NotNull
    private String device;
    private String osVersion;
    private String browserVersion;
    private String deviceVendor;
    private String deviceModel;

    public DeviceLogRequest(String userId, String os, String browser, String device, String osVersion, String browserVersion, String deviceVendor, String deviceModel) {
        this.userId = userId;
        this.os = os;
        this.browser = browser;
        this.device = device;
        this.osVersion = osVersion;
        this.browserVersion = browserVersion;
        this.deviceVendor = deviceVendor;
        this.deviceModel = deviceModel;
    }

    public String getUserId() {
        return userId;
    }

    public String getOs() {
        return os;
    }

    public String getBrowser() {
        return browser;
    }

    public String getDevice() {
        return device;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public void setOs(String os) {
        this.os = os;
    }

    public void setBrowser(String browser) {
        this.browser = browser;
    }

    public void setDevice(String device) {
        this.device = device;
    }

    public String getOsVersion() {
        return osVersion;
    }

    public void setOsVersion(String osVersion) {
        this.osVersion = osVersion;
    }

    public String getBrowserVersion() {
        return browserVersion;
    }

    public void setBrowserVersion(String browserVersion) {
        this.browserVersion = browserVersion;
    }

    public String getDeviceVendor() {
        return deviceVendor;
    }

    public void setDeviceVendor(String deviceVendor) {
        this.deviceVendor = deviceVendor;
    }

    public String getDeviceModel() {
        return deviceModel;
    }

    public void setDeviceModel(String deviceModel) {
        this.deviceModel = deviceModel;
    }

    public String toString() {
        return "DeviceLogRequest(userId=" + this.getUserId() + ", os=" + this.getOs() + ", browser=" + this.getBrowser() + ", device=" + this.getDevice() + ", osVersion=" + this.getOsVersion() + ", browserVersion=" + this.getBrowserVersion() + ", deviceVendor=" + this.getDeviceVendor() + ", deviceModel=" + this.getDeviceModel() + ")";
    }
}
