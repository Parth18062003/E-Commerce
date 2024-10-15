package com.hypehouse.user_service;

import com.hypehouse.common.cache.BloomFilterService;
import com.hypehouse.common.rate_limit.RateLimit;
import com.hypehouse.user_service.exception.UserNotFoundException;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.Random;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1")
public class UserController {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final BloomFilterService bloomFilterService;
    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(UserController.class);

    public UserController(UserService userService, PasswordEncoder passwordEncoder, BloomFilterService bloomFilterService) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
        this.bloomFilterService = bloomFilterService;
    }

    @RateLimit(limitForPeriod = 5, limitRefreshPeriod = 60)
    @GetMapping("/users")
    public ResponseEntity<Page<User>> getAllUsers(@PageableDefault(size = 10) Pageable pageable) {
        Page<User> users = userService.getAllUsers(pageable);
        return ResponseEntity.ok(users);
    }

    @RateLimit(limitForPeriod = 5, limitRefreshPeriod = 60)
    @GetMapping("/users/{id}")
    public ResponseEntity<User> getUserById(@PathVariable UUID id) {
        return userService.getUserById(id)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new UserNotFoundException(id.toString()));
    }

    @RateLimit(limitForPeriod = 5, limitRefreshPeriod = 60)
    @GetMapping("/users/username/{username}")
    public ResponseEntity<String> getUserIdByUsername(@PathVariable String username) {
        return userService.findByUsername(username)
                .map(User::getId)  // Assuming User has a getId() method
                .map(id -> ResponseEntity.ok("id:" + id.toString())) // Convert UUID to String
                .orElseThrow(() -> new UserNotFoundException(username));
    }

    @RateLimit(limitForPeriod = 5, limitRefreshPeriod = 60)
    @GetMapping("/users/email/{email}")
    public ResponseEntity<String> getUserIdByEmail(@PathVariable String email) {
        return userService.findByEmail(email)
                .map(User::getId)  // Assuming User has a getId() method
                .map(id -> ResponseEntity.ok("id:" + id.toString())) // Convert UUID to String
                .orElseThrow(() -> new UserNotFoundException(email));
    }

    @RateLimit(limitForPeriod = 5, limitRefreshPeriod = 60)
    @GetMapping("/users/username-or-email")
    public ResponseEntity<User> getUserByUsernameOrEmail(
            @RequestParam(required = false) String email,
            @RequestParam(required = false) String username) {

        // Check if at least one parameter is provided
        if (email == null && username == null) {
            throw new IllegalArgumentException("Either email or username must be provided");
        }

        // Call the service method to find the user
        return userService.getUserByEmailOrUsername(email, username)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new UserNotFoundException(email != null ? email : username));
    }

    private static final List<String> DEFAULT_PROFILE_IMAGES = List.of(
            "https://res.cloudinary.com/dvl7demzb/image/upload/v1728062880/4979e4e2-2e81-4e86-9fbb-4cb1b022b556.png",
            "https://res.cloudinary.com/dvl7demzb/image/upload/v1728062846/5472f0a4-1ec2-4832-b8e0-c684c8584a91.png",
            "https://res.cloudinary.com/dvl7demzb/image/upload/v1728062803/25298582-4e22-4ee1-98da-c1e7519eb84c.png",
            "https://res.cloudinary.com/dvl7demzb/image/upload/v1728062618/924bc637-8879-41cc-afc9-5cf150680bfc.png",
            "https://res.cloudinary.com/dvl7demzb/image/upload/v1728062515/16413442-3d33-46c4-ad5e-c72d170a5e50.png"
    );

    @RateLimit(limitForPeriod = 3, limitRefreshPeriod = 60)
    @PostMapping("/users/register")
    public ResponseEntity<User> createUser(@Valid @RequestBody User user) {
        userService.getUserByEmailOrUsername(user.getEmail(), user.getUsername())
                .ifPresent(existingUser -> {
                    throw new RuntimeException("User with email or username already exists");
                });

        if (user.getPassword() != null && !user.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
        }

        user.setProfileImageUrl(getRandomProfileImage());
        log.info("PasswordEncoder instance: {}", passwordEncoder);
        User createdUser = userService.saveUser(user);
        return ResponseEntity.status(201).body(createdUser); // Return 201 Created status
    }

    private String getRandomProfileImage() {
        Random random = new Random();
        return DEFAULT_PROFILE_IMAGES.get(random.nextInt(DEFAULT_PROFILE_IMAGES.size()));
    }

    @RateLimit(limitForPeriod = 5, limitRefreshPeriod = 60)
    @PutMapping("/users/update-profile/{id}")
    public ResponseEntity<User> updateUser(@PathVariable UUID id, @Valid @RequestBody UserUpdateDTO userUpdateDTO) {
        User user = userService.getUserById(id)
                .orElseThrow(() -> new UserNotFoundException(id.toString()));

        updateUserFields(user, userUpdateDTO);

        User updatedUser = userService.updateUser(user);
        return ResponseEntity.ok(updatedUser);
    }

    @RateLimit(limitForPeriod = 5, limitRefreshPeriod = 60)
    @DeleteMapping("/users/delete-profile/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable UUID id) {
        if (userService.getUserById(id).isEmpty()) {
            throw new UserNotFoundException(id.toString());
        }

        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @RateLimit(limitForPeriod = 5, limitRefreshPeriod = 60)
    @PostMapping("/users/enable-2fa/{id}")
    public ResponseEntity<User> enable2FA(@PathVariable UUID id) {
        User user = userService.enable2FA(id);
        return ResponseEntity.ok(user);
    }

    @RateLimit(limitForPeriod = 5, limitRefreshPeriod = 60)
    @PostMapping("/users/disable-2fa/{id}")
    public ResponseEntity<User> disable2FA(@PathVariable UUID id) {
        User user = userService.disable2FA(id);
        return ResponseEntity.ok(user);
    }

    @RateLimit(limitForPeriod = 5, limitRefreshPeriod = 60)
    @PostMapping("/users/update-2fa/{id}")
    public ResponseEntity<User> update2FA(@PathVariable UUID id, @RequestParam boolean enable) {
        User user = enable ? userService.enable2FA(id) : userService.disable2FA(id);
        return ResponseEntity.ok(user);
    }

    @RateLimit(limitForPeriod = 5, limitRefreshPeriod = 60) // Rate limiting annotation
    @PostMapping("/users/upload-profile-image/{id}")
    public ResponseEntity<User> uploadProfileImage(@PathVariable UUID id, @RequestBody ImageUpdateRequest request) {
        String imageUrl = request.getImageUrl();
        // Update the user's profile image URL and log the activity
        User updatedUser = userService.updateProfileImage(id, imageUrl);
        return ResponseEntity.ok(updatedUser);
    }

    @GetMapping("/users/bloom/contains/{key}")
    public ResponseEntity<Boolean> checkBloomFilter(@PathVariable String key) {
        boolean contains = bloomFilterService.mightContain(key);
        return ResponseEntity.ok(contains);
    }

    private void updateUserFields(User user, UserUpdateDTO dto) {
        if (dto.getUsername() != null) {
            user.setUsername(dto.getUsername());
        }
        if (dto.getFirstName() != null) {
            user.setFirstName(dto.getFirstName());
        }
        if (dto.getLastName() != null) {
            user.setLastName(dto.getLastName());
        }
        if (dto.getEmail() != null) {
            user.setEmail(dto.getEmail());
        }
        if (dto.getPhoneNumber() != null) {
            user.setPhoneNumber(dto.getPhoneNumber());
        }
        if (dto.getAddress() != null) {
            user.setAddress(dto.getAddress());
        }
        if (dto.getCity() != null) {
            user.setCity(dto.getCity());
        }
        if (dto.getState() != null) {
            user.setState(dto.getState());
        }
        if (dto.getPostalCode() != null) {
            user.setPostalCode(dto.getPostalCode());
        }
        if (dto.getCountry() != null) {
            user.setCountry(dto.getCountry());
        }
    }
}
