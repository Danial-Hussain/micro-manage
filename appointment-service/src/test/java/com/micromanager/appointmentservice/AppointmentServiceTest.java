package com.micromanager.appointmentservice;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.Optional;
import java.util.UUID;
import java.util.List;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import com.micromanager.appointmentservice.domain.AppointmentDto;
import com.micromanager.appointmentservice.exception.AppointmentNotFoundException;
import com.micromanager.appointmentservice.exception.UserNotFoundException;
import com.micromanager.appointmentservice.mapper.AppointmentMapper;
import com.micromanager.appointmentservice.model.Appointment;
import com.micromanager.appointmentservice.proxy.AppointmentServiceProxy;
import com.micromanager.appointmentservice.repository.AppointmentRepository;
import com.micromanager.appointmentservice.service.AppointmentServiceImpl;

public class AppointmentServiceTest {
    
    @Mock
    private AppointmentMapper appointmentMapper;

    @Mock
    private AppointmentRepository appointmentRepository;

    @Mock
    private AppointmentServiceProxy appointmentServiceProxy;

    @InjectMocks
    private AppointmentServiceImpl appointmentService;

    private AutoCloseable autoCloseable;

    @BeforeEach
    void initService() {
        autoCloseable = MockitoAnnotations.openMocks(this);
        appointmentService = new AppointmentServiceImpl(appointmentMapper, appointmentRepository, appointmentServiceProxy);
    }

    @AfterEach
    void closeService() throws Exception {
        autoCloseable.close();
    }

    @Test
    public void deleteAppointmentsByUserIdTest() throws Exception {
        UUID uuid = UUID.randomUUID();

        List<Appointment> appts = new ArrayList<Appointment>();
        appts.add(new Appointment());
        appts.add(new Appointment());
        appts.add(new Appointment());

        when(appointmentRepository.findByUserId(uuid)).thenReturn(appts);
        appointmentService.deleteAppointmentsByUserId(uuid);
        verify(appointmentRepository, times(3)).delete(any(Appointment.class));
    }

    @Test
    public void getAppointmentTest() throws Exception {
        // 1) Invalid appointment test
        UUID fakeUuid = UUID.randomUUID();
        Optional<Appointment> invalidAppointment = Optional.empty();
        when(appointmentRepository.findById(fakeUuid)).thenReturn(invalidAppointment);
        verify(appointmentMapper, times(0)).appointmentToAppointmentDto(any(Appointment.class));
        assertThrows(AppointmentNotFoundException.class, () -> appointmentService.selectAppointment(fakeUuid));

        // 2) Selecting a valid appointment
        UUID validUuid = UUID.randomUUID();
        when(appointmentRepository.findById(validUuid)).thenReturn(Optional.of(new Appointment()));
        when(appointmentMapper.appointmentToAppointmentDto(any(Appointment.class))).thenReturn(any(AppointmentDto.class));
        appointmentService.selectAppointment(validUuid);
        verify(appointmentMapper, times(1)).appointmentToAppointmentDto(any(Appointment.class));
    }

    @Test
    public void listAppointmentsTest() throws Exception {
        List<Appointment> appts = new ArrayList<Appointment>();
        appts.add(new Appointment());
        appts.add(new Appointment());
        appts.add(new Appointment());
        
        Page<Appointment> apptsPage = new PageImpl<>(appts);
        Optional<Integer> page = Optional.of(0);
        Optional<Integer> size = Optional.of(5);
        Optional<String> sortBy = Optional.of("startTime");
        Optional<String> searchTerm = Optional.of("");
        Optional<Boolean> asc = Optional.of(true);

        when(appointmentRepository.findByApptNameContainingIgnoreCaseOrUserNameContainingIgnoreCaseOrApptTypeContainingIgnoreCase(
            any(String.class), any(String.class), any(String.class), any(Pageable.class))
        ).thenReturn(apptsPage);
        when(appointmentMapper.appointmentToAppointmentDto(any(Appointment.class))).thenReturn(new AppointmentDto());
        assertEquals(3, appointmentService.listAppointments(page, size, sortBy, searchTerm, asc).size());
    }

    @Test
    public void deleteAppointmentTest() throws Exception {
        // 1) Appointment not found
        UUID invalidUuid = UUID.randomUUID();
        when(appointmentRepository.findById(invalidUuid)).thenReturn(Optional.empty());
        assertThrows(AppointmentNotFoundException.class, () -> appointmentService.deleteAppointment(invalidUuid));

        // 2) Appointment not found
        UUID validUuid = UUID.randomUUID();
        when(appointmentRepository.findById(validUuid)).thenReturn(Optional.of(new Appointment()));
        appointmentService.deleteAppointment(validUuid);
        verify(appointmentRepository, times(1)).delete(any(Appointment.class));
    }

    @Test
    public void createAppointmentTest() throws Exception {
        // 1) Appointment not found
        UUID invalidUuid = UUID.randomUUID();
        when(appointmentServiceProxy.userExists(invalidUuid)).thenReturn(true);
        assertThrows(UserNotFoundException.class, () -> appointmentService.createAppointment(AppointmentDto.builder().id(invalidUuid).build()));
        verify(appointmentRepository, times(0)).save(any(Appointment.class));
    }

    @Test
    public void updateAppointmentTest() throws Exception {
         // 1) Appointment not found
        UUID invalidUuid = UUID.randomUUID();
        when(appointmentServiceProxy.userExists(invalidUuid)).thenReturn(false);
        assertThrows(UserNotFoundException.class, () -> appointmentService.updateAppointment(invalidUuid, AppointmentDto.builder().id(invalidUuid).build()));
        verify(appointmentRepository, times(0)).save(any(Appointment.class));
    }
}
