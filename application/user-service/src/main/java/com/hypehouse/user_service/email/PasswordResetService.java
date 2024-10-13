package com.hypehouse.user_service.email;

import com.hypehouse.common.email.EmailService;
import com.hypehouse.user_service.User;
import com.hypehouse.user_service.UserRepository;
import com.hypehouse.user_service.monitoring.ActivityLogService;
import com.resend.Resend;
import com.resend.core.exception.ResendException;
import com.resend.services.emails.model.CreateEmailOptions;
import com.resend.services.emails.model.CreateEmailResponse;
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
    public PasswordResetService(UserRepository userRepository,
                                PasswordResetTokenRepository passwordResetTokenRepository,
                                EmailService emailService,
                                ActivityLogService activityLogService) {
        this.userRepository = userRepository;
        this.passwordResetTokenRepository = passwordResetTokenRepository;
        this.emailService = emailService;
        this.activityLogService = activityLogService;
    }

    public void generateResetTokenAndSendEmail(String usernameOrEmail) throws UsernameNotFoundException {
        User user = userRepository.findByUsernameOrEmail(usernameOrEmail, usernameOrEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        String token = UUID.randomUUID().toString();
        PasswordResetToken resetToken = new PasswordResetToken(user, token, LocalDateTime.now().plusHours(1));
        passwordResetTokenRepository.save(resetToken);

        activityLogService.createLog(
                user.getId().toString(),
                user.getEmail(),
                "PASSWORD_RESET_REQUEST",
                "Password reset token generated and sent to email: " + user.getEmail()
        );

        emailService.sendPasswordResetEmail(user.getEmail(), token);
    }

    public void resetPassword(String token, String hashedPassword) {
        PasswordResetToken resetToken = passwordResetTokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid or expired token"));

        if (resetToken.isExpired()) {
            passwordResetTokenRepository.delete(resetToken);
            throw new RuntimeException("Token expired");
        }

        User user = resetToken.getUser();
        log.info("Resetting password for user: {}", user.getUsername());
        user.setPassword(hashedPassword);
        userRepository.save(user);
        passwordResetTokenRepository.delete(resetToken);

        activityLogService.createLog(
                user.getId().toString(),
                user.getEmail(),
                "PASSWORD_RESET",
                "Password reset successful for user with ID: " + user.getId()
        );

        log.info("Password reset successful for user: {}", user.getUsername());
    }

    @Service
    public static class RabbitMQReceiver {

        private final Resend resendClient;

        @Autowired
        public RabbitMQReceiver(Resend resendClient) {
            this.resendClient = resendClient;
        }

        public void receiveMessage(String message) {
            // Extract email data from the message
            String[] lines = message.split("\n");
            String toEmail = lines[0].replace("TO: ", "").trim();
            String subject = lines[1].replace("SUBJECT: ", "").trim();
            String body = lines[2].replace("BODY: ", "").trim();

            sendEmail(toEmail, subject, body);
        }

        private void sendEmail(String toEmail, String subject, String body) {
            CreateEmailOptions params = CreateEmailOptions.builder()
                    .from("Acme <onboarding@resend.dev>")
                    .to(toEmail)
                    .subject(subject)
                    .html(body)
                    .build();

            try {
                CreateEmailResponse data = resendClient.emails().send(params);
                System.out.println("Email sent successfully with ID: " + data.getId());
            } catch (ResendException e) {
                System.err.println("Failed to send email: " + e.getMessage());
            }
        }
    }
}
