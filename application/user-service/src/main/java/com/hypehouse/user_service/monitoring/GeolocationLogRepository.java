package com.hypehouse.user_service.monitoring;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface GeolocationLogRepository extends MongoRepository<GeolocationLog, String> {
    List<GeolocationLog> findByUserId(String userId);

    List<GeolocationLog> findByUserIdOrderByTimestampDesc(String userId);

    List<GeolocationLog> findByUserIdAndTimestampBetween(String userId, LocalDateTime start, LocalDateTime end);

    long countByUserId(String userId);

    long countByUserIdAndTimestampBetween(String userId, LocalDateTime start, LocalDateTime end);

    long countByUserIdAndLatitudeBetweenAndLongitudeBetween(String userId, double minLat, double maxLat, double minLong, double maxLong);

    long countByUserIdAndLatitudeBetweenAndLongitudeBetweenAndTimestampBetween(String userId, double minLat, double maxLat, double minLong, double maxLong, LocalDateTime start, LocalDateTime end);

    List<GeolocationLog> findByUserIdAndLatitudeBetweenAndLongitudeBetweenAndTimestampBetween(String userId, double minLat, double maxLat, double minLong, double maxLong, LocalDateTime start, LocalDateTime end);

    List<GeolocationLog> findByUserIdAndLatitudeBetweenAndLongitudeBetweenAndTimestampBetweenOrderByTimestampDesc(String userId, double minLat, double maxLat, double minLong, double maxLong, LocalDateTime start, LocalDateTime end);

    List<GeolocationLog> findByUserIdAndLatitudeBetweenAndLongitudeBetweenAndTimestampBetweenOrderByTimestampAsc(String userId, double minLat, double maxLat, double minLong, double maxLong, LocalDateTime start, LocalDateTime end);

    List<GeolocationLog> findByUserIdAndLatitudeBetweenAndLongitudeBetweenAndTimestampBetweenOrderByLatitudeAsc(String userId, double minLat, double maxLat, double minLong, double maxLong, LocalDateTime start, LocalDateTime end);

    List<GeolocationLog> findByUserIdAndLatitudeBetweenAndLongitudeBetweenAndTimestampBetweenOrderByLongitudeAsc(String userId, double minLat, double maxLat, double minLong, double maxLong, LocalDateTime start, LocalDateTime end);

    List<GeolocationLog> findByUserIdAndLatitudeBetweenAndLongitudeBetweenAndTimestampBetweenOrderByLatitudeDesc(String userId, double minLat, double maxLat, double minLong, double maxLong, LocalDateTime start, LocalDateTime end);
}
