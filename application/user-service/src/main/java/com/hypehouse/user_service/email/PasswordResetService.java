package com.hypehouse.user_service.email;

import com.hypehouse.user_service.User;
import com.hypehouse.user_service.UserRepository;
import com.hypehouse.user_service.monitoring.ActivityLogService;
import jakarta.transaction.Transactional;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class PasswordResetService {

    private static final org.slf4j.Logger log = LoggerFactory.getLogger(PasswordResetService.class);
    private final UserRepository userRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final EmailService emailService;
    private final ActivityLogService activityLogService;

    @Autowired
    public PasswordResetService(UserRepository userRepository, PasswordResetTokenRepository passwordResetTokenRepository, EmailService emailService, ActivityLogService activityLogService) {
        this.userRepository = userRepository;
        this.passwordResetTokenRepository = passwordResetTokenRepository;
        this.emailService = emailService;
        this.activityLogService = activityLogService;
    }

    public void generateResetTokenAndSendEmail(String usernameOrEmail) throws UsernameNotFoundException {
        User user = userRepository.findByUsernameOrEmail(usernameOrEmail, usernameOrEmail);
        if (user == null) {
            throw new UsernameNotFoundException("User not found");
        }

        String token = UUID.randomUUID().toString();
        PasswordResetToken resetToken = new PasswordResetToken(user, token, LocalDateTime.now().plusHours(1));
        passwordResetTokenRepository.save(resetToken);

        activityLogService.createLog(
                user.getId().toString(), // UUID to String
                user.getEmail(),
                "PASSWORD_RESET_REQUEST",
                "Password reset token generated and sent to email: " + user.getEmail()
        );

        emailService.sendPasswordResetEmail(user.getEmail(), token);
    }

    @Transactional
    public void resetPassword(String token, String hashedPassword) {
        PasswordResetToken resetToken = passwordResetTokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid or expired token"));

        if (resetToken.isExpired()) {
            passwordResetTokenRepository.delete(resetToken);
            throw new RuntimeException("Token expired");
        }

        User user = resetToken.getUser();
        log.info("Resetting password for user: {}", user.getUsername());
        log.info("New password: {}", hashedPassword);
        user.setPassword(hashedPassword);
        userRepository.save(user);
        passwordResetTokenRepository.delete(resetToken);
        SecurityContextHolder.clearContext();

        activityLogService.createLog(
                user.getId().toString(), // UUID to String
                user.getEmail(),
                "PASSWORD_RESET",
                "Password reset successful for user with ID: " + user.getId()
        );

        log.info("Password reset successful for user: {}", user.getUsername());
    }
}
