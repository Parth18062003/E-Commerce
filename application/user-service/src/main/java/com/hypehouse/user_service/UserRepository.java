package com.hypehouse.user_service;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    // Custom query methods can be defined here
    <Optional>User findByUsername(String username);
    <Optional>User findByEmail(String email);
}

