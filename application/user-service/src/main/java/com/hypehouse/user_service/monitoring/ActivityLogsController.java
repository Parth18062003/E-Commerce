package com.hypehouse.user_service.monitoring;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/activity-logs")
public class ActivityLogsController {

    private final ActivityLogService activityLogService;

    public ActivityLogsController(ActivityLogService activityLogService) {
        this.activityLogService = activityLogService;
    }

    @GetMapping("/login-failures/count")
    public ResponseEntity<Long> getLoginFailuresCount() {
        long count = activityLogService.countByActivityType("LOGIN_FAILED");
        return ResponseEntity.ok(count);
    }

    @GetMapping("/login-successes/count")
    public ResponseEntity<Long> getLoginSuccessesCount() {
        long count = activityLogService.countByActivityType("LOGIN_SUCCESS");
        return ResponseEntity.ok(count);
    }

    @GetMapping("/unique-logins/count")
    public ResponseEntity<Long> getUniqueLoginsCount() {
        long count = activityLogService.countUniqueLogins();
        return ResponseEntity.ok(count);
    }

    @GetMapping("/user/{userId}/activities")
    public ResponseEntity<List<ActivityLog>> getUserLoginActivities(
            @PathVariable String userId,
            @RequestParam(value = "activityType", required = false) List<String> activityTypes) {
        List<ActivityLog> logs = activityLogService.getLogsByUserId(userId, activityTypes);
        return ResponseEntity.ok(logs);
    }

    @GetMapping("/daily-logins")
    public ResponseEntity<Long> getDailyLoginsCount(
            @RequestParam(value = "date") String dateString) {
        LocalDate date = LocalDate.parse(dateString);
        long count = activityLogService.countDailyLogins(date);
        return ResponseEntity.ok(count);
    }

    @GetMapping("/user/{userId}/last-activities")
    public ResponseEntity<List<ActivityLog>> getLast10UserActivities(
            @PathVariable String userId) {
        List<ActivityLog> logs = activityLogService.getLastNUserActivities(userId, 10);
        return ResponseEntity.ok(logs);
    }
}
