package com.hypehouse.user_service.authentication;

import com.hypehouse.user_service.User;
import com.hypehouse.user_service.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.Optional;
import java.util.logging.Logger;
import java.util.stream.Collectors;

/*@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    Logger logger = Logger.getLogger(CustomUserDetailsService.class.getName());
    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String usernameOrEmail) throws UsernameNotFoundException {
        Optional<User> optionalUser = Optional.ofNullable(userRepository.findByUsernameOrEmail(usernameOrEmail, usernameOrEmail));
        if (optionalUser.isEmpty()) {
            throw new UsernameNotFoundException("User with username or email " + usernameOrEmail + " not found");
        }
        User user = optionalUser.get();

        // Convert roles to GrantedAuthorities
        Collection<SimpleGrantedAuthority> authorities = user.getRoles().stream()
                .map(role -> new SimpleGrantedAuthority("ROLE_" + role.getName()))
                .collect(Collectors.toList());

        // Create UserDetails object
        logger.info("User found: " + user.getUsername());
        logger.info("Password: " + user.getPassword());
        return new org.springframework.security.core.userdetails.User(user.getUsername(), user.getPassword(), authorities);
    }
}*/
@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;
    Logger logger = Logger.getLogger(CustomUserDetailsService.class.getName());

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String usernameOrEmail) throws UsernameNotFoundException {
        Optional<User> optionalUser = Optional.ofNullable(userRepository.findByUsernameOrEmail(usernameOrEmail, usernameOrEmail));
        if (optionalUser.isEmpty()) {
            throw new UsernameNotFoundException("User with username or email " + usernameOrEmail + " not found");
        }
        User user = optionalUser.get();

        // Convert roles to GrantedAuthorities
        Collection<SimpleGrantedAuthority> authorities = user.getRoles().stream()
                .map(role -> new SimpleGrantedAuthority("ROLE_" + role.getName()))
                .collect(Collectors.toList());

        return new org.springframework.security.core.userdetails.User(user.getUsername(), user.getPassword(), authorities);
    }
}

