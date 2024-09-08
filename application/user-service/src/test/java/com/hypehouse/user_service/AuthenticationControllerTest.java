package com.hypehouse.user_service;

import com.hypehouse.user_service.authentication.JwtTokenProvider;
import com.hypehouse.user_service.authentication.AuthenticationController;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.User;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@WebMvcTest(AuthenticationController.class)
public class AuthenticationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AuthenticationManager authenticationManager;

    @MockBean
    private JwtTokenProvider jwtTokenProvider;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testLogin() throws Exception {
        String username = "jodoe";
        String password = "Parth@1806";
        String token = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJqb2RvZSIsInJvbGVzIjpbIlJPTEVfQURNSU4iXSwiaWF0IjoxNzI1ODE0ODI0LCJleHAiOjE3NTczNTA4MjR9.bwL5508qwS-S3juKv0vKB-W5U03xuRHXDQ68z1nNU0Id9nP98D65mhXRltO8u4AwjgnrbafGGbTcesIRw7ytYA";

        Authentication authentication = new UsernamePasswordAuthenticationToken(username, password, User.withUsername(username).password(password).roles("ADMIN").build().getAuthorities());

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(authentication);
        when(jwtTokenProvider.generateToken(any(Authentication.class))).thenReturn(token);

        String requestBody = "usernameOrEmail=" + username + "&password=" + password;

        mockMvc.perform(MockMvcRequestBuilders.post("/api/v1/auth/login")
                        .content(requestBody)
                        .contentType(MediaType.APPLICATION_FORM_URLENCODED))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().string(token));
    }
}
