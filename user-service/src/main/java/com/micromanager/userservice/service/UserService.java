package com.micromanager.userservice.service;

import java.util.UUID;
import java.util.List;

import com.micromanager.userservice.domain.UserDto;

public interface UserService {
    public UserDto selectUser(UUID userId);
    public List<UserDto> listUsers();
    public void deleteUser(UUID userId);
    public UserDto createUser(UserDto userDto);
    public void updateUser(UUID userId, UserDto userDto);
    public boolean userExists(UUID userId);
}
