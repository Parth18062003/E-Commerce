package com.hypehouse.user_service;

import com.hypehouse.user_service.exception.UserNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class UserControllerTest {

    @InjectMocks
    private UserController userController;

    @Mock
    private UserService userService;

    @Mock
    private PasswordEncoder passwordEncoder;

    private User mockUser;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        mockUser = new User();
        mockUser.setId(UUID.randomUUID());
        mockUser.setFirstName("John");
        mockUser.setLastName("Doe");
        mockUser.setEmail("johndoe@example.com");
        mockUser.setPassword("password");
    }

    @Test
    void getAllUsers() {
        when(userService.getAllUsers()).thenReturn(List.of(mockUser));

        var users = userController.getAllUsers();
        assertEquals(1, users.size());
        assertEquals("John", users.get(0).getFirstName());

        verify(userService, times(1)).getAllUsers();
    }

    @Test
    void getUserById_UserExists() {
        UUID userId = mockUser.getId();
        when(userService.getUserById(userId)).thenReturn(Optional.of(mockUser));

        ResponseEntity<User> response = userController.getUserById(userId);
        assertEquals(200, response.getStatusCodeValue());
        assertEquals(mockUser.getFirstName(), response.getBody().getFirstName());

        verify(userService, times(1)).getUserById(userId);
    }

    @Test
    void getUserById_UserNotFound() {
        UUID userId = UUID.randomUUID();
        when(userService.getUserById(userId)).thenReturn(Optional.empty());

        assertThrows(UserNotFoundException.class, () -> userController.getUserById(userId));

        verify(userService, times(1)).getUserById(userId);
    }

    @Test
    void createUser() {
        when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");
        when(userService.saveUser(any(User.class))).thenReturn(mockUser);

        mockUser.setPassword("plainPassword");

        User createdUser = userController.createUser(mockUser);
        assertEquals(mockUser.getFirstName(), createdUser.getFirstName());
        assertEquals("encodedPassword", createdUser.getPassword());

        verify(passwordEncoder, times(1)).encode("plainPassword");
        verify(userService, times(1)).saveUser(any(User.class));
    }

    @Test
    void updateUser_UserExists() {
        UUID userId = mockUser.getId();
        UserUpdateDTO updateDTO = new UserUpdateDTO();
        updateDTO.setFirstName("Jane");

        when(userService.getUserById(userId)).thenReturn(Optional.of(mockUser));
        when(userService.saveUser(any(User.class))).thenReturn(mockUser);

        ResponseEntity<User> response = userController.updateUser(userId, updateDTO);
        assertEquals(200, response.getStatusCodeValue());
        assertEquals("Jane", response.getBody().getFirstName());

        verify(userService, times(1)).getUserById(userId);
        verify(userService, times(1)).saveUser(mockUser);
    }

    @Test
    void updateUser_UserNotFound() {
        UUID userId = UUID.randomUUID();
        UserUpdateDTO updateDTO = new UserUpdateDTO();

        when(userService.getUserById(userId)).thenReturn(Optional.empty());

        assertThrows(UserNotFoundException.class, () -> userController.updateUser(userId, updateDTO));

        verify(userService, times(1)).getUserById(userId);
    }

    @Test
    void deleteUser_UserExists() {
        UUID userId = mockUser.getId();
        when(userService.getUserById(userId)).thenReturn(Optional.of(mockUser));

        ResponseEntity<Void> response = userController.deleteUser(userId);
        assertEquals(204, response.getStatusCodeValue());

        verify(userService, times(1)).getUserById(userId);
        verify(userService, times(1)).deleteUser(userId);
    }

    @Test
    void deleteUser_UserNotFound() {
        UUID userId = UUID.randomUUID();
        when(userService.getUserById(userId)).thenReturn(Optional.empty());

        assertThrows(UserNotFoundException.class, () -> userController.deleteUser(userId));

        verify(userService, times(1)).getUserById(userId);
        verify(userService, never()).deleteUser(userId);
    }
}
