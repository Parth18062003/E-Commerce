package com.hypehouse.user_service;

import com.hypehouse.user_service.exception.InvalidInputException;
import com.hypehouse.user_service.exception.UserNotFoundException;
import jakarta.validation.Valid;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    public UserService(UserRepository userRepository, RoleRepository roleRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(UUID id) {
        return userRepository.findById(id);
    }

    public Optional<User> getUserByEmailOrUsername(String email, String username) {
        return Optional.ofNullable(userRepository.findByUsernameOrEmail(email, username));
    }

    public User saveUser(@Valid User user) {
        if (user.getUsername() == null || user.getUsername().isEmpty()) {
            throw new InvalidInputException("Username cannot be null or empty");
        }

        Role userRole = roleRepository.findByName("USER");
        if (userRole == null) {
            throw new RuntimeException("USER role not found in the database");
        }

        user.setRoles(new HashSet<>(Collections.singleton(userRole)));

        return userRepository.save(user);
    }

    public void deleteUser(UUID id) {
        if (!userRepository.existsById(id)) {
            throw new UserNotFoundException(id.toString());
        }
        userRepository.deleteById(id);
    }

    public void enable2FA(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId.toString()));
        user.setIs2faEnabled(true);
        userRepository.save(user);
    }

    public void disable2FA(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId.toString()));
        user.setIs2faEnabled(false);
        userRepository.save(user);
    }
}
