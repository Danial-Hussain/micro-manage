package com.micromanager.userservice.mapper;

import org.mapstruct.Mapper;

import com.micromanager.userservice.domain.UserDto;
import com.micromanager.userservice.model.User;

@Mapper(componentModel = "spring")
public interface UserMapper {
    UserDto userToUserDto(User user);
    User userDtoToUser(UserDto userDto);
}
