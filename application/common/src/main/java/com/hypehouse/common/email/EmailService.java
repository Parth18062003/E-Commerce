package com.hypehouse.common.email;

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
        String body = generateEmailBody(otp);

        // Send the message to RabbitMQ
        String message = createEmailMessage(toEmail, subject, body);
        emailSender.sendEmailMessage(message); // Send message to RabbitMQ queue
    }

    private String createEmailMessage(String toEmail, String subject, String body) {
        return "TO: " + toEmail + "\n" + "SUBJECT: " + subject + "\n" + "BODY: " + body;
    }

    private String generateEmailBody(String otp) {
        return "<html>" +
                "<head>" +
                "<style>" +
                "body { font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }" +
                ".container { max-width: 600px; margin: 0 auto; padding: 20px; }" +
                ".card { background: white; border-radius: 8px; padding: 20px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); }" +
                ".header { text-align: center; padding: 10px 0; }" +
                ".footer { text-align: center; font-size: 12px; color: #888; margin-top: 20px; }" +
                ".otp { font-size: 24px; font-weight: bold; color: #333; text-align: center; margin: 20px 0; }" +
                "</style>" +
                "</head>" +
                "<body>" +
                "<div class='container'>" +
                "<div class='card'>" +
                "<div class='header'>" +
                "<h2>Your 2FA Code</h2>" +
                "</div>" +
                "<p>Hello,</p>" +
                "<p>Your 2FA code is:</p>" +
                "<div class='otp'>" + otp + "</div>" +
                "<p>Please enter this code in your application to proceed.</p>" +
                "<div class='footer'>" +
                "<p>Thank you!</p>" +
                "<p>Your Company Name</p>" +
                "</div>" +
                "</div>" +
                "</div>" +
                "</body>" +
                "</html>";
    }
}