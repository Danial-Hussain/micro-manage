package com.micromanager.appointmentservice.repository;

import java.util.UUID;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;

import com.micromanager.appointmentservice.model.Appointment;

public interface AppointmentRepository extends 
    PagingAndSortingRepository<Appointment, UUID>, CrudRepository<Appointment, UUID> 
{
    public List<Appointment> findByUserId(UUID userId);   
    public Page<Appointment> findByApptNameContainingIgnoreCaseOrUserNameContainingIgnoreCaseOrApptTypeContainingIgnoreCase(
        String apptName, String userName, String apptType, Pageable pageable
    );
}
