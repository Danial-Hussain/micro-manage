package com.micromanager.userservice;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.List;
import java.util.Date;

import org.junit.jupiter.api.Test;

import com.micromanager.userservice.domain.UserDto;
import com.micromanager.userservice.model.User;

public class UserTest {
    
    @Test
    public void createUserTest() {
        UUID uuid = UUID.randomUUID();
        Date date = new Date();

        User user = new User();
        user.setId(uuid);
        user.setCreatedDate(date);
        user.setFirstName("John");
        user.setLastName("Doe");
        user.setAge(32);
        user.setGender("Male");
        user.setPhoneNumbers(List.of("407-111-1212"));
        user.setEmailAddresses(List.of("johndoe@gmail.com"));

        assertEquals(uuid, user.getId());
        assertEquals(date, user.getCreatedDate());
        assertEquals("John", user.getFirstName());
        assertEquals("Doe", user.getLastName());
        assertEquals(32, user.getAge());
        assertEquals("Male", user.getGender());
        assertEquals(List.of("407-111-1212"), user.getPhoneNumbers());
        assertEquals(List.of("johndoe@gmail.com"), user.getEmailAddresses());
    }

    @Test
    public void createUserDtoTest() {
        UUID uuid = UUID.randomUUID();
        Date date = new Date();

        UserDto userDto = new UserDto();
        userDto.setId(uuid);
        userDto.setCreatedDate(date);
        userDto.setFirstName("John");
        userDto.setLastName("Doe");
        userDto.setAge(32);
        userDto.setGender("Male");
        userDto.setPhoneNumbers(List.of("407-111-1212"));
        userDto.setEmailAddresses(List.of("johndoe@gmail.com"));

        assertEquals(uuid, userDto.getId());
        assertEquals(date, userDto.getCreatedDate());
        assertEquals("John", userDto.getFirstName());
        assertEquals("Doe", userDto.getLastName());
        assertEquals(32, userDto.getAge());
        assertEquals("Male", userDto.getGender());
        assertEquals(List.of("407-111-1212"), userDto.getPhoneNumbers());
        assertEquals(List.of("johndoe@gmail.com"), userDto.getEmailAddresses());
    }
    
    @Test
    public void testToString() {
        UserDto userDto = UserDto.builder().firstName("Name").build();
        assertEquals("Name", userDto.toString());

        assertEquals("UserDto.UserDtoBuilder(id$value=null, createdDate=null, firstName=null, lastName=null, age=0, gender=null, phoneNumbers=null, emailAddresses=null)", UserDto.builder().toString());

        User user = User.builder().firstName("Name").build();
        assertEquals("Name", user.toString());

        assertEquals("User.UserBuilder(id=null, createdDate=null, firstName=null, lastName=null, age=0, gender=null, phoneNumbers=null, emailAddresses=null)", User.builder().toString());
    }
}
