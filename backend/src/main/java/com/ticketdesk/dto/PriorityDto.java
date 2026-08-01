package com.ticketdesk.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PriorityDto {
    private Long id;

    @NotBlank(message = "Priority name is required")
    private String name;

    private String description;
    private String colorCode;
    private Integer slaHours;
    private Instant createdAt;
}
