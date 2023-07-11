package com.micromanager.appointmentservice.mapper;

import org.mapstruct.InjectionStrategy;
import org.mapstruct.Mapper;

import com.micromanager.appointmentservice.domain.AppointmentDto;
import com.micromanager.appointmentservice.model.Appointment;

@Mapper(
    componentModel = "spring", 
    uses = {DateMapper.class}, 
    injectionStrategy = InjectionStrategy.CONSTRUCTOR
)
public interface AppointmentMapper {
    AppointmentDto appointmentToAppointmentDto(Appointment appointment);
    Appointment appointmentDtoToAppointment(AppointmentDto appointmentDto);
}
