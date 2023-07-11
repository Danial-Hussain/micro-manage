package com.micromanager.userservice.service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import org.springframework.stereotype.Service;

import com.micromanager.userservice.domain.UserDto;
import com.micromanager.userservice.exception.UserNotFoundException;
import com.micromanager.userservice.mapper.UserMapper;
import com.micromanager.userservice.model.User;
import com.micromanager.userservice.proxy.UserServiceProxy;
import com.micromanager.userservice.repository.UserRepository;

@Service
public class UserServiceImpl implements UserService {

    private final UserMapper userMapper;

    private final UserRepository userRepository;

    private final UserServiceProxy userServiceProxy;

    public UserServiceImpl(
        UserMapper _userMapper, 
        UserRepository _userRepository, 
        UserServiceProxy _userServiceProxy
    ) {
        this.userMapper = _userMapper;
        this.userRepository = _userRepository;
        this.userServiceProxy = _userServiceProxy;
    }

    public UserDto selectUser(UUID userId) {
        Optional<User> user = userRepository.findById(userId);

        return userMapper.userToUserDto(
            user.orElseThrow(
                () -> new UserNotFoundException("User " + userId + " not found")
            )
        );
    }

    public List<UserDto> listUsers() {
        return StreamSupport.stream(userRepository.findAll().spliterator(), false)
            .map(userMapper::userToUserDto)
            .collect(Collectors.toList());
    }

    public void deleteUser(UUID userId) {
        userServiceProxy.deleteAppointmentsByUserId(userId);

        Optional<User> user = userRepository.findById(userId);

        userRepository.delete(user.orElseThrow(
             () -> new UserNotFoundException("User " + userId + " not found")
        ));
    }

    public UserDto createUser(UserDto userDto) {
        return userMapper.userToUserDto(
            userRepository.save(userMapper.userDtoToUser(userDto))
        );
    }

    public void updateUser(UUID userId, UserDto userDto) {
        Optional<User> user = userRepository.findById(userId);
        User updatedUser = userMapper.userDtoToUser(userDto);

        if (user.isPresent()) {
            User u = user.get();
            updatedUser.setId(u.getId());
            userRepository.save(updatedUser);
        } else {
            throw new UserNotFoundException("User " + userId + " not found");
        }
    }

    public boolean userExists(UUID userId) {
        Optional<User> user = userRepository.findById(userId);
        if (user.isPresent()) return true;
        return false;
    }
}
