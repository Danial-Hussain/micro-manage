package com.micromanager.userservice.proxy;

import java.util.UUID;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "appointment-service")
public interface UserServiceProxy {
    @DeleteMapping("api/v1/appointment/user/{userId}")
    public void deleteAppointmentsByUserId(@PathVariable("userId") UUID userId);
}
