package com.micromanager.userservice;

import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;

import java.util.ArrayList;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.micromanager.userservice.controller.UserController;
import com.micromanager.userservice.domain.UserDto;
import com.micromanager.userservice.service.UserService;

public class UserControllerTest {
    
    @Mock
    private UserService userService;
    private AutoCloseable autoCloseable;
    private UserController userController;

    @BeforeEach
    void initService() {
        autoCloseable = MockitoAnnotations.openMocks(this);
        userController = new UserController(userService);
    }

    @AfterEach
    void closeService() throws Exception {
        autoCloseable.close();
    }

    @Test
    public void listUsersTest() throws Exception {
        List<UserDto> users = new ArrayList<UserDto>();

        users.add(new UserDto());
        users.add(new UserDto());
        users.add(new UserDto());

        when(userService.listUsers()).thenReturn(users);
        ResponseEntity<List<UserDto>> userList = userController.listUsers();

        assertEquals(3, userList.getBody().size());
        assertEquals(HttpStatus.OK, userList.getStatusCode());
        verify(userService, times(1)).listUsers();
    }

    @Test
    public void userExistsTest() throws Exception {
        UUID existingUuid = UUID.randomUUID();
        when(userService.userExists(existingUuid)).thenReturn(true);
        ResponseEntity<Boolean> exists1 = userController.userExists(existingUuid);
        assertEquals(true, exists1.getBody());

        UUID nonExistingUuid = UUID.randomUUID();
        when(userService.userExists(nonExistingUuid)).thenReturn(false);
        ResponseEntity<Boolean> exists2 = userController.userExists(nonExistingUuid);
        assertEquals(false, exists2.getBody());
    }

    @Test
    public void selectUserTest() throws Exception {
        UUID uuid = UUID.randomUUID();
        when(userService.selectUser(uuid)).thenReturn(new UserDto());
        ResponseEntity<UserDto> response = userController.selectUser(uuid);
        verify(userService, times(1)).selectUser(uuid);
        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    public void deleteUserTest() throws Exception {
        UUID userId = UUID.randomUUID();
        ResponseEntity<Void> response = userController.deleteUser(userId);
        verify(userService, times(1)).deleteUser(userId);
        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    public void createUserTest() throws Exception {
        // 1) Test user service invocations
        when(userService.createUser(any(UserDto.class))).thenReturn(new UserDto());
        userController.createUser(new UserDto());
        verify(userService, times(1)).createUser(any(UserDto.class));

        // 2) Test user controller 
        UUID uuid = UUID.randomUUID();
        when(userService.createUser(any(UserDto.class))).thenReturn(UserDto.builder().id(uuid).build());
        ResponseEntity<Void> response = userController.createUser(new UserDto());
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals("/api/v1/" + uuid, response.getHeaders().get("Location").get(0));
    }

    @Test
    public void updateUserTest() throws Exception {
        // 1) Test user service invocations
        UserDto userDto = new UserDto();
        userController.updateUser(userDto.getId(), userDto);
        verify(userService, times(1)).updateUser(userDto.getId(), userDto);

        // 2) Test user controller response
        ResponseEntity<Void> response = userController.updateUser(null, userDto);
        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
    }
}
