package com.ticketdesk.dto;

import com.ticketdesk.entity.TicketStatus;
import lombok.Data;

@Data
public class TicketUpdateRequest {
    private String title;
    private String description;
    private Long priorityId;
    private Long categoryId;
    private Long assignedToId;
    private TicketStatus status;
}
