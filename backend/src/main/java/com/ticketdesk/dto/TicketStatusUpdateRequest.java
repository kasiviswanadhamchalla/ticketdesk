package com.ticketdesk.dto;

import com.ticketdesk.entity.TicketStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class TicketStatusUpdateRequest {
    @NotNull(message = "Status is required")
    private TicketStatus status;

    private String comment;
}
