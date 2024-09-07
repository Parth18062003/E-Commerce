package com.hypehouse.user_service;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
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

    @PostMapping("/users")
    public User createUser(@Valid @RequestBody User user) {
        return userService.saveUser(user);
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<User> updateUser(@PathVariable UUID id, @Valid @RequestBody User user) {
        Optional<User> existingUser = userService.getUserById(id);
        if (existingUser.isEmpty()) {
            throw new UserNotFoundException(id.toString());
        }

        user.setId(id); // Make sure the ID of the user being updated is set
        User updatedUser = userService.saveUser(user); // Save the updated user
        return ResponseEntity.ok(updatedUser); // Return the updated user with 200 OK status
    }


    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable UUID id) {
        if (!userService.getUserById(id).isPresent()) {
            throw new UserNotFoundException(id.toString());
        }
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}
