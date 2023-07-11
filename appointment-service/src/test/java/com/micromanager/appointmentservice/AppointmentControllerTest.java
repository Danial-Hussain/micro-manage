package com.micromanager.appointmentservice;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.UUID;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.micromanager.appointmentservice.controller.AppointmentController;
import com.micromanager.appointmentservice.domain.AppointmentDto;
import com.micromanager.appointmentservice.service.AppointmentService;

public class AppointmentControllerTest {

    @Mock
    private AppointmentService appointmentService;
    
    private AutoCloseable autoCloseable;

    @InjectMocks
    private AppointmentController appointmentController;

    @BeforeEach
    void initService() {
        autoCloseable = MockitoAnnotations.openMocks(this);
        appointmentController = new AppointmentController(appointmentService);
    }

    @AfterEach
    void closeService() throws Exception {
        autoCloseable.close();
    }

    @Test
    public void deleteAppointmentsByUserIdTest() throws Exception {
        UUID userId = UUID.randomUUID();
        ResponseEntity<Void> response = appointmentController.deleteAppointmentsByUserId(userId);
        verify(appointmentService, times(1)).deleteAppointmentsByUserId(userId);
        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    public void getAppointmentTest() throws Exception {
        UUID uuid = UUID.randomUUID();
        when(appointmentService.selectAppointment(uuid)).thenReturn(new AppointmentDto());
        ResponseEntity<AppointmentDto> response = appointmentController.getAppointment(uuid);
        verify(appointmentService, times(1)).selectAppointment(uuid);
        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    public void listAppointmentsTest() throws Exception {
        List<AppointmentDto> appts = new ArrayList<AppointmentDto>();
        
        appts.add(new AppointmentDto());
        appts.add(new AppointmentDto());
        appts.add(new AppointmentDto());

        Optional<Integer> page = Optional.of(0);
        Optional<Integer> size = Optional.of(5);
        Optional<String> sortBy = Optional.of("startTime");
        Optional<String> searchTerm = Optional.of("");
        Optional<Boolean> asc = Optional.of(true);

        when(appointmentService.listAppointments(page, size, sortBy, searchTerm, asc)).thenReturn(appts);
        ResponseEntity<List<AppointmentDto>> apptList = appointmentController.listAppointments(page, size, sortBy, searchTerm, asc);

        assertEquals(3, apptList.getBody().size());
        assertEquals(HttpStatus.OK, apptList.getStatusCode());
        verify(appointmentService, times(1)).listAppointments(page, size, sortBy, searchTerm, asc);
    }

    @Test
    public void deleteAppointmentTest() throws Exception {
        UUID uuid = UUID.randomUUID();
        ResponseEntity<Void> response = appointmentController.deleteAppointment(uuid);
        verify(appointmentService, times(1)).deleteAppointment(uuid);
        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    public void createAppointmentTest() throws Exception {
        // 1) Test Appointment service invocations
        when(appointmentService.createAppointment(any(AppointmentDto.class))).thenReturn(new AppointmentDto());
        appointmentController.createAppointment(new AppointmentDto());
        verify(appointmentService, times(1)).createAppointment(any(AppointmentDto.class));

        // 2) Test Appointment controller
        UUID uuid = UUID.randomUUID();
        when(appointmentService.createAppointment(any(AppointmentDto.class))).thenReturn(AppointmentDto.builder().id(uuid).build());
        ResponseEntity<Void> response = appointmentController.createAppointment(new AppointmentDto());
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals("/api/v1/" + uuid, response.getHeaders().get("Location").get(0));
    }

    @Test
    public void updateAppointmentTest() throws Exception {
        // 1) Test appointment service invocations
        AppointmentDto appointmentDto = new AppointmentDto();
        appointmentController.updateAppointment(appointmentDto.getId(), appointmentDto);
        verify(appointmentService, times(1)).updateAppointment(appointmentDto.getId(), appointmentDto);

        // 2) Test appointment controller response
        ResponseEntity<Void> response = appointmentController.updateAppointment(null, appointmentDto);
        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
    }
}
