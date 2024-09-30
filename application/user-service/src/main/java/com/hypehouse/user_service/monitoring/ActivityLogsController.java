package com.hypehouse.user_service.monitoring;

import com.hypehouse.common.rate_limit.RateLimit;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/activity-logs")
public class ActivityLogsController {

    private final ActivityLogService activityLogService;

    public ActivityLogsController(ActivityLogService activityLogService) {
        this.activityLogService = activityLogService;
    }

    @RateLimit(limitForPeriod = 5, limitRefreshPeriod = 60)
    @GetMapping("/login-failures/count")
    public ResponseEntity<Long> getLoginFailuresCount() {
        long count = activityLogService.countByActivityType("LOGIN_FAILED");
        return ResponseEntity.ok(count);
    }

    @RateLimit(limitForPeriod = 5, limitRefreshPeriod = 60)
    @GetMapping("/login-successes/count")
    public ResponseEntity<Long> getLoginSuccessesCount() {
        long count = activityLogService.countByActivityType("LOGIN_SUCCESS");
        return ResponseEntity.ok(count);
    }

    @RateLimit(limitForPeriod = 5, limitRefreshPeriod = 60)
    @GetMapping("/unique-logins/count")
    public ResponseEntity<Long> getUniqueLoginsCount() {
        long count = activityLogService.countUniqueLogins();
        return ResponseEntity.ok(count);
    }

    @RateLimit(limitForPeriod = 5, limitRefreshPeriod = 60)
    @GetMapping("/user/{userId}/activities")
    public ResponseEntity<List<ActivityLog>> getUserLoginActivities(
            @PathVariable String userId,
            @RequestParam(value = "activityType", required = false) List<String> activityTypes) {
        List<ActivityLog> logs = activityLogService.getLogsByUserId(userId, activityTypes);
        return ResponseEntity.ok(logs);
    }

    @RateLimit(limitForPeriod = 5, limitRefreshPeriod = 60)
    @GetMapping("/daily-logins")
    public ResponseEntity<Long> getDailyLoginsCount(@RequestParam("date") String dateString) {
        LocalDate date = LocalDate.parse(dateString);
        long count = activityLogService.countDailyLogins(date);
        return ResponseEntity.ok(count);
    }

    @RateLimit(limitForPeriod = 5, limitRefreshPeriod = 60)
    @GetMapping("/user/{userId}/last-activities")
    public ResponseEntity<List<ActivityLog>> getLastNUserActivities(@PathVariable String userId) {
        List<ActivityLog> logs = activityLogService.getLastNUserActivities(userId, 10);
        return ResponseEntity.ok(logs);
    }

    @RateLimit(limitForPeriod = 5, limitRefreshPeriod = 60)
    @GetMapping("/registrations/count")
    public ResponseEntity<Long> countRegistrations(
            @RequestParam("startDate") String startDateString,
            @RequestParam("endDate") String endDateString) {
        LocalDate startDate = LocalDate.parse(startDateString);
        LocalDate endDate = LocalDate.parse(endDateString);
        long count = activityLogService.countRegistrations(startDate, endDate);
        return ResponseEntity.ok(count);
    }

    @RateLimit(limitForPeriod = 5, limitRefreshPeriod = 60)
    @GetMapping("/updates/count")
    public ResponseEntity<Long> countUpdates(
            @RequestParam("startDate") String startDateString,
            @RequestParam("endDate") String endDateString) {
        LocalDate startDate = LocalDate.parse(startDateString);
        LocalDate endDate = LocalDate.parse(endDateString);
        long count = activityLogService.countUpdates(startDate, endDate);
        return ResponseEntity.ok(count);
    }

    @RateLimit(limitForPeriod = 5, limitRefreshPeriod = 60)
    @GetMapping("/deletions/count")
    public ResponseEntity<Long> countDeletions(
            @RequestParam("startDate") String startDateString,
            @RequestParam("endDate") String endDateString) {
        LocalDate startDate = LocalDate.parse(startDateString);
        LocalDate endDate = LocalDate.parse(endDateString);
        long count = activityLogService.countDeletions(startDate, endDate);
        return ResponseEntity.ok(count);
    }

    @RateLimit(limitForPeriod = 5, limitRefreshPeriod = 60)
    @GetMapping("/registrations/recent/count")
    public ResponseEntity<Long> countRecentRegistrations(@RequestParam("days") int days) {
        long count = activityLogService.countRecentRegistrations(days);
        return ResponseEntity.ok(count);
    }

    @RateLimit(limitForPeriod = 5, limitRefreshPeriod = 60)
    @GetMapping("/updates/recent/count")
    public ResponseEntity<Long> countRecentUpdates(@RequestParam("days") int days) {
        long count = activityLogService.countRecentUpdates(days);
        return ResponseEntity.ok(count);
    }

    @RateLimit(limitForPeriod = 5, limitRefreshPeriod = 60)
    @GetMapping("/deletions/recent/count")
    public ResponseEntity<Long> countRecentDeletions(@RequestParam("days") int days) {
        long count = activityLogService.countRecentDeletions(days);
        return ResponseEntity.ok(count);
    }

    @RateLimit(limitForPeriod = 5, limitRefreshPeriod = 60)
    @GetMapping("/user/{userId}/activity-summary")
    public ResponseEntity<Map<String, Long>> getUserActivitySummary(@PathVariable String userId) {
        Map<String, Long> summary = activityLogService.getUserActivitySummary(userId);
        return ResponseEntity.ok(summary);
    }

    @RateLimit(limitForPeriod = 5, limitRefreshPeriod = 60)
    @GetMapping("/activity-trends/daily")
    public ResponseEntity<Map<LocalDate, Long>> getDailyActivityTrends(@RequestParam("activityType") String activityType) {
        Map<LocalDate, Long> trends = activityLogService.getDailyActivityTrends(activityType);
        return ResponseEntity.ok(trends);
    }

    @RateLimit(limitForPeriod = 5, limitRefreshPeriod = 60)
    @PostMapping("/device-info")
    public ResponseEntity<String> logDeviceInfo(@RequestBody DeviceLogRequest request) {
        if (request.getUserId() == null || request.getOs() == null || request.getBrowser() == null || request.getDevice() == null) {
            return ResponseEntity.badRequest().body("Invalid input data");
        }
        try {
            activityLogService.logDeviceInfo(request.getUserId(), request.getOs(), request.getBrowser(), request.getDevice());
            return ResponseEntity.ok("Device info logged");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to log device info");
        }
    }

    @RateLimit(limitForPeriod = 5, limitRefreshPeriod = 60)
    @PostMapping("/geolocation")
    public ResponseEntity<String> logGeolocation(@RequestBody GeolocationLogRequest request) {
        if (request.getUserId() == null || request.getLatitude() < -90 || request.getLatitude() > 90 ||
                request.getLongitude() < -180 || request.getLongitude() > 180) {
            return ResponseEntity.badRequest().body("Invalid input data");
        }
        try {
            activityLogService.logGeolocation(request.getUserId(), request.getLatitude(), request.getLongitude());
            return ResponseEntity.ok("Geolocation logged");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to log geolocation");
        }
    }

    @RateLimit(limitForPeriod = 5, limitRefreshPeriod = 60)
    @GetMapping("/user/{userId}/device-logs")
    public ResponseEntity<List<DeviceLog>> getDeviceLogs(@PathVariable String userId) {
        List<DeviceLog> deviceLogs = activityLogService.getAllDeviceLogs(userId);
        return ResponseEntity.ok(deviceLogs);
    }

    @RateLimit(limitForPeriod = 5, limitRefreshPeriod = 60)
    @GetMapping("/user/{userId}/geolocation-logs")
    public ResponseEntity<List<GeolocationLog>> getGeolocationLogs(@PathVariable String userId) {
        List<GeolocationLog> geolocationLogs = activityLogService.getAllGeolocationLogs(userId);
        return ResponseEntity.ok(geolocationLogs);
    }

    public static class DeviceLogRequest {
        private String userId;
        private String os;
        private String browser;
        private String device;

        // Getters and Setters
        public String getUserId() {
            return userId;
        }

        public void setUserId(String userId) {
            this.userId = userId;
        }

        public String getOs() {
            return os;
        }

        public void setOs(String os) {
            this.os = os;
        }

        public String getBrowser() {
            return browser;
        }

        public void setBrowser(String browser) {
            this.browser = browser;
        }

        public String getDevice() {
            return device;
        }

        public void setDevice(String device) {
            this.device = device;
        }
    }

    public static class GeolocationLogRequest {
        private String userId;
        private double latitude;
        private double longitude;

        // Getters and Setters
        public String getUserId() {
            return userId;
        }

        public void setUserId(String userId) {
            this.userId = userId;
        }

        public double getLatitude() {
            return latitude;
        }

        public void setLatitude(double latitude) {
            this.latitude = latitude;
        }

        public double getLongitude() {
            return longitude;
        }

        public void setLongitude(double longitude) {
            this.longitude = longitude;
        }
    }
}
