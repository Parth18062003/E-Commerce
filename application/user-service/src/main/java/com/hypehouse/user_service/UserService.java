package com.hypehouse.user_service;

import com.hypehouse.common.cache.BloomFilterService;
import com.hypehouse.user_service.exception.InvalidInputException;
import com.hypehouse.user_service.exception.UserNotFoundException;
import com.hypehouse.user_service.monitoring.ActivityLogService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final ActivityLogService activityLogService;
    private final BloomFilterService bloomFilterService;
    private final Logger log = LoggerFactory.getLogger(UserService.class);

    public UserService(UserRepository userRepository, RoleRepository roleRepository,
                       ActivityLogService activityLogService, BloomFilterService bloomFilterService) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.activityLogService = activityLogService;
        this.bloomFilterService = bloomFilterService;
    }

    @Cacheable(value = "users", key = "#pageable.pageNumber")
    public Page<User> getAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable);
    }

    @Cacheable(value = "users", key = "#id")
    public Optional<User> getUserById(UUID id) {
        return userRepository.findById(id);
    }

    @Cacheable(value = "users", key = "#username")
    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    @Cacheable(value = "users", key = "#email")
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Cacheable(value = "users", key = "{#email, #username}")
    public Optional<User> getUserByEmailOrUsername(String email, String username) {
        return userRepository.findByUsernameOrEmail(email, username);
    }

    @CachePut(value = "users", key = "#user.id")
    public User saveUser(@Valid User user) {
        log.debug("Inserting user with details: {}", user);
        validateUsername(user.getUsername());

        // Check Bloom Filter first
        if (bloomFilterService.mightContain(user.getEmail()) ||
                bloomFilterService.mightContain(user.getUsername())) {
            if (userRepository.findByUsernameOrEmail(user.getUsername(), user.getEmail()).isPresent()) {
                throw new InvalidInputException("Email or username already exists");
            }
        }

        user.setRoles(new HashSet<>(Collections.singleton(getUserRole())));

        User savedUser = userRepository.save(user);
        addToBloomFilter(savedUser);

        activityLogService.createLog(savedUser.getId().toString(), savedUser.getEmail(),
                "USER_CREATION", "User created with email: " + savedUser.getEmail());

        return savedUser;
    }

    @CachePut(value = "users", key = "#user.id")
    public User updateUser(@Valid User user) {
        validateUsername(user.getUsername());
        User existingUser = userRepository.findById(user.getId())
                .orElseThrow(() -> new UserNotFoundException(user.getId().toString()));

        // Check if new email or username might already exist (excluding the current user)
        if (!existingUser.getEmail().equals(user.getEmail()) &&
                bloomFilterService.mightContain(user.getEmail()) &&
                userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new InvalidInputException("Email already exists");
        }

        if (!existingUser.getUsername().equals(user.getUsername()) &&
                bloomFilterService.mightContain(user.getUsername()) &&
                userRepository.findByUsername(user.getUsername()).isPresent()) {
            throw new InvalidInputException("Username already exists");
        }

        user.setRoles(new HashSet<>(Collections.singleton(getUserRole())));
        User savedUser = userRepository.save(user);

        // Update Bloom Filter if email or username changed
        if (!existingUser.getEmail().equals(savedUser.getEmail())) {
            bloomFilterService.add(savedUser.getEmail());
        }
        if (!existingUser.getUsername().equals(savedUser.getUsername())) {
            bloomFilterService.add(savedUser.getUsername());
        }

        activityLogService.createLog(savedUser.getId().toString(), savedUser.getEmail(),
                "USER_UPDATED", "User updated with email: " + savedUser.getEmail());

        return savedUser;
    }

    @CacheEvict(value = "users", allEntries = true)
    public void deleteUser(UUID id) {
        activityLogService.createLog(id.toString(),
                getUserById(id).map(User::getEmail).orElse("unknown"),
                "USER_DELETION", "User with ID: " + id + " was deleted");

        userRepository.deleteById(id);
    }

    @CachePut(value = "users", key = "#userId")
    public User enable2FA(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId.toString()));
        user.setIs2faEnabled(true);

        activityLogService.createLog(userId.toString(),
                user.getEmail(), "2FA_ENABLED", "2FA enabled for user with ID: " + userId);

        return userRepository.save(user);
    }

    @CachePut(value = "users", key = "#userId")
    public User disable2FA(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId.toString()));
        user.setIs2faEnabled(false);

        activityLogService.createLog(userId.toString(),
                user.getEmail(), "2FA_DISABLED", "2FA disabled for user with ID: " + userId);

        return userRepository.save(user);
    }

    @CachePut(value = "users", key = "#userId")
    public User updateProfileImage(UUID userId, String imageUrl) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId.toString()));
        user.setProfileImageUrl(imageUrl);

        activityLogService.createLog(userId.toString(),
                user.getEmail(), "PROFILE_IMAGE_UPDATED", "Profile image updated for user with ID: " + userId);

        return userRepository.save(user);
    }

    private Role getUserRole() {
        return roleRepository.findByName("USER")
                .orElseThrow(() -> new RuntimeException("Role not found"));
    }

    private void addToBloomFilter(User savedUser) {
        try {
            bloomFilterService.add(savedUser.getEmail());
            bloomFilterService.add(savedUser.getUsername());
        } catch (Exception e) {
            log.error("Failed to add user to Bloom Filter: {}", e.getMessage(), e);
        }
    }

    private void validateUsername(String username) {
        if (username == null || username.isEmpty()) {
            throw new InvalidInputException("Username cannot be null or empty");
        }
    }
}
