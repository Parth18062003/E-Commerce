package com.hypehouse.user_service.authentication;

import com.hypehouse.common.rate_limit.RateLimit;
import com.hypehouse.user_service.User;
import com.hypehouse.user_service.UserRepository;
import com.hypehouse.user_service.email.TwoFARequest;
import com.hypehouse.user_service.email.TwoFactorAuthService;
import com.hypehouse.user_service.monitoring.ActivityLogService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthenticationController {

    private static final Logger log = LoggerFactory.getLogger(AuthenticationController.class);
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final CustomUserDetailsService customUserDetailsService;
    private final TwoFactorAuthService twoFactorAuthService;
    private final UserRepository userRepository;
    private final ActivityLogService activityLogService;

    public AuthenticationController(AuthenticationManager authenticationManager, JwtTokenProvider jwtTokenProvider,
                                    CustomUserDetailsService customUserDetailsService, TwoFactorAuthService twoFactorAuthService,
                                    UserRepository userRepository, ActivityLogService activityLogService) {
        this.authenticationManager = authenticationManager;
        this.jwtTokenProvider = jwtTokenProvider;
        this.customUserDetailsService = customUserDetailsService;
        this.twoFactorAuthService = twoFactorAuthService;
        this.userRepository = userRepository;
        this.activityLogService = activityLogService;
    }

    @RateLimit(limitForPeriod = 5, limitRefreshPeriod = 60)
    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        log.info("Attempting to authenticate user: {}", loginRequest.getUsername());

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsername(),
                            loginRequest.getPassword()
                    )
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);

            Optional<User> user = userRepository.findByUsernameOrEmail(loginRequest.getUsername(), loginRequest.getUsername());
            if (user.isEmpty()) {
                logUserActivity(null, loginRequest.getUsername(), "LOGIN_FAILED", "User not found");
                log.error("User not found: {}", loginRequest.getUsername());
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
            }

            log.info("User found: {}", user.get());
            if (user.get().getIs2faEnabled()) {
                logUserActivity(user.get().getId().toString(), user.get().getEmail(), "2FA_CODE_SENT", "2FA code sent");
                twoFactorAuthService.send2FACode(loginRequest.getUsername());
                return ResponseEntity.ok(new LoginResponse("2FA code sent. Please verify your code.", true));
            } else {
                logUserActivity(user.get().getId().toString(), user.get().getEmail(), "LOGIN_SUCCESS", "User logged in successfully");
                String jwt = jwtTokenProvider.generateToken(authentication);
                return ResponseEntity.ok(new JwtResponse(jwt, user.get().getId()));
            }

        } catch (BadCredentialsException e) {
            log.error("Invalid credentials for user: {}", loginRequest.getUsername(), e);
            logUserActivity(null, loginRequest.getUsername(), "LOGIN_FAILED", "Invalid credentials");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        } catch (Exception e) {
            log.error("Authentication error for user: {}", loginRequest.getUsername(), e);
            logUserActivity(null, loginRequest.getUsername(), "LOGIN_ERROR", "Authentication error");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Authentication error");
        }
    }

    private void logUserActivity(String userId, String usernameOrEmail, String action, String description) {
        activityLogService.createLog(userId, usernameOrEmail, action, description);
    }

    @RateLimit(limitForPeriod = 5, limitRefreshPeriod = 60)
    @PostMapping("/verify-2fa")
    public ResponseEntity<?> verify2FA(@RequestBody TwoFARequest twoFARequest) {
        log.info("Attempting to verify 2FA for user: {}", twoFARequest.getUsernameOrEmail());

        try {
            boolean isValid = twoFactorAuthService.verify2FACode(twoFARequest.getUsernameOrEmail(), twoFARequest.getCode());
            if (isValid) {
                // Create authentication token after successful 2FA verification
                Authentication authentication = new UsernamePasswordAuthenticationToken(
                        twoFARequest.getUsernameOrEmail(),
                        null,
                        customUserDetailsService.loadUserByUsername(twoFARequest.getUsernameOrEmail()).getAuthorities()
                );
                SecurityContextHolder.getContext().setAuthentication(authentication);
                twoFactorAuthService.delete2FACode(twoFARequest.getUsernameOrEmail());

                Optional<User> userOpt = userRepository.findByUsernameOrEmail(twoFARequest.getUsernameOrEmail(), twoFARequest.getUsernameOrEmail());
                if (userOpt.isPresent()) {
                    String jwt = jwtTokenProvider.generateToken(authentication);
                    return ResponseEntity.ok(new JwtResponse(jwt, userOpt.get().getId()));
                } else {
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("User not found after 2FA verification");
                }
            } else {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Invalid or expired code");
            }
        } catch (RuntimeException e) {
            log.error("2FA verification failed for user: {}", twoFARequest.getUsernameOrEmail(), e);
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (Exception e) {
            log.error("2FA verification error for user: {}", twoFARequest.getUsernameOrEmail(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("2FA verification error");
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        // Create a cookie with the same name and set its max age to 0
        Cookie cookie = new Cookie("token", null);
        cookie.setHttpOnly(true); // Prevent JavaScript access
        cookie.setPath("/"); // Make it accessible to all routes
        cookie.setMaxAge(0); // Set max age to 0 to delete the cookie
        response.addCookie(cookie); // Add the cookie to the response

        log.info("User logged out, token cookie cleared.");

        return ResponseEntity.ok("Logged out successfully");
    }
}
