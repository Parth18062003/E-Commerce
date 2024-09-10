package com.hypehouse.user_service.email;


import com.resend.Resend;
import com.resend.core.exception.ResendException;
import com.resend.services.emails.model.CreateEmailOptions;
import com.resend.services.emails.model.CreateEmailResponse;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final Resend resendClient;

    public EmailService(Resend resendClient) {
        this.resendClient = resendClient;
    }

    public void sendPasswordResetEmail(String toEmail, String token) {
        String subject = "Password Reset Request";
        String body = "<strong>Click the link to reset your password: </strong><br>" +
                "<a href=\"http://localhost:8081/api/v1/auth/reset-password/" + token + "\">Reset Password</a>";

        sendEmail(toEmail, subject, body);
    }

    public void send2FAEmail(String toEmail, String otp) {
        String subject = "Your 2FA Code";
        String body = "<strong>Your 2FA code is: </strong>" + otp;

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
