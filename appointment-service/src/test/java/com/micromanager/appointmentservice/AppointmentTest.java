package com.micromanager.appointmentservice;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.time.LocalDateTime;
import java.util.UUID;
import java.util.Date;

import org.junit.jupiter.api.Test;

import com.micromanager.appointmentservice.domain.AppointmentDto;
import com.micromanager.appointmentservice.model.Appointment;

public class AppointmentTest {

    @Test
    public void createAppointment() {
        UUID uuid = UUID.randomUUID();
        UUID userId = UUID.randomUUID();
        Date date = new Date();
        LocalDateTime startTime = LocalDateTime.now();
        LocalDateTime endDateTime = LocalDateTime.now();

        Appointment appointment = new Appointment();
        appointment.setId(uuid);
        appointment.setApptName("name");
        appointment.setApptType("type");
        appointment.setDescription("description");
        appointment.setCreatedDate(date);
        appointment.setStartTime(startTime);
        appointment.setEndTime(endDateTime);
        appointment.setUserId(userId);
        appointment.setMetadata("metadata");
        appointment.setUserName("user");

        assertEquals(uuid, appointment.getId());
        assertEquals("name", appointment.getApptName());
        assertEquals("type", appointment.getApptType());
        assertEquals("description", appointment.getDescription());
        assertEquals(date, appointment.getCreatedDate());
        assertEquals(startTime, appointment.getStartTime());
        assertEquals(endDateTime, appointment.getEndTime());
        assertEquals(userId, appointment.getUserId());
        assertEquals("metadata", appointment.getMetadata());
        assertEquals("user", appointment.getUserName());
    }
    
    @Test
    public void createAppointmentDto() {
        UUID uuid = UUID.randomUUID();
        UUID userId = UUID.randomUUID();
        LocalDateTime startTime = LocalDateTime.now();
        LocalDateTime endDateTime = LocalDateTime.now();

        AppointmentDto appointmentDto = new AppointmentDto();
        appointmentDto.setId(uuid);
        appointmentDto.setApptName("name");
        appointmentDto.setApptType("type");
        appointmentDto.setDescription("description");
        appointmentDto.setStartTime(startTime.toString());
        appointmentDto.setEndTime(endDateTime.toString());
        appointmentDto.setUserId(userId);
        appointmentDto.setMetadata("metadata");
        appointmentDto.setUserName("user");

        assertEquals(uuid, appointmentDto.getId());
        assertEquals("name", appointmentDto.getApptName());
        assertEquals("type", appointmentDto.getApptType());
        assertEquals("description", appointmentDto.getDescription());
        assertEquals(startTime.toString(), appointmentDto.getStartTime());
        assertEquals(endDateTime.toString(), appointmentDto.getEndTime());
        assertEquals(userId, appointmentDto.getUserId());
        assertEquals("metadata", appointmentDto.getMetadata());
        assertEquals("user", appointmentDto.getUserName());
    }

    @Test
    public void testToString() {
        AppointmentDto appointmentDto1 = AppointmentDto.builder().apptName("Appt").build();
        assertEquals("Appt", appointmentDto1.toString());

        assertEquals("AppointmentDto.AppointmentDtoBuilder(id$value=null, apptName=null, apptType=null, description=null, startTime=null, endTime=null, metadata=null, userId=null, userName=null)", AppointmentDto.builder().toString());

        Appointment appointment1 = Appointment.builder().apptName("Appt").build();
        assertEquals("Appt", appointment1.toString());

        assertEquals("Appointment.AppointmentBuilder(id=null, createdDate=null, apptName=null, apptType=null, description=null, startTime=null, endTime=null, userId=null, metadata=null, userName=null)", Appointment.builder().toString());
    }
}
