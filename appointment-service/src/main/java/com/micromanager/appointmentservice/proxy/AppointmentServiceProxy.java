package com.micromanager.appointmentservice.proxy;

import java.util.UUID;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "user-service")
public interface AppointmentServiceProxy {
    @GetMapping("/api/v1/user/exists/{userId}")
    public Boolean userExists (@PathVariable("userId") UUID userId);
}
