package com.hypehouse.user_service.monitoring;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
@Document(collection = "activity_logs")
public interface ActivityLogRepository extends MongoRepository<ActivityLog, String> {

    // Pagination support for user logs
    Page<ActivityLog> findAllByUserId(String userId, Pageable pageable);

    // Pagination support for user activity types
    Page<ActivityLog> findByUserIdAndActivityTypeIn(String userId, List<String> activityTypes, Pageable pageable);

    long countByActivityType(String activityType);

    List<String> findDistinctUserIdsByActivityType(String activityType);

    long countByActivityTypeAndTimestampAfter(String activityType, LocalDateTime start);

    long countByActivityTypeAndTimestampBetween(String activityType, LocalDateTime start, LocalDateTime end);

    List<ActivityLog> findByUserIdOrderByTimestampDesc(String userId);

    long countByUserIdAndActivityTypeAndTimestampBetween(String userId, String activityType, LocalDateTime start, LocalDateTime end);

    long countByActivityTypeAndDetailsContaining(String activityType, String details);
}
