package com.hypehouse.user_service.monitoring;

import com.hypehouse.common.rate_limit.RateLimit;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;
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
        return ResponseEntity.ok(activityLogService.countByActivityType("LOGIN_FAILED"));
    }

    @RateLimit(limitForPeriod = 5, limitRefreshPeriod = 60)
    @GetMapping("/login-successes/count")
    public ResponseEntity<Long> getLoginSuccessesCount() {
        return ResponseEntity.ok(activityLogService.countByActivityType("LOGIN_SUCCESS"));
    }

    @RateLimit(limitForPeriod = 5, limitRefreshPeriod = 60)
    @GetMapping("/unique-logins/count")
    public ResponseEntity<Long> getUniqueLoginsCount() {
        return ResponseEntity.ok(activityLogService.countUniqueLogins());
    }

    @RateLimit(limitForPeriod = 5, limitRefreshPeriod = 60)
    @GetMapping("/user/{userId}/activities")
    public ResponseEntity<Page<ActivityLog>> getUserLoginActivities(
            @PathVariable String userId,
            @RequestParam(value = "activityType", required = false) List<String> activityTypes,
            @PageableDefault(size = 10) Pageable pageable) {
        Page<ActivityLog> logs = activityLogService.getLogsByUserId(userId, activityTypes, pageable);
        return ResponseEntity.ok(logs);
    }

    @RateLimit(limitForPeriod = 5, limitRefreshPeriod = 60)
    @GetMapping("/daily-logins")
    public ResponseEntity<Long> getDailyLoginsCount(@RequestParam("date") String dateString) {
        try {
            LocalDate date = LocalDate.parse(dateString);
            return ResponseEntity.ok(activityLogService.countDailyLogins(date));
        } catch (DateTimeParseException e) {
            // Return a specific value to indicate an error (e.g., -1)
            return ResponseEntity.ok(-1L);
        }
    }

    @RateLimit(limitForPeriod = 5, limitRefreshPeriod = 60)
    @GetMapping("/registrations/count")
    public ResponseEntity<Long> countRegistrations(
            @RequestParam("startDate") String startDateString,
            @RequestParam("endDate") String endDateString) {
        try {
            LocalDate startDate = LocalDate.parse(startDateString);
            LocalDate endDate = LocalDate.parse(endDateString);
            return ResponseEntity.ok(activityLogService.countRegistrations(startDate, endDate));
        } catch (DateTimeParseException e) {
            // Return a specific value to indicate an error (e.g., -1)
            return ResponseEntity.ok(-1L);
        }
    }

    @RateLimit(limitForPeriod = 5, limitRefreshPeriod = 60)
    @GetMapping("/updates/count")
    public ResponseEntity<Long> countUpdates(
            @RequestParam("startDate") String startDateString,
            @RequestParam("endDate") String endDateString) {
        try {
            LocalDate startDate = LocalDate.parse(startDateString);
            LocalDate endDate = LocalDate.parse(endDateString);
            return ResponseEntity.ok(activityLogService.countUpdates(startDate, endDate));
        } catch (DateTimeParseException e) {
            // Return a specific value to indicate an error (e.g., -1)
            return ResponseEntity.ok(-1L);
        }
    }

    @RateLimit(limitForPeriod = 5, limitRefreshPeriod = 60)
    @GetMapping("/deletions/count")
    public ResponseEntity<Long> countDeletions(
            @RequestParam("startDate") String startDateString,
            @RequestParam("endDate") String endDateString) {
        try {
            LocalDate startDate = LocalDate.parse(startDateString);
            LocalDate endDate = LocalDate.parse(endDateString);
            return ResponseEntity.ok(activityLogService.countDeletions(startDate, endDate));
        } catch (DateTimeParseException e) {
            // Return a specific value to indicate an error (e.g., -1)
            return ResponseEntity.ok(-1L);
        }
    }

    @RateLimit(limitForPeriod = 5, limitRefreshPeriod = 60)
    @GetMapping("/registrations/recent/count")
    public ResponseEntity<Long> countRecentRegistrations(@RequestParam("days") int days) {
        return ResponseEntity.ok(activityLogService.countRecentRegistrations(days));
    }

    @RateLimit(limitForPeriod = 5, limitRefreshPeriod = 60)
    @GetMapping("/updates/recent/count")
    public ResponseEntity<Long> countRecentUpdates(@RequestParam("days") int days) {
        return ResponseEntity.ok(activityLogService.countRecentUpdates(days));
    }

    @RateLimit(limitForPeriod = 5, limitRefreshPeriod = 60)
    @GetMapping("/deletions/recent/count")
    public ResponseEntity<Long> countRecentDeletions(@RequestParam("days") int days) {
        return ResponseEntity.ok(activityLogService.countRecentDeletions(days));
    }

    @RateLimit(limitForPeriod = 5, limitRefreshPeriod = 60)
    @GetMapping("/user/{userId}/activity-summary")
    public ResponseEntity<Map<String, Long>> getUserActivitySummary(@PathVariable String userId) {
        return ResponseEntity.ok(activityLogService.getUserActivitySummary(userId));
    }

    @RateLimit(limitForPeriod = 5, limitRefreshPeriod = 60)
    @GetMapping("/activity-trends/daily")
    public ResponseEntity<Map<LocalDate, Long>> getDailyActivityTrends(@RequestParam("activityType") String activityType) {
        return ResponseEntity.ok(activityLogService.getDailyActivityTrends(activityType));
    }

    @RateLimit(limitForPeriod = 5, limitRefreshPeriod = 60)
    @PostMapping("/device-info")
    public ResponseEntity<ApiResponse> logDeviceInfo(@Valid @RequestBody DeviceLogRequest request) {
        try {
            // Check for existing log
            if (activityLogService.deviceInfoExists(request.getUserId(), request.getOs(), request.getBrowser(), request.getDevice())) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body(new ApiResponse("Device info already logged"));
            }

            // Log new device info
            activityLogService.logDeviceInfo(request.getUserId(), request.getOs(), request.getBrowser(), request.getDevice(), request.getOsVersion(), request.getBrowserVersion(), request.getDeviceVendor(), request.getDeviceModel());
            return ResponseEntity.ok(new ApiResponse("Device info logged"));
        } catch (Exception e) {
            return handleException(e);
        }
    }

    @RateLimit(limitForPeriod = 5, limitRefreshPeriod = 60)
    @PostMapping("/geolocation")
    public ResponseEntity<ApiResponse> logGeolocation(@Valid @RequestBody GeolocationLogRequest request) {
        if (request.getLatitude() < -90 || request.getLatitude() > 90 || request.getLongitude() < -180 || request.getLongitude() > 180) {
            return ResponseEntity.badRequest().body(new ApiResponse("Invalid latitude or longitude"));
        }
        try {
            activityLogService.logGeolocation(request.getUserId(), request.getLatitude(), request.getLongitude());
            return ResponseEntity.ok(new ApiResponse("Geolocation logged"));
        } catch (Exception e) {
            return handleException(e);
        }
    }

    @RateLimit(limitForPeriod = 5, limitRefreshPeriod = 60)
    @GetMapping("/user/device-logs/{userId}")
    public ResponseEntity<Page<DeviceLog>> getDeviceLogs(
            @PathVariable String userId,
            @PageableDefault(size = 10) Pageable pageable) {
        Page<DeviceLog> deviceLogs = activityLogService.getAllDeviceLogs(userId, pageable);
        return ResponseEntity.ok(deviceLogs);
    }

    @RateLimit(limitForPeriod = 5, limitRefreshPeriod = 60)
    @GetMapping("/user/geolocation-logs/{userId}")
    public ResponseEntity<Page<GeolocationLog>> getGeolocationLogs(
            @PathVariable String userId,
            @PageableDefault(size = 10) Pageable pageable) {
        Page<GeolocationLog> geoLogs = activityLogService.getAllGeolocationLogs(userId, pageable);
        return ResponseEntity.ok(geoLogs);
    }

    private ResponseEntity<ApiResponse> handleException(Exception e) {
        // Log the exception (optional)
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ApiResponse("Failed to log info: " + e.getMessage()));
    }

    public record ApiResponse(String message) {
    }
}
