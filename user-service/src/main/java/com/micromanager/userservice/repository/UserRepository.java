package com.micromanager.userservice.repository;

import java.util.UUID;

import org.springframework.data.repository.CrudRepository;

import com.micromanager.userservice.model.User;

public interface UserRepository extends CrudRepository<User, UUID> {

}
