package com.hypehouse.user_service.authentication;

import com.hypehouse.common.rate_limit.RateLimit;
import com.hypehouse.user_service.Role;
import com.hypehouse.user_service.RoleRepository;
import com.hypehouse.user_service.User;
import com.hypehouse.user_service.UserService;
import com.hypehouse.user_service.exception.UserNotFoundException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.CachePut;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;
import java.security.SecureRandom;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/oauth2")
public class OAuthController {

    private static final Logger log = LoggerFactory.getLogger(OAuthController.class);
    private final UserService userService;
    private final JwtTokenProvider jwtTokenProvider;
    private final PasswordEncoder passwordEncoder;
    private final RoleRepository roleRepository;

    public OAuthController(UserService userService, JwtTokenProvider jwtTokenProvider, PasswordEncoder passwordEncoder, RoleRepository roleRepository) {
        this.userService = userService;
        this.jwtTokenProvider = jwtTokenProvider;
        this.passwordEncoder = passwordEncoder;
        this.roleRepository = roleRepository;
    }


    @GetMapping("/login/success")
    @RateLimit(limitForPeriod = 5, limitRefreshPeriod = 60)
    public ResponseEntity<?> oauth2Login(HttpServletResponse response) { // Add HttpServletResponse parameter
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            log.info("OAuth2 login successful: {}", authentication);

            OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
            Map<String, Object> attributes = oAuth2User.getAttributes();
            String email = (String) attributes.get("email");
            String firstName = (String) attributes.get("given_name");
            String lastName = (String) attributes.get("family_name");
            String profileImageUrl = (String) attributes.get("picture");

            final int maxImageUrlLength = 255;
            if (profileImageUrl != null && profileImageUrl.length() > maxImageUrlLength) {
                profileImageUrl = "https://res.cloudinary.com/dvl7demzb/image/upload/v1728062880/4979e4e2-2e81-4e86-9fbb-4cb1b022b556.png"; // Use default image URL
            }
            // Check if the user exists
            log.info("Checking for existing user with email: {}", email);
            Optional<User> existingUserOpt = userService.findByEmail(email);

            User user;
            if (existingUserOpt.isPresent()) {
                user = existingUserOpt.get();
                log.info("User found: {}", user);
            } else {
                // Only create a new user if they do not already exist
                user = createNewUser(email, firstName, lastName, profileImageUrl);
                log.info("New user created: {}", user);
            }

            // Generate token
            String token = jwtTokenProvider.generateToken(user.getEmail(), user.getRoles().stream()
                    .map(Role::getName)
                    .collect(Collectors.toList()));

            // Create cookie for the token
            Cookie cookie = new Cookie("token", token);
            cookie.setHttpOnly(true); // Prevent JavaScript access
            cookie.setPath("/"); // Make it accessible to all routes
            cookie.setMaxAge(60 * 60 * 24); // Optional: set expiration time (1 day)
            response.addCookie(cookie); // Add the cookie to the response

            // Redirect URL
            String redirectUrl = String.format("http://localhost:3000/dashboard/user/%s", user.getId());
            log.info("Redirecting to: {}", redirectUrl);

            // Redirect to the frontend dashboard
            return ResponseEntity.status(302).location(URI.create(redirectUrl)).build();
        } catch (Exception e) {
            log.error("Error during OAuth2 login: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body("Internal Server Error");
        }
    }

    private User createNewUser(String email, String firstName, String lastName, String profileImageUrl) {
        User newUser = new User();
        newUser.setEmail(email);
        newUser.setFirstName(firstName);
        newUser.setLastName(lastName);
        newUser.setPassword(passwordEncoder.encode(generateValidPassword()));
        newUser.setUsername(generateUniqueUsername(firstName, lastName));
        newUser.setProfileImageUrl(profileImageUrl != null ? profileImageUrl : "");
        Role userRole = roleRepository.findByName("USER")
                .orElseThrow(() -> new RuntimeException("USER role not found in the database"));

        newUser.setRoles(new HashSet<>(Collections.singleton(userRole)));

        log.info("Creating new user: {}", newUser);
        return userService.saveUser(newUser);
    }

    private String generateValidPassword() {
        String upperCaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        String lowerCaseLetters = "abcdefghijklmnopqrstuvwxyz";
        String specialCharacters = "!@#$%^&*()-_=+[]{}|;:',.<>?";
        String numbers = "0123456789";

        Random random = new SecureRandom();
        StringBuilder password = new StringBuilder();

        // Ensure at least one character from each required set
        password.append(upperCaseLetters.charAt(random.nextInt(upperCaseLetters.length())));
        password.append(lowerCaseLetters.charAt(random.nextInt(lowerCaseLetters.length())));
        password.append(specialCharacters.charAt(random.nextInt(specialCharacters.length())));
        password.append(numbers.charAt(random.nextInt(numbers.length())));

        // Fill the remaining characters
        String allAllowed = upperCaseLetters + lowerCaseLetters + specialCharacters + numbers;
        for (int i = 4; i < 12; i++) {
            password.append(allAllowed.charAt(random.nextInt(allAllowed.length())));
        }

        // Shuffle the characters to avoid predictable sequences
        List<Character> passwordChars = password.chars()
                .mapToObj(c -> (char) c)
                .collect(Collectors.toList());
        Collections.shuffle(passwordChars, random);

        return passwordChars.stream()
                .map(String::valueOf)
                .collect(Collectors.joining());
    }

    private String generateUniqueUsername(String firstName, String lastName) {
        String baseUsername = (firstName + lastName).toLowerCase().replaceAll("[^a-z0-9]", "");
        Random random = new Random();

        return baseUsername + random.nextInt(999) + 1;
    }

    // Inner class for the authentication response
    private static class AuthResponse {
        private final User user;
        private final String token;

        public AuthResponse(User user, String token) {
            this.user = user;
            this.token = token;
        }

        public User getUser() {
            return user;
        }

        public String getToken() {
            return token;
        }
    }
}
