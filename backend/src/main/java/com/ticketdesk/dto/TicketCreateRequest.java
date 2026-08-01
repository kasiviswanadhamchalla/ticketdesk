package com.ticketdesk.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class TicketCreateRequest {
    @NotBlank(message = "Ticket title is required")
    @Size(min = 5, max = 200, message = "Title must be between 5 and 200 characters")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    @NotNull(message = "Priority ID is required")
    private Long priorityId;

    @NotNull(message = "Category ID is required")
    private Long categoryId;

    private Long assignedToId;
}
