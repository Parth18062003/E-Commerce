package com.hypehouse.user_service.email;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final EmailSender emailSender;

    @Autowired
    public EmailService(EmailSender emailSender) {
        this.emailSender = emailSender;
    }

    public void sendPasswordResetEmail(String toEmail, String token) {
        String subject = "Password Reset Request";
        String body = "<strong>Click the link to reset your password: </strong><br>" +
                "<a href=\"http://localhost:8081/api/v1/auth/reset-password/" + token + "\">Reset Password</a>";

        // Instead of directly sending the email, send the message to RabbitMQ
        String message = createEmailMessage(toEmail, subject, body);
        emailSender.sendEmailMessage(message); // Send message to RabbitMQ queue
    }

    public void send2FAEmail(String toEmail, String otp) {
        String subject = "Your 2FA Code";
        String body = "<strong>Your 2FA code is: </strong>" + otp;

        // Send the message to RabbitMQ
        String message = createEmailMessage(toEmail, subject, body);
        emailSender.sendEmailMessage(message); // Send message to RabbitMQ queue
    }

    private String createEmailMessage(String toEmail, String subject, String body) {
        return "TO: " + toEmail + "\n" + "SUBJECT: " + subject + "\n" + "BODY: " + body;
    }
}
