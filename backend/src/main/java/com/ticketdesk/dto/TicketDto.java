package com.ticketdesk.dto;

import com.ticketdesk.entity.TicketStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TicketDto {
    private Long id;
    private String ticketNumber;
    private String title;
    private String description;
    private TicketStatus status;
    private PriorityDto priority;
    private CategoryDto category;
    private UserDto createdBy;
    private UserDto assignedTo;
    private List<CommentDto> comments;
    private List<AttachmentDto> attachments;
    private Instant createdAt;
    private Instant updatedAt;
    private Instant resolvedAt;
    private Instant closedAt;
}
