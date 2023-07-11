package com.micromanager.userservice;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.List;
import java.util.UUID;
import java.util.Date;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockitoAnnotations;

import com.micromanager.userservice.domain.UserDto;
import com.micromanager.userservice.mapper.UserMapper;
import com.micromanager.userservice.mapper.UserMapperImpl;
import com.micromanager.userservice.model.User;

public class UserMapperTest {
    private UserMapper userMapper;

    private AutoCloseable autoCloseable;

    @BeforeEach
    void initService() {
        autoCloseable = MockitoAnnotations.openMocks(this);
        userMapper = new UserMapperImpl();
    }

    @AfterEach
    void closeService() throws Exception {
        autoCloseable.close();
    }

    @Test
    public void convertUserToUserDtoTest() {
        UUID uuid = UUID.randomUUID();
        Date date = new Date();

        User user = User.builder()
            .id(uuid)
            .createdDate(date)
            .firstName("John")
            .lastName("Doe")
            .age(25)
            .gender("Male")
            .phoneNumbers(List.of("407-111-2222"))
            .emailAddresses(List.of("johndoe@gmail.com"))
            .build();

        UserDto userDto = userMapper.userToUserDto(user);
        assertEquals(uuid, userDto.getId());
        assertEquals(date, userDto.getCreatedDate());
        assertEquals("John", userDto.getFirstName());
        assertEquals("Doe", userDto.getLastName());
        assertEquals(25, userDto.getAge());
        assertEquals("Male", userDto.getGender());
        assertEquals(List.of("407-111-2222"), userDto.getPhoneNumbers());
        assertEquals(List.of("johndoe@gmail.com"), userDto.getEmailAddresses());
    }   
    
    @Test
    public void convertUserDtoToUserTest() {
        UUID uuid = UUID.randomUUID();
        Date date = new Date();

        UserDto userDto = UserDto.builder()
            .id(uuid)
            .createdDate(date)
            .firstName("John")
            .lastName("Doe")
            .age(25)
            .gender("Male")
            .phoneNumbers(List.of("407-111-2222"))
            .emailAddresses(List.of("johndoe@gmail.com"))
            .build();
        
        User user = userMapper.userDtoToUser(userDto);
        assertEquals(uuid, user.getId());
        assertEquals(date, user.getCreatedDate());
        assertEquals("John", user.getFirstName());
        assertEquals("Doe", user.getLastName());
        assertEquals(25, user.getAge());
        assertEquals("Male", user.getGender());
        assertEquals(List.of("407-111-2222"), user.getPhoneNumbers());
        assertEquals(List.of("johndoe@gmail.com"), user.getEmailAddresses());
    }
}
