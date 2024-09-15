package com.hypehouse.user_service.monitoring;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ActivityLogRepository extends MongoRepository<ActivityLog, String> {

    List<ActivityLog> findAllByUserId(String userId);

    List<ActivityLog> findByUserIdAndActivityTypeIn(String userId, List<String> activityTypes);

    long countByActivityType(String activityType);

    List<String> findDistinctUserIdsByActivityType(String activityType);

    long countByActivityTypeAndTimestampBetween(String activityType, LocalDateTime start, LocalDateTime end);

    List<ActivityLog> findByUserIdOrderByTimestampDesc(String userId);
}
