package com.micromanager.userservice;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.UUID;
import java.util.List;
import java.util.Optional;
import java.util.ArrayList;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import com.micromanager.userservice.domain.UserDto;
import com.micromanager.userservice.exception.CustomizedResponseExceptionHandler;
import com.micromanager.userservice.exception.UserNotFoundException;
import com.micromanager.userservice.mapper.UserMapper;
import com.micromanager.userservice.model.User;
import com.micromanager.userservice.proxy.UserServiceProxy;
import com.micromanager.userservice.repository.UserRepository;
import com.micromanager.userservice.service.UserServiceImpl;

public class UserServiceTest {

    @Mock
    private UserMapper userMapper;

    @Mock
    private UserRepository userRepository;

    @Mock
    private UserServiceProxy userServiceProxy;

    @Mock
    private CustomizedResponseExceptionHandler customizedResponseExceptionHandler;

    @InjectMocks
    private UserServiceImpl userService;
    private AutoCloseable autoCloseable;

    @BeforeEach
    void initService() {
        autoCloseable = MockitoAnnotations.openMocks(this);
        userService = new UserServiceImpl(userMapper, userRepository, userServiceProxy);
    }

    @AfterEach
    void closeService() throws Exception {
        autoCloseable.close();
    }

    @Test
    public void selectUserTest() throws Exception {
        // 1) Invalid User Test
        UUID fakeUuid = UUID.randomUUID();
        Optional<User> invalidUser = Optional.empty();
        when(userRepository.findById(fakeUuid)).thenReturn(invalidUser);
        verify(userMapper, times(0)).userToUserDto(any(User.class));
        assertThrows(UserNotFoundException.class, () -> userService.selectUser(fakeUuid));
    
        // 2) Selecting a valid user
        UUID validUuid = UUID.randomUUID();
        when(userRepository.findById(validUuid)).thenReturn(Optional.of(new User()));
        when(userMapper.userToUserDto(any(User.class))).thenReturn(any(UserDto.class));
        userService.selectUser(validUuid);
        verify(userMapper, times(1)).userToUserDto(any(User.class));  
    }        

    @Test 
    public void listUsersTest() throws Exception {
        List<User> users = new ArrayList<User>();  
        users.add(new User());
        users.add(new User());
        users.add(new User());

        when(userRepository.findAll()).thenReturn(users);
        when(userMapper.userToUserDto(any(User.class))).thenReturn(new UserDto());
        assertEquals(3, userService.listUsers().size());
    }

    @Test
    public void deleteUserTest() throws Exception {
        // 1) User not found
        UUID invalidUuid = UUID.randomUUID();
        when(userRepository.findById(invalidUuid)).thenReturn(Optional.empty());
        assertThrows(UserNotFoundException.class, () -> userService.deleteUser(invalidUuid));

        // 2) User found
        UUID validUuid = UUID.randomUUID();
        when(userRepository.findById(validUuid)).thenReturn(Optional.of(new User()));
        userService.deleteUser(validUuid);
        verify(userRepository, times(1)).delete(any(User.class));
    }

    @Test
    public void createUserTest() throws Exception {
        UserDto userDto = new UserDto();
        when(userRepository.save(any(User.class))).thenReturn(new User());
        when(userMapper.userDtoToUser(any(UserDto.class))).thenReturn(new User());
        when(userMapper.userToUserDto(any(User.class))).thenReturn(new UserDto());

        userService.createUser(userDto);
        verify(userRepository, times(1)).save(any(User.class));
        verify(userMapper, times(1)).userToUserDto(any(User.class));
        verify(userMapper, times(1)).userDtoToUser(any(UserDto.class));
    }  

    @Test
    public void updateUserTest() throws Exception {
        // 1) Non Existing user
        UUID invalidUuid = UUID.randomUUID();
        when(userRepository.findById(invalidUuid)).thenReturn(Optional.empty());
        assertThrows(UserNotFoundException.class, () -> userService.updateUser(invalidUuid, any(UserDto.class)));

        // 2) Existing user
        UUID validUuid = UUID.randomUUID();
        when(userRepository.findById(validUuid)).thenReturn(Optional.of(new User()));
        when(userMapper.userDtoToUser(any(UserDto.class))).thenReturn(new User());
        userService.updateUser(validUuid, new UserDto());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    public void userExistsTest() throws Exception {
        // 1) Non existing user
        UUID invalidUuid = UUID.randomUUID();
        when(userRepository.findById(invalidUuid)).thenReturn(Optional.empty());
        assertEquals(false, userService.userExists(invalidUuid));

        // 2) Existing user
        UUID validUuid = UUID.randomUUID();
        when(userRepository.findById(validUuid)).thenReturn(Optional.of(new User()));
        assertEquals(true, userService.userExists(validUuid));
    }
}