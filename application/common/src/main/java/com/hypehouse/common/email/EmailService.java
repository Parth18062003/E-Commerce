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

        // Construct the reset link using the provided token
        String resetLink = "http://localhost:3000/authentication/reset-password?token=" + token;

        // Generate the HTML body using the generatePasswordResetEmailBody method
        String body = generatePasswordResetEmailBody(resetLink);

        // Send the message to RabbitMQ
        String message = createEmailMessage(toEmail, subject, body);
        emailSender.sendEmailMessage(message); // Send message to RabbitMQ queue
    }

    public void send2FAEmail(String toEmail, String otp) {
        String subject = "Your 2FA Code";
        String body = generate2faEmailBody(otp);

        // Send the message to RabbitMQ
        String message = createEmailMessage(toEmail, subject, body);
        emailSender.sendEmailMessage(message); // Send message to RabbitMQ queue
    }

    private String createEmailMessage(String toEmail, String subject, String body) {
        return "TO: " + toEmail + "\n" + "SUBJECT: " + subject + "\n" + "BODY: " + body;
    }

    private String generate2faEmailBody(String otp) {
        return "<html>" +
                "<head>" +
                "<meta name='viewport' content='width=device-width, initial-scale=1.0'>" +
                "<style>" +
                "body { font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; color: #333; }" +
                ".container { max-width: 600px; margin: 20px auto; padding: 20px; background: #fff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); border: 1px solid #e1e1e1;}" +
                ".header { text-align: center; border-bottom: 2px solid #4f46e5; padding-bottom: 20px; }" +
                ".otp-container { background-color: #f0f4ff; border: 2px solid #4f46e5; border-radius: 8px; text-align: center; margin: 20px 0; padding: 15px; cursor: pointer; transition: background-color 0.3s; }" +
                ".otp-container:hover { background-color: #e0eaff; }" +
                ".footer { text-align: center; font-size: 12px; color: #888; margin-top: 20px; }" +
                "h1 { font-size: 36px; color: #4f46e5; margin: 0; }" +
                "h2 { font-size: 20px; color: #333; }" +
                "p { line-height: 1.6; }" +
                "textarea { opacity: 0; position: absolute; }" +
                "@media (max-width: 600px) { " +
                ".container { padding: 15px; } " +
                "h1 { font-size: 28px; } " +
                "h2 { font-size: 18px; } " +
                ".otp-container { font-size: 18px; padding: 10px; }" +
                "}" +
                "</style>" +
                "</head>" +
                "<body>" +
                "<div class='container'>" +
                "<div class='header'>" +
                "<h1>HYPE HOUSE</h1>" +
                "<h2>Verify Your Identity</h2>" +
                "</div>" +
                "<p>Hello,</p>" +
                "<p>To ensure your account's security, please use the following 2FA code:</p>" +
                "<textarea id='otpCode'>" + otp + "</textarea>" +
                "<div class='otp-container'>" +
                "<strong style='font-size: 28px; color: #4f46e5;'>" + otp + "</strong>" +
                "</div>" +
                "<p>If you did not request this code, please ignore this email.</p>" +
                "<div class='footer'>" +
                "<p>Thank you for using Hype House!</p>" +
                "</div>" +
                "</div>" +
                "</body>" +
                "</html>";
    }


    private String generatePasswordResetEmailBody(String resetLink) {
        return "<html>" +
                "<head>" +
                "<meta name='viewport' content='width=device-width, initial-scale=1.0'>" +
                "<style>" +
                "body { font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; color: #333; }" +
                ".container { max-width: 600px; margin: 20px auto; padding: 20px; background: #fff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); border: 1px solid #e1e1e1; }" +
                ".header { text-align: center; border-bottom: 2px solid #4f46e5; padding-bottom: 20px; }" +
                ".reset-link { display: inline-block; background-color: #4f46e5; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none; transition: background-color 0.3s; }" +
                ".reset-link:hover { background-color: #3b3f8f; }" +
                ".footer { text-align: center; font-size: 12px; color: #888; margin-top: 20px; }" +
                "h1 { font-size: 36px; color: #4f46e5; margin: 0; }" +
                "h2 { font-size: 20px; color: #333; }" +
                "p { line-height: 1.6; }" +
                "@media (max-width: 600px) { " +
                ".container { padding: 15px; } " +
                "h1 { font-size: 28px; } " +
                "h2 { font-size: 18px; } " +
                ".reset-link { padding: 8px 15px; font-size: 16px; }" +
                "}" +
                "</style>" +
                "</head>" +
                "<body>" +
                "<div class='container'>" +
                "<div class='header'>" +
                "<h1>HYPE HOUSE</h1>" +
                "<h2>Password Reset Request</h2>" +
                "</div>" +
                "<p>Hello,</p>" +
                "<p>You requested a password reset for your account. Please click the button below to reset your password:</p>" +
                "<p><a href='" + resetLink + "' class='reset-link'>Reset Your Password</a></p>" +
                "<p>If you did not request this change, please ignore this email.</p>" +
                "<div class='footer'>" +
                "<p>Thank you!</p>" +
                "<p>Hype House</p>" +
                "</div>" +
                "</div>" +
                "</body>" +
                "</html>";
    }

}