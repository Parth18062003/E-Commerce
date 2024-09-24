package com.hypehouse.user_service.email;

import com.resend.Resend;
import com.resend.core.exception.ResendException;
import com.resend.services.emails.model.CreateEmailOptions;
import com.resend.services.emails.model.CreateEmailResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RabbitMQReceiver {

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