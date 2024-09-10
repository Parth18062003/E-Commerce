package com.hypehouse.user_service;

import com.hypehouse.user_service.exception.UserNotFoundException;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1")
public class UserController {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;

    public UserController(UserService userService, PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<User> getUserById(@PathVariable UUID id) {
        Optional<User> user = userService.getUserById(id);
        return user.map(ResponseEntity::ok).orElseThrow(() -> new UserNotFoundException(id.toString()));
    }

    @PostMapping("/users/register")
    public User createUser(@Valid @RequestBody User user) {
        if(userService.getUserByEmailOrUsername(user.getEmail(), user.getUsername()).isPresent()) {
            throw new RuntimeException("User with email or username already exists");
        }
        if (user.getPassword() != null && !user.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
        }
        return userService.saveUser(user);
    }

    @PutMapping("/users/update-profile/{id}")
    public ResponseEntity<User> updateUser(@PathVariable UUID id, @Valid @RequestBody UserUpdateDTO userUpdateDTO) {
        Optional<User> existingUser = userService.getUserById(id);
        if (existingUser.isEmpty()) {
            throw new UserNotFoundException(id.toString());
        }

        User user = existingUser.get(); // Get the existing user
        user.setId(id);
        if(userUpdateDTO.getUsername() != null) {
            user.setUsername(userUpdateDTO.getUsername());
        }
        if (userUpdateDTO.getFirstName() != null) {
            user.setFirstName(userUpdateDTO.getFirstName());
        }
        if (userUpdateDTO.getLastName() != null) {
            user.setLastName(userUpdateDTO.getLastName());
        }
        if (userUpdateDTO.getEmail() != null) {
            user.setEmail(userUpdateDTO.getEmail());
        }
        if (userUpdateDTO.getPhoneNumber() != null) {
            user.setPhoneNumber(userUpdateDTO.getPhoneNumber());
        }
        if (userUpdateDTO.getAddress() != null) {
            user.setAddress(userUpdateDTO.getAddress());
        }
        if (userUpdateDTO.getCity() != null) {
            user.setCity(userUpdateDTO.getCity());
        }
        if (userUpdateDTO.getState() != null) {
            user.setState(userUpdateDTO.getState());
        }
        if (userUpdateDTO.getPostalCode() != null) {
            user.setPostalCode(userUpdateDTO.getPostalCode());
        }
        if (userUpdateDTO.getCountry() != null) {
            user.setCountry(userUpdateDTO.getCountry());
        }
        User updatedUser = userService.saveUser(user);
        return ResponseEntity.ok(updatedUser);
    }


    @DeleteMapping("/users/delete-profile/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable UUID id) {
        if (userService.getUserById(id).isEmpty()) {
            throw new UserNotFoundException(id.toString());
        }
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}
