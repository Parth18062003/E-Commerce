package com.hypehouse.user_service.email;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
public class PasswordResetController {

    private final PasswordResetService passwordResetService;
    private final PasswordEncoder passwordEncoder;
    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(PasswordResetController.class);

    public PasswordResetController(PasswordResetService passwordResetService, PasswordEncoder passwordEncoder) {
        this.passwordResetService = passwordResetService;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/request-password-reset")
    public ResponseEntity<String> requestPasswordReset(@RequestParam String email) {
        try {
            passwordResetService.generateResetTokenAndSendEmail(email);
            return ResponseEntity.ok("Password reset email sent");
        } catch (UsernameNotFoundException ex) {
            log.error("User not found: {}", email);
            return ResponseEntity.status(404).body("User not found");
        } catch (Exception ex) {
            log.error("Error sending password reset email", ex);
            return ResponseEntity.status(500).body("Internal server error");
        }
    }

    @PostMapping("/reset-password/{token}")
    public ResponseEntity<String> resetPassword(@PathVariable String token, @RequestBody PasswordResetRequest request) {
        try {
            String newPassword = request.getNewPassword().trim();
            String hashedPassword = passwordEncoder.encode(newPassword);

            passwordResetService.resetPassword(token, hashedPassword);
            return ResponseEntity.ok("Password has been reset");
        } catch (Exception ex) {
            log.error("Error resetting password for token: {}", token, ex);
            return ResponseEntity.status(500).body("Internal server error");
        }
    }

    public static class PasswordResetRequest {
        private String newPassword;

        public String getNewPassword() {
            return newPassword;
        }

        public void setNewPassword(String newPassword) {
            this.newPassword = newPassword;
        }
    }
}
