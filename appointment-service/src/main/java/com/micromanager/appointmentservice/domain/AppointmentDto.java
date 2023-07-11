package com.micromanager.appointmentservice.domain;

import java.util.UUID;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.Builder.Default;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AppointmentDto {
    @Default
    private UUID id = UUID.randomUUID();

    @NotBlank
    private String apptName;

    @NotBlank
    private String apptType;

    private String description;

    private String startTime;
    
    private String endTime;

    private String metadata;

    private UUID userId;

    private String userName;

    @Override
    public String toString() {
        return this.apptName;
    }
}
