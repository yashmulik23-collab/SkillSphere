package com.skillsphere.dto;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class SessionDto {
    private Long skillId;
    private Long instructorId;
    private LocalDate sessionDate;
    private LocalTime sessionTime;
}
