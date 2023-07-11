package com.micromanager.appointmentservice.service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.micromanager.appointmentservice.domain.AppointmentDto;
import com.micromanager.appointmentservice.exception.AppointmentNotFoundException;
import com.micromanager.appointmentservice.exception.UserNotFoundException;
import com.micromanager.appointmentservice.mapper.AppointmentMapper;
import com.micromanager.appointmentservice.model.Appointment;
import com.micromanager.appointmentservice.proxy.AppointmentServiceProxy;
import com.micromanager.appointmentservice.repository.AppointmentRepository;

@Service
public class AppointmentServiceImpl implements AppointmentService {

    private final AppointmentMapper appointmentMapper;

    private final AppointmentRepository appointmentRepository;

    private final AppointmentServiceProxy appointmentServiceProxy;

    public AppointmentServiceImpl(
        AppointmentMapper _appointmentMapper,
        AppointmentRepository _appointmentRepository,
        AppointmentServiceProxy _appointmentServiceProxy
    ) {
        this.appointmentMapper = _appointmentMapper;
        this.appointmentRepository = _appointmentRepository;
        this.appointmentServiceProxy = _appointmentServiceProxy;
    }

    public AppointmentDto selectAppointment(UUID appointmentId) {
        Optional<Appointment> appointment = appointmentRepository.findById(appointmentId);

        return appointmentMapper.appointmentToAppointmentDto(
            appointment.orElseThrow(
                () -> new AppointmentNotFoundException("Appointment " + appointmentId + " not found")
            )
        );
    }

    public List<AppointmentDto> listAppointments(
        Optional<Integer> page, 
        Optional<Integer> size, 
        Optional<String> sortBy, 
        Optional<String> searchTerm,
        Optional<Boolean> asc
    ) {
        Pageable pageReq;
        String searchTermValue = searchTerm.isPresent() ? searchTerm.get() : "";

        if (sortBy.isPresent() && asc.isPresent()) {
            pageReq = PageRequest.of(
                page.isPresent() ? page.get() : 0, 
                size.isPresent() ? size.get() : 10, 
                asc.isPresent() && asc.get() == false ? 
                    Sort.by(sortBy.get()).descending() : 
                    Sort.by(sortBy.get()).ascending()
            );
        } else {
            pageReq = PageRequest.of(
                page.isPresent() ? page.get() : 0, 
                size.isPresent() ? size.get() : 10
            );
        }

        return StreamSupport.stream(
            appointmentRepository.findByApptNameContainingIgnoreCaseOrUserNameContainingIgnoreCaseOrApptTypeContainingIgnoreCase(
                searchTermValue, searchTermValue, searchTermValue, pageReq
            ).spliterator(), false
        )
        .map(appointmentMapper::appointmentToAppointmentDto)
        .collect(Collectors.toList());
    }

    public void deleteAppointment(UUID appointmentId) {
        Optional<Appointment> appointment = appointmentRepository.findById(appointmentId);

        appointmentRepository.delete(
            appointment.orElseThrow(
                () -> new AppointmentNotFoundException("Appointment " + appointmentId + " not found")
            )
        );
    }

    public AppointmentDto createAppointment(AppointmentDto appointmentDto) {
        Boolean userExists = appointmentServiceProxy.userExists(appointmentDto.getUserId());

        if (!userExists) {
            throw new UserNotFoundException("User " + appointmentDto.getId() + " not found");
        }

        return appointmentMapper.appointmentToAppointmentDto(
            appointmentRepository.save(
                appointmentMapper.appointmentDtoToAppointment(appointmentDto)
            )
        );
    }

    public void updateAppointment(UUID appointmentId, AppointmentDto appointmentDto) { 
        Boolean userExists = appointmentServiceProxy.userExists(appointmentDto.getUserId());

        if (!userExists) {
            throw new UserNotFoundException("User " + appointmentDto.getId() + " not found");
        }

        Optional<Appointment> appointment = appointmentRepository.findById(appointmentId);
        Appointment updatedAppointment = appointmentMapper.appointmentDtoToAppointment(appointmentDto);

        if (appointment.isPresent()) {
            Appointment a = appointment.get();
            updatedAppointment.setId(a.getId());
            appointmentRepository.save(updatedAppointment);
        } else {
            throw new AppointmentNotFoundException("Appointment " + appointmentId + " not found");
        }

    }

    public void deleteAppointmentsByUserId(UUID userId) {
        List<Appointment> appointments = appointmentRepository.findByUserId(userId);
        appointments.stream().forEach(app -> appointmentRepository.delete(app));
    }
}
