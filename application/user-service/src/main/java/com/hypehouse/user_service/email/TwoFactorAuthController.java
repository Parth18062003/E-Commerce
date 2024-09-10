package com.hypehouse.user_service.email;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
public class TwoFactorAuthController {

    private final TwoFactorAuthService twoFactorAuthService;

    public TwoFactorAuthController(TwoFactorAuthService twoFactorAuthService) {
        this.twoFactorAuthService = twoFactorAuthService;
    }

    @PostMapping("/send-2fa-code")
    public ResponseEntity<String> send2FACode(@RequestParam String usernameOrEmail) {
        try {
            twoFactorAuthService.send2FACode(usernameOrEmail);
            return ResponseEntity.ok("2FA code sent");
        } catch (UsernameNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
    }

    @PostMapping("/verify-2fa")
    public ResponseEntity<String> verify2FA(@RequestBody TwoFARequest twoFARequest) {
        try {
            boolean isValid = twoFactorAuthService.verify2FACode(twoFARequest.getUsernameOrEmail(), twoFARequest.getCode());
            if (isValid) {
                return ResponseEntity.ok("2FA verified");
            } else {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Invalid or expired code");
            }
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        }
    }
}
