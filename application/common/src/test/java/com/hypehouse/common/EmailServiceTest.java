package com.hypehouse.common;

import com.hypehouse.common.email.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

public class EmailServiceTest {

    @Mock
    private EmailSender emailSender; // Mocking the EmailSender dependency

    @InjectMocks
    private EmailService emailService; // The service under test

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this); // Initialize mocks
    }

    @Test
    public void testSendPasswordResetEmail() {
        String toEmail = "test@example.com";
        String token = "sample-token";

        emailService.sendPasswordResetEmail(toEmail, token);

        // Capture the message sent to the email sender
        ArgumentCaptor<String> messageCaptor = ArgumentCaptor.forClass(String.class);
        verify(emailSender, times(1)).sendEmailMessage(messageCaptor.capture());

        String sentMessage = messageCaptor.getValue();
        System.out.println("Captured Password Reset Message: " + sentMessage); // Debug output

        // Perform assertions on the sent message format
        assertTrue(sentMessage.contains("TO: " + toEmail));
        assertTrue(sentMessage.contains("SUBJECT: Password Reset Request"));
        assertTrue(sentMessage.contains("Click the link to reset your password"));
    }

    @Test
    public void testSend2FAEmail() {
        String toEmail = "test@example.com";
        String otp = "123456";

        emailService.send2FAEmail(toEmail, otp);

        // Capture the message sent to the email sender
        ArgumentCaptor<String> messageCaptor = ArgumentCaptor.forClass(String.class);
        verify(emailSender, times(1)).sendEmailMessage(messageCaptor.capture());

        String sentMessage = messageCaptor.getValue();
        System.out.println("Captured 2FA Message: " + sentMessage); // Debug output

        // Perform assertions on the sent message format
        assertTrue(sentMessage.contains("TO: " + toEmail));
        assertTrue(sentMessage.contains("SUBJECT: Your 2FA Code"));
        assertTrue(sentMessage.contains("BODY: <strong>Your 2FA code is: </strong>" + otp));
    }
}
