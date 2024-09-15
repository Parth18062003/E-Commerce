package com.hypehouse.user_service.authentication;

import com.hypehouse.user_service.User;
import com.hypehouse.user_service.UserRepository;
import com.hypehouse.user_service.email.TwoFARequest;
import com.hypehouse.user_service.email.TwoFactorAuthService;
import com.hypehouse.user_service.monitoring.ActivityLogService;
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

            User user = userRepository.findByUsernameOrEmail(loginRequest.getUsername(), loginRequest.getUsername());
            if (user == null) {
                activityLogService.createLog(
                        null, // Or a default value if you don't have the user ID yet
                        loginRequest.getUsername(),
                        "LOGIN_FAILED",
                        "User not found: " + loginRequest.getUsername()
                );
                log.error("User not found: {}", loginRequest.getUsername());
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
            }

            log.info("User found: {}", user.getUsername());
            log.info("Hashed password: {}", user.getPassword());
            if (user.getIs2faEnabled()) {
                // Send 2FA code
                activityLogService.createLog(
                        user.getId().toString(), // UUID to String
                        user.getEmail(),
                        "2FA_CODE_SENT",
                        "2FA code sent to email for user: " + user.getUsername()
                );
                twoFactorAuthService.send2FACode(loginRequest.getUsername());
                return ResponseEntity.ok("2FA code sent. Please verify your code.");
            }

            activityLogService.createLog(
                    user.getId().toString(), // UUID to String
                    user.getEmail(),
                    "LOGIN_SUCCESS",
                    "User logged in successfully: " + user.getUsername()
            );
            String jwt = jwtTokenProvider.generateToken(authentication);
            return ResponseEntity.ok(new JwtResponse(jwt));

        } catch (BadCredentialsException e) {
            log.error("Invalid credentials for user: {}", loginRequest.getUsername(), e);
            activityLogService.createLog(
                    null, // Or a default value if you don't have the user ID yet
                    loginRequest.getUsername(),
                    "LOGIN_FAILED",
                    "Invalid credentials for user: " + loginRequest.getUsername()
            );
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        } catch (Exception e) {
            log.error("Authentication error for user: {}", loginRequest.getUsername(), e);
            activityLogService.createLog(
                    null, // Or a default value if you don't have the user ID yet
                    loginRequest.getUsername(),
                    "LOGIN_ERROR",
                    "Authentication error for user: " + loginRequest.getUsername()
            );
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Authentication error");
        }
    }

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
                String jwt = jwtTokenProvider.generateToken(authentication);
                return ResponseEntity.ok(new JwtResponse(jwt));
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
}
