package com.hypehouse.common.email;

import com.resend.Resend;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ResendConfig {

    @Bean
    public Resend resend() {
        // Replace "YOUR_API_KEY" with your actual Resend API key
        return new Resend("");
    }
}
