package com.hypehouse.user_service;

import com.hypehouse.user_service.authentication.JwtTokenProvider;
import io.jsonwebtoken.Claims;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class JwtTokenProviderTest {

    private JwtTokenProvider jwtTokenProvider;

    @BeforeEach
    void setUp() throws NoSuchFieldException, IllegalAccessException {
        jwtTokenProvider = new JwtTokenProvider();

        // Use reflection to set private fields
        Field secretKeyField = JwtTokenProvider.class.getDeclaredField("secretKey");
        secretKeyField.setAccessible(true);
        secretKeyField.set(jwtTokenProvider, "test-secret");

        Field expirationField = JwtTokenProvider.class.getDeclaredField("expiration");
        expirationField.setAccessible(true);
        expirationField.set(jwtTokenProvider, 3600000L); // 1 hour
    }

    @Test
    void testGenerateToken() {
        List<GrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority("ROLE_USER"));

        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken("user", null, authorities);
        String token = jwtTokenProvider.generateToken(authentication);

        assertNotNull(token);
    }

    @Test
    void testGetClaims() {
        List<GrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority("ROLE_USER"));

        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken("user", null, authorities);
        String token = jwtTokenProvider.generateToken(authentication);

        Claims claims = jwtTokenProvider.getClaims(token);
        assertEquals("user", claims.getSubject());
    }

    @Test
    void testGetAuthorities() {
        List<GrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority("ROLE_USER"));

        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken("user", null, authorities);
        String token = jwtTokenProvider.generateToken(authentication);

        Collection<SimpleGrantedAuthority> roles = jwtTokenProvider.getAuthorities(token);
        assertEquals(1, roles.size());
        assertTrue(roles.contains(new SimpleGrantedAuthority("ROLE_USER")));
    }

    @Test
    void testValidateToken() {
        List<GrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority("ROLE_USER"));

        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken("user", null, authorities);
        String token = jwtTokenProvider.generateToken(authentication);

        assertTrue(jwtTokenProvider.validateToken(token));
    }

    @Test
    void testValidateToken_invalid() {
        String invalidToken = "invalid.token.here";
        assertFalse(jwtTokenProvider.validateToken(invalidToken));
    }
}
