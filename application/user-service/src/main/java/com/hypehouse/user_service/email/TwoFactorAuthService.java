package com.hypehouse.user_service.email;

import com.hypehouse.common.email.EmailService;
import com.hypehouse.user_service.User;
import com.hypehouse.user_service.UserRepository;
import com.hypehouse.user_service.monitoring.ActivityLogService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Random;

@Service
public class TwoFactorAuthService {

    private final UserRepository userRepository;
    private final TwoFACodeRepository twoFACodeRepository;
    private final EmailService emailService;
    private final ActivityLogService activityLogService;

    public TwoFactorAuthService(UserRepository userRepository, TwoFACodeRepository twoFACodeRepository, EmailService emailService, ActivityLogService activityLogService) {
        this.userRepository = userRepository;
        this.twoFACodeRepository = twoFACodeRepository;
        this.emailService = emailService;
        this.activityLogService = activityLogService;
    }

    public void send2FACode(String usernameOrEmail) throws UsernameNotFoundException {
        User user = userRepository.findByUsernameOrEmail(usernameOrEmail, usernameOrEmail);
        if (user == null) {
            throw new UsernameNotFoundException("User not found");
        }

        String code = generate2FACode();
        TwoFACode twoFACode = new TwoFACode(user, code, LocalDateTime.now().plusMinutes(15));
        twoFACodeRepository.save(twoFACode);

        activityLogService.createLog(
                user.getId().toString(), // UUID to String
                user.getEmail(),
                "2FA_CODE_SENT",
                "2FA code sent to email: " + user.getEmail()
        );

        emailService.send2FAEmail(user.getEmail(), code);
    }

    public boolean verify2FACode(String usernameOrEmail, String code) {
        TwoFACode twoFACode = twoFACodeRepository.findByCodeAndUser(code, usernameOrEmail)
                .orElseThrow(() -> new RuntimeException("Invalid code or user"));

        if (twoFACode.isExpired()) {
            twoFACodeRepository.delete(twoFACode);
            throw new RuntimeException("Code expired");
        }

        activityLogService.createLog(
                twoFACode.getUser().getId().toString(), // UUID to String
                twoFACode.getUser().getEmail(),
                "2FA_CODE_VERIFIED",
                "2FA code verified for user with ID: " + twoFACode.getUser().getId()
        );

        twoFACode.setVerified(true);
        twoFACodeRepository.save(twoFACode);
        return true;
    }

    private String generate2FACode() {
        Random random = new Random();
        return String.format("%06d", random.nextInt(999999)); // Generates a 6-digit code
    }

    public void delete2FACode(String usernameOrEmail) {
        twoFACodeRepository.deleteByUserUsernameOrEmail(usernameOrEmail);
    }
}
