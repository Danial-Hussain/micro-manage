package com.micromanager.userservice.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.micromanager.userservice.domain.UserDto;
import com.micromanager.userservice.service.UserService;

import jakarta.validation.Valid;

@RestController
@CrossOrigin(origins = "*", exposedHeaders = "Location")
@RequestMapping("/v1/user")
public class UserController {

    private final UserService userService;

    public UserController(UserService _userService) {
        this.userService = _userService;
    }

    @GetMapping("/exists/{userId}")
    public ResponseEntity<Boolean> userExists(@PathVariable("userId") UUID userId) {
        return new ResponseEntity<Boolean>(userService.userExists(userId), HttpStatus.OK);
    } 

    @GetMapping("/{userId}")
    public ResponseEntity<UserDto> selectUser(@PathVariable("userId") UUID userId) {
        return new ResponseEntity<UserDto>(userService.selectUser(userId), HttpStatus.OK);
    }

    @GetMapping("/list")
    public ResponseEntity<List<UserDto>> listUsers() {
        return new ResponseEntity<List<UserDto>>(userService.listUsers(), HttpStatus.OK);
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> deleteUser(@PathVariable("userId") UUID userId) {
        userService.deleteUser(userId);
        return new ResponseEntity<Void>(HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Void> createUser(@Valid @RequestBody UserDto userDto) {
        UserDto newUserDto = userService.createUser(userDto);

        HttpHeaders headers = new HttpHeaders();
        headers.add("Location", "/api/v1/" + newUserDto.getId().toString());
        
        return new ResponseEntity<Void>(headers, HttpStatus.CREATED);
    }

    @PutMapping("/{userId}")
    public ResponseEntity<Void> updateUser(
        @PathVariable("userId") UUID userId, 
        @Valid @RequestBody UserDto userDto
    ) {
        userService.updateUser(userId, userDto);
        return new ResponseEntity<Void>(HttpStatus.NO_CONTENT);
    }
}
