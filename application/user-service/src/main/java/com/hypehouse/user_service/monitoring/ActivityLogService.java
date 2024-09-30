package com.hypehouse.user_service.monitoring;

import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ActivityLogService {

    private final ActivityLogRepository activityLogRepository;
    private final GeolocationLogRepository geolocationLogRepository;
    private final DeviceLogRepository deviceLogRepository;

    public ActivityLogService(ActivityLogRepository activityLogRepository, GeolocationLogRepository geolocationLogRepository, DeviceLogRepository deviceLogRepository) {
        this.activityLogRepository = activityLogRepository;
        this.geolocationLogRepository = geolocationLogRepository;
        this.deviceLogRepository = deviceLogRepository;
    }

    public void createLog(String userId, String email, String activityType, String details) {
        ActivityLog log = new ActivityLog();
        log.setUserId(userId);
        log.setEmail(email);
        log.setActivityType(activityType);
        log.setDetails(details);
        log.setTimestamp(LocalDateTime.now());
        activityLogRepository.save(log);
    }

    public List<ActivityLog> getLogsByUserId(String userId, List<String> activityTypes) {
        if (activityTypes == null || activityTypes.isEmpty()) {
            return activityLogRepository.findAllByUserId(userId);
        } else {
            return activityLogRepository.findByUserIdAndActivityTypeIn(userId, activityTypes);
        }
    }

    public long countByActivityType(String activityType) {
        return activityLogRepository.countByActivityType(activityType);
    }

    public long countUniqueLogins() {
        List<String> uniqueUserIds = activityLogRepository.findDistinctUserIdsByActivityType("LOGIN_SUCCESS");
        return uniqueUserIds.size();
    }

    public long countDailyLogins(LocalDate date) {
        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = startOfDay.plusDays(1).minusNanos(1);
        return activityLogRepository.countByActivityTypeAndTimestampBetween("LOGIN_SUCCESS", startOfDay, endOfDay);
    }

    public List<ActivityLog> getLastNUserActivities(String userId, int n) {
        return activityLogRepository.findByUserIdOrderByTimestampDesc(userId)
                .stream()
                .limit(n)
                .collect(Collectors.toList());
    }

    // Count registrations in a given time period
    public long countRegistrations(LocalDate startDate, LocalDate endDate) {
        return activityLogRepository.countByActivityTypeAndTimestampBetween("USER_CREATION", startDate.atStartOfDay(), endDate.plusDays(1).atStartOfDay().minusNanos(1));
    }

    // Count updates in a given time period
    public long countUpdates(LocalDate startDate, LocalDate endDate) {
        return activityLogRepository.countByActivityTypeAndTimestampBetween("USER_UPDATED", startDate.atStartOfDay(), endDate.plusDays(1).atStartOfDay().minusNanos(1));
    }

    // Count deletions in a given time period
    public long countDeletions(LocalDate startDate, LocalDate endDate) {
        return activityLogRepository.countByActivityTypeAndTimestampBetween("USER_DELETION", startDate.atStartOfDay(), endDate.plusDays(1).atStartOfDay().minusNanos(1));
    }

    // Count registrations over the last N days
    public long countRecentRegistrations(int days) {
        LocalDateTime startDate = LocalDateTime.now().minusDays(days);
        return activityLogRepository.countByActivityTypeAndTimestampAfter("USER_CREATION", startDate);
    }

    // Count updates over the last N days
    public long countRecentUpdates(int days) {
        LocalDateTime startDate = LocalDateTime.now().minusDays(days);
        return activityLogRepository.countByActivityTypeAndTimestampAfter("USER_UPDATED", startDate);
    }

    // Count deletions over the last N days
    public long countRecentDeletions(int days) {
        LocalDateTime startDate = LocalDateTime.now().minusDays(days);
        return activityLogRepository.countByActivityTypeAndTimestampAfter("USER_DELETION", startDate);
    }

    public long countActivitiesByTypeBetween(String activityType, LocalDate startDate, LocalDate endDate) {
        return activityLogRepository.countByActivityTypeAndTimestampBetween(activityType, startDate.atStartOfDay(), endDate.plusDays(1).atStartOfDay().minusNanos(1));
    }

    public long countUserActivitiesBetween(String userId, LocalDate startDate, LocalDate endDate) {
        return activityLogRepository.countByUserIdAndActivityTypeAndTimestampBetween(userId, null, startDate.atStartOfDay(), endDate.plusDays(1).atStartOfDay().minusNanos(1));
    }

    public Map<String, Long> countActivitiesByTypeInLastMonths(String activityType, int months) {
        Map<String, Long> result = new HashMap<>();
        LocalDateTime endDate = LocalDateTime.now();
        for (int i = 0; i < months; i++) {
            LocalDateTime startDate = endDate.minusMonths(i + 1).withDayOfMonth(1);
            long count = activityLogRepository.countByActivityTypeAndTimestampBetween(activityType, startDate, endDate);
            result.put(startDate.getMonth().name() + " " + startDate.getYear(), count);
            endDate = startDate;
        }
        return result;
    }

    public Map<String, Long> getUserActivitySummary(String userId) {
        Map<String, Long> summary = new HashMap<>();
        summary.put("registrations", countUserActivitiesBetween(userId, LocalDate.now().minusMonths(1), LocalDate.now()));
        summary.put("logins", countActivitiesByTypeBetween("LOGIN_SUCCESS", LocalDate.now().minusMonths(1), LocalDate.now()));
        summary.put("updates", countActivitiesByTypeBetween("USER_UPDATED", LocalDate.now().minusMonths(1), LocalDate.now()));
        summary.put("deletions", countActivitiesByTypeBetween("USER_DELETION", LocalDate.now().minusMonths(1), LocalDate.now()));
        return summary;
    }

    public Map<LocalDate, Long> getDailyActivityTrends(String activityType) {
        Map<LocalDate, Long> trends = new HashMap<>();
        LocalDateTime now = LocalDateTime.now();
        for (int i = 0; i < 7; i++) {
            LocalDate date = now.minusDays(i).toLocalDate();
            long count = countActivitiesByTypeBetween(activityType, date, date);
            trends.put(date, count);
        }
        return trends;
    }

    public long countActivitiesWithCustomCriteria(String activityType, String detailsCriteria) {
        return activityLogRepository.countByActivityTypeAndDetailsContaining(activityType, detailsCriteria);
    }

    public void logDeviceInfo(String userId, String os, String browser, String device) {
        DeviceLog log = new DeviceLog();
        log.setUserId(userId);
        log.setOs(os);
        log.setBrowser(browser);
        log.setDevice(device);
        log.setTimestamp(LocalDateTime.now());
        deviceLogRepository.save(log);
    }

    public void logGeolocation(String userId, double latitude, double longitude) {
        GeolocationLog log = new GeolocationLog();
        log.setUserId(userId);
        log.setLatitude(latitude);
        log.setLongitude(longitude);
        log.setTimestamp(LocalDateTime.now());
        geolocationLogRepository.save(log);
    }

    public List<DeviceLog> getAllDeviceLogs(String userId) {
        return deviceLogRepository.findByUserId(userId);
    }

    public List<GeolocationLog> getAllGeolocationLogs(String userId) {
        return geolocationLogRepository.findByUserId(userId);
    }
}
