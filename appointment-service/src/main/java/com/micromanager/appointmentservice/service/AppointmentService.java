package com.micromanager.appointmentservice.service;

import java.util.List;
import java.util.UUID;

import com.micromanager.appointmentservice.domain.AppointmentDto;

import java.util.Optional;

public interface AppointmentService {
    public AppointmentDto selectAppointment(UUID appointmentId);

    public List<AppointmentDto> listAppointments(
        Optional<Integer> page, 
        Optional<Integer> size, 
        Optional<String> sortBy, 
        Optional<String> searchTerm,
        Optional<Boolean> asc
    );
    
    public void deleteAppointment(UUID appointmentId);
    public AppointmentDto createAppointment(AppointmentDto appointmentDto);
    public void updateAppointment(UUID appointmentId, AppointmentDto appointmentDto);
    public void deleteAppointmentsByUserId(UUID userId);
}
