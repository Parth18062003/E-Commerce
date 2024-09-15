package com.hypehouse.user_service.monitoring;

import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ActivityLogService {

    private final ActivityLogRepository activityLogRepository;

    public ActivityLogService(ActivityLogRepository activityLogRepository) {
        this.activityLogRepository = activityLogRepository;
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
}
