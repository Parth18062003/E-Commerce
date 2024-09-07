package com.hypehouse.user_service.authentication;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;

import java.util.Collection;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class JwtTokenProvider {

    @Value("${jwt.secret}")
    private String secretKey;

    @Value("${jwt.expiration}")
    private long expiration;

    // Generate JWT token
    public String generateToken(Authentication authentication) {
        String username = authentication.getName();
        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        List<String> roles = authorities.stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expiration);

        // Debugging statement
        System.out.println("Generating token for user: " + username + " with roles: " + roles);

        return Jwts.builder()
                .setSubject(username)
                .claim("roles", roles) // Ensure roles are saved as a list
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(SignatureAlgorithm.HS512, secretKey)
                .compact();
    }

    // Extract Claims from JWT
    public Claims getClaims(String token) {
        Claims claims = Jwts.parser()
                .setSigningKey(secretKey)
                .parseClaimsJws(token)
                .getBody();

        // Debugging statement
        System.out.println("Extracted claims from token: " + claims);

        return claims;
    }

    // Extract Authorities from JWT
    public Collection<SimpleGrantedAuthority> getAuthorities(String token) {
        Claims claims = getClaims(token);
        Object rolesObject = claims.get("roles");

        // Debugging statement
        System.out.println("Extracted roles from token: " + rolesObject);

        if (rolesObject instanceof List<?>) {
            List<?> roles = (List<?>) rolesObject;

            if (roles.stream().allMatch(role -> role instanceof String)) {
                @SuppressWarnings("unchecked")
                List<String> roleList = (List<String>) roles;

                // Debugging statement
                System.out.println("Roles list: " + roleList);

                return roleList.stream()
                        .map(SimpleGrantedAuthority::new) // Ensure correct role format
                        .collect(Collectors.toList());
            }
        }

        throw new IllegalArgumentException("Roles are not in the expected format");
    }

    // Validate the JWT token
    public boolean validateToken(String token) {
        try {
            Jwts.parser().setSigningKey(secretKey).parseClaimsJws(token);

            // Debugging statement
            System.out.println("Token is valid: " + token);

            return true;
        } catch (Exception e) {
            // Debugging statement
            System.out.println("Token validation failed: " + token + " Exception: " + e.getMessage());
            return false;
        }
    }
}
