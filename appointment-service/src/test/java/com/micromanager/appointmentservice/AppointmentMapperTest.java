package com.micromanager.appointmentservice;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.time.LocalDateTime;
import java.util.Date;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockitoAnnotations;

import com.micromanager.appointmentservice.domain.AppointmentDto;
import com.micromanager.appointmentservice.mapper.AppointmentMapper;
import com.micromanager.appointmentservice.mapper.DateMapper;
import com.micromanager.appointmentservice.model.Appointment;
import com.micromanager.appointmentservice.mapper.AppointmentMapperImpl;
import com.micromanager.appointmentservice.mapper.DateMapperImpl;

public class AppointmentMapperTest {
    private AppointmentMapper appointmentMapper;

    private DateMapper dateMapper;

    private AutoCloseable autoCloseable;

    @BeforeEach
    void initService() {
        autoCloseable = MockitoAnnotations.openMocks(this);
        dateMapper = new DateMapperImpl();
        appointmentMapper = new AppointmentMapperImpl(dateMapper);
    }

    @AfterEach
    void closeService() throws Exception {
        autoCloseable.close();
    }

    @Test
    public void convertAppointmentToAppointmentDtoTest() {
        UUID uuid = UUID.randomUUID();
        UUID userId = UUID.randomUUID();
        Date date = new Date();
        LocalDateTime startTime = LocalDateTime.now();
        LocalDateTime endTime = LocalDateTime.now();

        Appointment appointment = Appointment.builder()
            .id(uuid)
            .createdDate(date)
            .apptName("Appointment")
            .apptType("Appointment Type")
            .description("This is an appointment")
            .startTime(startTime)
            .endTime(endTime)
            .userId(userId)
            .metadata("Metadata")
            .userName("User")
            .build();
        
        AppointmentDto appointmentDto = appointmentMapper.appointmentToAppointmentDto(appointment);
        assertEquals(uuid, appointmentDto.getId());
        assertEquals( "Appointment", appointmentDto.getApptName());
        assertEquals("Appointment Type", appointmentDto.getApptType());
        assertEquals("This is an appointment", appointmentDto.getDescription());
        assertEquals(startTime.toString(), appointmentDto.getStartTime());
        assertEquals(endTime.toString(), appointmentDto.getEndTime());
        assertEquals(userId, appointmentDto.getUserId());
        assertEquals("Metadata", appointmentDto.getMetadata());
        assertEquals("User", appointmentDto.getUserName());
    }

    @Test
    public void convertAppointmentDtoToAppointmentTest() {
        UUID uuid = UUID.randomUUID();
        UUID userId = UUID.randomUUID();
        LocalDateTime startTime = LocalDateTime.now();
        LocalDateTime endTime = LocalDateTime.now();

        AppointmentDto appointmentDto = AppointmentDto.builder()
            .id(uuid)
            .apptName("Appointment")
            .apptType("Appointment Type")
            .description("This is an appointment")
            .startTime(startTime.toString())
            .endTime(endTime.toString())
            .userId(userId)
            .metadata("Metadata")
            .userName("User")
            .build();
        
        Appointment appointment = appointmentMapper.appointmentDtoToAppointment(appointmentDto);
        assertEquals(uuid, appointment.getId());
        assertEquals("Appointment", appointment.getApptName());
        assertEquals("Appointment Type", appointment.getApptType());
        assertEquals("This is an appointment", appointment.getDescription());
        assertEquals(startTime, appointment.getStartTime());
        assertEquals(endTime, appointment.getEndTime());
        assertEquals(userId, appointment.getUserId());
        assertEquals("Metadata", appointment.getMetadata());
        assertEquals("User", appointmentDto.getUserName());
    }
}
