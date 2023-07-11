package com.micromanager.appointmentservice.mapper;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public class DateMapper {
    public LocalDateTime stringToLocalDateTime(String ts) {
        DateTimeFormatter formatter = DateTimeFormatter.ISO_DATE_TIME;
        LocalDateTime localDateTime = LocalDateTime.parse(ts, formatter);
        return localDateTime;
    }

    public String localDateTimeToString(LocalDateTime ldt) {
        return ldt.toString();
    }
}
