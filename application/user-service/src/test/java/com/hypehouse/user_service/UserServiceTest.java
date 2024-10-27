package com.hypehouse.user_service;

import com.hypehouse.common.cache.BloomFilterService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.util.Collections;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {

    @InjectMocks
    private UserService userService;

    @Mock
    private UserRepository userRepository;

    @Mock
    private RoleRepository roleRepository;

    @Mock
    private ActivityLogService activityLogService;

    @Mock
    private BloomFilterService bloomFilterService;

    private User testUser;
    private UUID userId;

    @BeforeEach
    public void setUp() {
        userId = UUID.randomUUID();
        testUser = new User(userId, "test@example.com", "testuser", false, null, null);
    }

    @Test
    public void testSaveUserSuccess() {
        when(roleRepository.findByName("USER")).thenReturn(Optional.of(new Role("USER")));
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        User savedUser = userService.saveUser(testUser);

        assertNotNull(savedUser);
        assertEquals(testUser.getId(), savedUser.getId());
        verify(userRepository).save(testUser);
        verify(activityLogService).createLog(anyString(), anyString(), anyString(), anyString());
    }

    @Test
    public void testSaveUserEmailAlreadyExists() {
        when(bloomFilterService.mightContain(anyString())).thenReturn(true);
        when(userRepository.findByUsernameOrEmail(testUser.getUsername(), testUser.getEmail())).thenReturn(Optional.of(testUser));

        Exception exception = assertThrows(InvalidInputException.class, () -> userService.saveUser(testUser));
        assertEquals("Email or username already exists", exception.getMessage());
    }

    @Test
    public void testUpdateUserSuccess() {
        when(userRepository.findById(userId)).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        User updatedUser = userService.updateUser(testUser);

        assertNotNull(updatedUser);
        assertEquals(testUser.getId(), updatedUser.getId());
        verify(userRepository).save(testUser);
    }

    @Test
    public void testUpdateUserNotFound() {
        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        Exception exception = assertThrows(UserNotFoundException.class, () -> userService.updateUser(testUser));
        assertEquals(userId.toString(), exception.getMessage());
    }

    @Test
    public void testGetUserByIdSuccess() {
        when(userRepository.findById(userId)).thenReturn(Optional.of(testUser));

        Optional<User> retrievedUser = userService.getUserById(userId);

        assertTrue(retrievedUser.isPresent());
        assertEquals(testUser.getId(), retrievedUser.get().getId());
    }

    @Test
    public void testGetUserByIdNotFound() {
        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        Optional<User> retrievedUser = userService.getUserById(userId);

        assertFalse(retrievedUser.isPresent());
    }

    @Test
    public void testGetAllUsers() {
        Page<User> userPage = new PageImpl<>(Collections.singletonList(testUser));
        when(userRepository.findAll(any(Pageable.class))).thenReturn(userPage);

        Page<User> result = userService.getAllUsers(Pageable.unpaged());

        assertEquals(1, result.getTotalElements());
        assertEquals(testUser.getId(), result.getContent().get(0).getId());
    }

    @Test
    public void testDeleteUser() {
        when(userRepository.findById(userId)).thenReturn(Optional.of(testUser));

        userService.deleteUser(userId);

        verify(userRepository).deleteById(userId);
        verify(activityLogService).createLog(anyString(), anyString(), anyString(), anyString());
    }
}
