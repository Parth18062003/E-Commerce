package com.hypehouse.user_service.monitoring;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface DeviceLogRepository extends MongoRepository<DeviceLog, String> {
    List<DeviceLog> findByUserId(String userId);
}