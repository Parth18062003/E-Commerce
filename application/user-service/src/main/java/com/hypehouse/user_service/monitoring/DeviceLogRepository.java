package com.hypehouse.user_service.monitoring;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface DeviceLogRepository extends MongoRepository<DeviceLog, String> {
    // Pagination support for device logs
    Page<DeviceLog> findByUserId(String userId, Pageable pageable);

    Optional<DeviceLog> findFirstByUserIdAndOsAndBrowserAndDevice(String userId, String os, String browser, String device);
}
