package com.hypehouse.common.email;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/email")
public class EmailController {

    private final EmailService emailService;

    @Autowired
    public EmailController(EmailService emailService) {
        this.emailService = emailService;
    }

    @PostMapping("/send2fa")
    public ResponseEntity<String> send2FAEmail(@RequestBody EmailRequest emailRequest) {
        emailService.send2FAEmail(emailRequest.getToEmail(), emailRequest.getOtp());
        return ResponseEntity.ok("2FA email sent successfully");
    }

    // Create a DTO for the request
    public static class EmailRequest {
        private String toEmail;
        private String otp;

        // Getters and setters
        public String getToEmail() {
            return toEmail;
        }

        public void setToEmail(String toEmail) {
            this.toEmail = toEmail;
        }

        public String getOtp() {
            return otp;
        }

        public void setOtp(String otp) {
            this.otp = otp;
        }
    }
}
