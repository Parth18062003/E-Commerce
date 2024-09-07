package com.hypehouse.user_service;

import jakarta.validation.Valid;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(UUID id) {
        return userRepository.findById(id);
    }

    public User saveUser(@Valid User user) {
        if (user.getUsername() == null || user.getUsername().isEmpty()) {
            throw new InvalidInputException("Username cannot be null or empty");
        }
        return userRepository.save(user);
    }

    public void deleteUser(UUID id) {
        if (!userRepository.existsById(id)) {
            throw new UserNotFoundException(id.toString());
        }
        userRepository.deleteById(id);
    }
}
