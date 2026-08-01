package com.ticketdesk.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CommentCreateRequest {
    @NotBlank(message = "Comment content is required")
    private String content;

    private boolean internal = false;
}
