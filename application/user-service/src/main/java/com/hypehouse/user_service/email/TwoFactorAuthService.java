package com.hypehouse.user_service.email;

import com.hypehouse.user_service.User;
import com.hypehouse.user_service.UserRepository;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Random;

@Service
public class TwoFactorAuthService {

    private final UserRepository userRepository;
    private final TwoFACodeRepository twoFACodeRepository;
    private final EmailService emailService;

    public TwoFactorAuthService(UserRepository userRepository, TwoFACodeRepository twoFACodeRepository, EmailService emailService) {
        this.userRepository = userRepository;
        this.twoFACodeRepository = twoFACodeRepository;
        this.emailService = emailService;
    }

    public void send2FACode(String usernameOrEmail) throws UsernameNotFoundException {
        User user = userRepository.findByUsernameOrEmail(usernameOrEmail, usernameOrEmail);
        if (user == null) {
            throw new UsernameNotFoundException("User not found");
        }

        String code = generate2FACode();
        TwoFACode twoFACode = new TwoFACode(user, code, LocalDateTime.now().plusMinutes(5));
        twoFACodeRepository.save(twoFACode);

        emailService.send2FAEmail(user.getEmail(), code);
    }

    public boolean verify2FACode(String usernameOrEmail, String code) {
        TwoFACode twoFACode = twoFACodeRepository.findByCodeAndUser(code, usernameOrEmail)
                .orElseThrow(() -> new RuntimeException("Invalid code or user"));

        if (twoFACode.isExpired()) {
            throw new RuntimeException("Code expired");
        }

        twoFACode.setVerified(true);
        twoFACodeRepository.save(twoFACode);
        return true;
    }

    private String generate2FACode() {
        Random random = new Random();
        return String.format("%06d", random.nextInt(999999)); // Generates a 6-digit code
    }
}
