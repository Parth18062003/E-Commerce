package com.hypehouse.user_service.monitoring;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface GeolocationLogRepository extends MongoRepository<GeolocationLog, String> {
    // Pagination support for geolocation logs
    Page<GeolocationLog> findByUserId(String userId, Pageable pageable);
}
