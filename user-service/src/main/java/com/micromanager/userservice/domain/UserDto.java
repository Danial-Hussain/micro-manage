package com.micromanager.userservice.domain;

import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.validation.constraints.NotBlank;

import java.util.Date;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.Builder.Default;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {
    @Default
    private UUID id = UUID.randomUUID();

    @JsonIgnore
    private Date createdDate;

    @NotBlank
    private String firstName;
    
    @NotBlank
    private String lastName;

    private int age;
    
    private String gender;

    private List<String> phoneNumbers;

    private List<String> emailAddresses;

    @Override
    public String toString() {
        return this.firstName;
    }
}
