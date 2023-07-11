package com.micromanager.appointmentservice.controller;

import java.util.UUID;
import java.util.List;
import java.util.Optional;

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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.micromanager.appointmentservice.domain.AppointmentDto;
import com.micromanager.appointmentservice.service.AppointmentService;

import jakarta.validation.Valid;

@RestController
@CrossOrigin(origins = "*", exposedHeaders = "Location")
@RequestMapping("/v1/appointment")
public class AppointmentController {

    private final AppointmentService appointmentService;

    public AppointmentController(AppointmentService _appointmentService) {
        this.appointmentService = _appointmentService;
    }

    @DeleteMapping("/user/{userId}")
    public ResponseEntity<Void> deleteAppointmentsByUserId(@PathVariable("userId") UUID userId) {
        appointmentService.deleteAppointmentsByUserId(userId);
        return new ResponseEntity<Void>(HttpStatus.OK);
    }
    
    @GetMapping("/{apptId}")
    public ResponseEntity<AppointmentDto> getAppointment(@PathVariable("apptId") UUID apptId) {
        return new ResponseEntity<AppointmentDto>(appointmentService.selectAppointment(apptId), HttpStatus.OK);
    }

    @GetMapping("/list")
    public ResponseEntity<List<AppointmentDto>> listAppointments(
        @RequestParam("page") Optional<Integer> page, 
        @RequestParam("size") Optional<Integer> size,
        @RequestParam("sortBy") Optional<String> sortBy,
        @RequestParam("searchTerm") Optional<String> searchTerm,
        @RequestParam("asc") Optional<Boolean> asc
    ) {
        return new ResponseEntity<List<AppointmentDto>>(
            appointmentService.listAppointments(page, size, sortBy, searchTerm, asc), HttpStatus.OK);
    }

    @DeleteMapping("/{apptId}")
    public ResponseEntity<Void> deleteAppointment(@PathVariable UUID apptId) {
        appointmentService.deleteAppointment(apptId);
        return new ResponseEntity<Void>(HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Void> createAppointment(@Valid @RequestBody AppointmentDto appointmentDto) {
        AppointmentDto newAppointmentDto = appointmentService.createAppointment(appointmentDto);

        HttpHeaders headers = new HttpHeaders();
        headers.add("Location", "/api/v1/" + newAppointmentDto.getId().toString());
        
        return new ResponseEntity<Void>(headers, HttpStatus.CREATED);
    }

    @PutMapping("/{apptId}")
    public ResponseEntity<Void> updateAppointment(
        @PathVariable("apptId") UUID apptId, 
        @Valid @RequestBody AppointmentDto appointmentDto
    ) {
        appointmentService.updateAppointment(apptId, appointmentDto);
        return new ResponseEntity<Void>(HttpStatus.NO_CONTENT);
    }
}